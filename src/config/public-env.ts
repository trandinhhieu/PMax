import { normalizeGtmId, normalizePublicSiteUrl } from "./public-env-validation.mjs";

export function getConfiguredSiteUrl() {
  return normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getGtmId() {
  return normalizeGtmId(process.env.NEXT_PUBLIC_GTM_ID);
}
