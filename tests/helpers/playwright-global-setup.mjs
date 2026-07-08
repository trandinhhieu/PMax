import { spawn, spawnSync } from "node:child_process";

const port = process.env.PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? process.env.SCREENSHOT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") {
    return;
  }

  if (!process.env.CI && (await isReachable(baseURL))) {
    return;
  }

  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", port],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    },
  );

  let stopped = false;

  function stopServer() {
    if (stopped) return;
    stopped = true;

    if (child.pid && process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  }

  process.once("exit", stopServer);

  try {
    await waitForServer(baseURL, 120_000);
  } catch (error) {
    stopServer();
    throw error;
  }

  return async () => {
    stopServer();
  };
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isReachable(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function isReachable(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2_500) });
    return response.status < 500;
  } catch {
    return false;
  }
}
