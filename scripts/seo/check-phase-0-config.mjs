import {
  validateGtmId,
  validatePublicSiteUrl,
} from "../../src/config/public-env-validation.mjs";

const productionMode =
  process.argv.includes("--production") ||
  process.env.VERCEL_ENV?.trim().toLowerCase() === "production" ||
  process.env.SEO_PRODUCTION_GATE?.trim() === "1";

const validators = {
  NEXT_PUBLIC_SITE_URL: validatePublicSiteUrl,
  NEXT_PUBLIC_GTM_ID: validateGtmId,
};

const requiredInProduction = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_GTM_ID"];
const configuredValues = Object.fromEntries(
  Object.keys(validators).map((name) => [name, process.env[name]?.trim() ?? ""]),
);

let failures = 0;

for (const [name, validate] of Object.entries(validators)) {
  const value = configuredValues[name];
  const required = productionMode && requiredInProduction.includes(name);

  if (!value) {
    console.log(`${required ? "MISSING" : "SKIP"} ${name}${required ? " - required in production" : " - not configured"}`);
    if (required) failures += 1;
    continue;
  }

  const error = validate(value);
  console.log(`${error ? "INVALID" : "OK"} ${name}${error ? ` - ${error}` : ""}`);
  if (error) failures += 1;
}

if (failures > 0) {
  console.error(`Phase 0 configuration check failed with ${failures} error(s).`);
  process.exit(1);
}

console.log(`Phase 0 configuration check passed${productionMode ? " for production" : ""}.`);
