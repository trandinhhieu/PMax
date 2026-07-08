import { test, expect, type Browser, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

type ViewportName = "desktop" | "tablet" | "mobile";

type CrawlFailure = {
  url: string;
  error: string;
};

type ScreenshotRecord = {
  url: string;
  viewport: ViewportName;
  file: string;
};

const viewports: Record<ViewportName, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const preferredBaseUrls = [
  process.env.SCREENSHOT_BASE_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean) as string[];

const screenshotsDir = path.resolve(process.cwd(), "screenshots");

test.describe.configure({ mode: "serial" });

test("crawl internal pages and capture responsive full-page screenshots", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Screenshot crawler runs once on Chromium to avoid duplicate output.");
  test.setTimeout(10 * 60 * 1000);

  const baseUrl = await resolveBaseUrl();
  const origin = new URL(baseUrl).origin;
  const context = await browser.newContext({ viewport: viewports.desktop });
  const page = await context.newPage();

  const visited = new Set<string>();
  const queued = new Set<string>([normalizeUrl(baseUrl)]);
  const queue = [normalizeUrl(baseUrl)];
  const captured: ScreenshotRecord[] = [];
  const brokenLinks = new Set<string>();
  const httpErrors: CrawlFailure[] = [];
  const consoleErrors: CrawlFailure[] = [];
  const loginRequired = new Set<string>();
  const crawlFailures: CrawlFailure[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push({ url: page.url(), error: message.text() });
    }
  });

  page.on("response", (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && sameOrigin(url, origin)) {
      httpErrors.push({ url, error: String(status) });
    }
  });

  await fs.rm(screenshotsDir, { recursive: true, force: true });
  await fs.mkdir(screenshotsDir, { recursive: true });
  for (const viewportName of Object.keys(viewports) as ViewportName[]) {
    await fs.mkdir(path.join(screenshotsDir, viewportName), { recursive: true });
  }

  while (queue.length > 0) {
    const currentUrl = queue.shift()!;
    if (visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    const opened = await retry(async () => {
      const response = await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
      if (response && response.status() >= 400) {
        throw new Error(`HTTP ${response.status()}`);
      }
      await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
      await preparePage(page);
      return response;
    });

    if (!opened.ok) {
      crawlFailures.push({ url: currentUrl, error: opened.error });
      continue;
    }

    if (await isLoginPage(page)) {
      const creds = await findCredentials();
      if (creds) {
        const loggedIn = await tryLogin(page, creds);
        if (!loggedIn) {
          loginRequired.add(currentUrl);
        }
      } else {
        loginRequired.add(currentUrl);
      }
    }

    const links = await collectLinks(page, origin);
    for (const link of links) {
      if (!queued.has(link) && !visited.has(link)) {
        queued.add(link);
        queue.push(link);
      }
    }

    for (const viewportName of Object.keys(viewports) as ViewportName[]) {
      const record = await captureUrl(browser, currentUrl, viewportName, origin, consoleErrors, httpErrors);
      if (record.ok) {
        captured.push(record.value);
      } else {
        crawlFailures.push({ url: currentUrl, error: `${viewportName}: ${record.error}` });
      }
    }
  }

  await context.close();

  const reportPath = path.join(screenshotsDir, "report.md");
  await fs.writeFile(
    reportPath,
    buildReport({
      visited: [...visited],
      captured,
      brokenLinks: [...brokenLinks],
      httpErrors,
      consoleErrors,
      loginRequired: [...loginRequired],
      crawlFailures,
    }),
    "utf8",
  );

  expect(captured.length).toBeGreaterThan(0);
});

async function resolveBaseUrl(): Promise<string> {
  for (const candidate of preferredBaseUrls) {
    try {
      const response = await fetch(candidate, { signal: AbortSignal.timeout(2_500) });
      if (response.status < 500) {
        return candidate.replace(/\/$/, "");
      }
    } catch {
      // Try next common local URL.
    }
  }
  throw new Error(`No running app found at: ${preferredBaseUrls.join(", ")}`);
}

