import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.env.SEO_CHECK_ROOT ?? process.cwd());
const results = [];

const requiredFiles = [
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/[locale]/thank-you/metadata.ts",
  "src/lib/seo/metadata.ts",
  "src/lib/schema.ts",
  "src/config/tracking-contract.mjs",
  "src/lib/analytics.ts",
  "tests/technical-seo.test.ts",
  "tests/schema.test.ts",
  "tests/seo-phase-3-tracking.test.ts",
  "tests/analytics-tracking.spec.ts",
  "tests/seo-guardrail.test.ts",
  "docs/initiatives/seo-phase-3/README.md",
  "docs/initiatives/seo-phase-3/ga4-gtm-configuration.md",
  "docs/initiatives/seo-phase-3/funnel-verification.md",
  "docs/initiatives/seo-phase-3/weekly-dashboard.md",
  "docs/initiatives/seo-phase-3/baseline-status.md",
];

function filePath(relativePath) {
  return resolve(root, relativePath);
}

function read(relativePath) {
  const absolutePath = filePath(relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

function record(name, passed, failureHint) {
  results.push({ name, passed, failureHint });
}

for (const relativePath of requiredFiles) {
  record(`file:${relativePath}`, existsSync(filePath(relativePath)), "Required SEO guardrail artifact is missing.");
}

const metadataSource = read("src/lib/seo/metadata.ts");
const sitemapSource = read("src/app/sitemap.ts");
const thankYouMetadataSource = read("src/app/[locale]/thank-you/metadata.ts");
const schemaSource = read("src/lib/schema.ts");
const analyticsSource = read("src/lib/analytics.ts");
const bookingFormSource = read("src/features/booking/presentation/useBookingForm.ts");
const packageSource = read("package.json");

record("metadata:x-default", /["']x-default["']/.test(metadataSource), "Localized metadata must keep x-default hreflang.");
record("sitemap:stable-last-modified", !/lastModified\s*:\s*(?:new Date|Date\.now)/.test(sitemapSource), "Sitemap must not generate runtime lastModified values.");
record("thank-you:noindex", /index\s*:\s*false/.test(thankYouMetadataSource) && /follow\s*:\s*false/.test(thankYouMetadataSource), "Thank-you metadata must remain noindex, nofollow.");
record("schema:linked-graphs", /buildHomePageGraph/.test(schemaSource) && /buildMenuPageGraph/.test(schemaSource) && /buildBreadcrumbListSchema/.test(schemaSource), "Linked homepage, menu, and breadcrumb schema builders are required.");
record("analytics:page-path", /page_path\s*:/.test(analyticsSource), "Analytics must attach page_path at runtime.");
record("analytics:dedupe", /trackEventOnce/.test(analyticsSource) && /new Set/.test(analyticsSource), "Analytics must provide an in-browser once-only event guard.");
record("booking:success-dedupe", /trackEventOnce\(trackingEvents\.bookingSuccess,\s*result\.emailId/.test(bookingFormSource), "booking_success must dedupe with the successful response key.");

let packageJson;
try {
  packageJson = JSON.parse(packageSource);
} catch {
  packageJson = undefined;
}

const seoCheckCommand = "node scripts/ai/check-seo-files.mjs";
record("build:seo-guardrail", packageJson?.scripts?.prebuild?.includes(seoCheckCommand) === true, "prebuild must run the SEO guardrail.");
record("build-production:seo-guardrail", packageJson?.scripts?.["build:production"]?.includes(seoCheckCommand) === true, "build:production must run the SEO guardrail.");

const trackingContractPath = filePath("src/config/tracking-contract.mjs");
if (existsSync(trackingContractPath)) {
  try {
    const contract = await import(pathToFileURL(trackingContractPath).href);
    const contractErrors = contract.validateTrackingContract();
    const commonParameters = contract.commonTrackingParameterNames ?? [];
    const outboundValues = Object.values(contract.outboundPlatforms ?? {});
    const funnelStepIds = (contract.ga4FunnelSteps ?? []).map((step) => step.id);

    record("tracking:contract", contractErrors.length === 0, contractErrors.join(" ") || "Tracking contract is invalid.");
    record("tracking:common-parameters", ["page_path", "page_language", "location", "cta_type"].every((parameter) => commonParameters.includes(parameter)), "Tracking contract is missing a required common parameter.");
    record("tracking:outbound-platforms", ["google_maps", "facebook", "instagram", "tripadvisor", "tiktok"].every((platform) => outboundValues.includes(platform)), "Tracking contract is missing a required outbound platform.");
    record("tracking:ga4-funnel", ["landing", "menu_or_booking_start", "booking_submit", "booking_success"].every((step) => funnelStepIds.includes(step)), "Tracking contract is missing an approved GA4 funnel step.");
  } catch (error) {
    record("tracking:contract", false, error instanceof Error ? error.message : "Tracking contract could not be loaded.");
  }
}

let failures = 0;
for (const result of results) {
  console.log(`${result.passed ? "OK" : "ERROR"} ${result.name}${result.passed ? "" : ` - ${result.failureHint}`}`);
  if (!result.passed) failures += 1;
}

if (failures > 0) {
  console.error(`SEO guardrail failed with ${failures} error(s).`);
  process.exit(1);
}

console.log(`SEO guardrail passed with ${results.length} check(s).`);