async function captureUrl(
  browser: Browser,
  url: string,
  viewportName: ViewportName,
  origin: string,
  consoleErrors: CrawlFailure[],
  httpErrors: CrawlFailure[],
): Promise<{ ok: true; value: ScreenshotRecord } | { ok: false; error: string }> {
  return retry(async () => {
    const context = await browser.newContext({ viewport: viewports[viewportName] });
    const page = await context.newPage();

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push({ url: page.url(), error: message.text() });
      }
    });
    page.on("response", (response) => {
      if (response.status() >= 400 && sameOrigin(response.url(), origin)) {
        httpErrors.push({ url: response.url(), error: String(response.status()) });
      }
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    if (response && response.status() >= 400) {
      throw new Error(`HTTP ${response.status()}`);
    }
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);

    await preparePage(page);
    const screenshotPath = path.join(screenshotsDir, viewportName, `${urlToFileName(url)}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await context.close();

    return {
      url,
      viewport: viewportName,
      file: path.relative(process.cwd(), screenshotPath).replaceAll("\\", "/"),
    };
  });
}

async function preparePage(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `,
  }).catch(() => undefined);
  await closeOverlays(page);
  await page.evaluate(async () => {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  });
  await scrollForLazyLoad(page);
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 3_000);
          const done = () => {
            window.clearTimeout(timeout);
            resolve();
          };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      }),
    );
  });
  await closeOverlays(page);
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  await page.waitForTimeout(800);
}

async function scrollForLazyLoad(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const distance = Math.max(window.innerHeight * 0.75, 400);
    for (let y = 0; y < document.documentElement.scrollHeight; y += distance) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    window.scrollTo(0, 0);
  });
}

async function closeOverlays(page: Page): Promise<void> {
  const names = [/accept/i, /agree/i, /close/i, /dismiss/i, /got it/i, /not now/i, /allow all/i, /x/i];
  for (const name of names) {
    const locator = page.getByRole("button", { name }).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 1_000 }).catch(() => undefined);
    }
  }
  await page.keyboard.press("Escape").catch(() => undefined);
}

async function collectLinks(page: Page, origin: string): Promise<string[]> {
  await openLikelyMenus(page);
  const links = await page.evaluate(() => {
    const urls = new Set<string>();
    const clickable = Array.from(document.querySelectorAll("a[href], button, [role='button'], [onclick]"));
    for (const element of clickable) {
      const anchor = element.closest("a[href]") as HTMLAnchorElement | null;
      const href = anchor?.href || element.getAttribute("data-href") || element.getAttribute("href") || "";
      if (href) urls.add(href);
    }
    return [...urls];
  });

  return [...new Set(links.map((link) => cleanLink(link, origin)).filter(Boolean) as string[])];
}

async function openLikelyMenus(page: Page): Promise<void> {
  const candidates = [
    page.getByRole("button", { name: /menu|open|navigation|hamburger/i }),
    page.locator("button[aria-expanded='false']").first(),
    page.locator("button:has(svg)").first(),
  ];

  for (const candidate of candidates) {
    if (await candidate.first().isVisible().catch(() => false)) {
      await candidate.first().click({ timeout: 1_500 }).catch(() => undefined);
      await page.waitForTimeout(300);
    }
  }
}

function cleanLink(raw: string, origin: string): string | null {
  try {
    const url = new URL(raw, origin);
    if (url.origin !== origin) return null;
    if (["mailto:", "tel:", "sms:", "whatsapp:"].includes(url.protocol)) return null;
    if (url.pathname.startsWith("/api/")) return null;
    if (/logout|signout/i.test(url.pathname)) return null;
    if (/\.(pdf|zip|docx?|xlsx?|csv|png|jpe?g|webp|gif|svg)$/i.test(url.pathname)) return null;
    url.hash = "";
    url.searchParams.sort();
    return normalizeUrl(url.toString());
  } catch {
    return null;
  }
}

function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = "";
  if (parsed.pathname !== "/") {
    parsed.pathname = parsed.pathname.replace(/\/$/, "");
  }
  return parsed.toString();
}

function sameOrigin(raw: string, origin: string): boolean {
  try {
    return new URL(raw).origin === origin;
  } catch {
    return false;
  }
}

function urlToFileName(url: string): string {
  const parsed = new URL(url);
  const name = parsed.pathname === "/" ? "home" : parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-");
  const query = parsed.searchParams.toString().replace(/[^a-z0-9]+/gi, "-");
  return [name, query].filter(Boolean).join("-").toLowerCase();
}

async function isLoginPage(page: Page): Promise<boolean> {
  const password = await page.locator("input[type='password']").count();
  if (password > 0) return true;
  return /login|sign in|signin|password/i.test(await page.locator("body").innerText({ timeout: 2_000 }).catch(() => ""));
}

async function findCredentials(): Promise<{ email: string; password: string } | null> {
  const files = [".env.local", ".env", ".env.example", "README.md", "docs/README.md"];
  for (const file of files) {
    const text = await fs.readFile(path.resolve(process.cwd(), file), "utf8").catch(() => "");
    const email = text.match(/(?:EMAIL|USER|USERNAME|LOGIN)[A-Z0-9_]*\s*=\s*["']?([^"'\s]+)["']?/i)?.[1];
    const password = text.match(/PASS(?:WORD)?[A-Z0-9_]*\s*=\s*["']?([^"'\s]+)["']?/i)?.[1];
    if (email && password) return { email, password };
  }
  return null;
}

async function tryLogin(page: Page, creds: { email: string; password: string }): Promise<boolean> {
  const emailInput = page.locator("input[type='email'], input[name*='email' i], input[name*='user' i]").first();
  const passwordInput = page.locator("input[type='password']").first();
  if (!(await emailInput.isVisible().catch(() => false)) || !(await passwordInput.isVisible().catch(() => false))) {
    return false;
  }
  await emailInput.fill(creds.email);
  await passwordInput.fill(creds.password);
  await page.getByRole("button", { name: /login|sign in|submit|continue/i }).first().click();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  return !(await isLoginPage(page));
}

async function retry<T>(operation: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false; error: string }> {
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return { ok: true, value: await operation() };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { ok: false, error: lastError };
}

function buildReport(data: {
  visited: string[];
  captured: ScreenshotRecord[];
  brokenLinks: string[];
  httpErrors: CrawlFailure[];
  consoleErrors: CrawlFailure[];
  loginRequired: string[];
  crawlFailures: CrawlFailure[];
}): string {
  const pageFiles = data.captured.map((item) => `- ${item.url} (${item.viewport}) -> ${item.file}`).join("\n") || "- None";
  const broken = data.brokenLinks.map((url) => `- ${url}`).join("\n") || "- None";
  const http = data.httpErrors.map((item) => `- ${item.url}: ${item.error}`).join("\n") || "- None";
  const console = data.consoleErrors.map((item) => `- ${item.url}: ${item.error}`).join("\n") || "- None";
  const login = data.loginRequired.map((url) => `- ${url}`).join("\n") || "- None";
  const failures = data.crawlFailures.map((item) => `- ${item.url}: ${item.error}`).join("\n") || "- None";
  const urls = data.visited.map((url) => `- ${url}`).join("\n") || "- None";

  return `# Screenshot Crawl Report

- Total pages visited: ${data.visited.length}
- Total screenshots captured: ${data.captured.length}

## URLs Visited
${urls}

## Screenshots
${pageFiles}

## Broken Links
${broken}

## HTTP Errors
${http}

## Console Errors
${console}

## Login Required Without Credentials
${login}

## Crawl Failures
${failures}
`;
}
