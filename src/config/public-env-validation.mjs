const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

export function validatePublicSiteUrl(value) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return "must be configured";

  try {
    const url = new URL(normalizedValue);
    if (url.protocol !== "https:") return "must use https";
    if (url.pathname !== "/" || url.search || url.hash) {
      return "must be an origin without a path, query or hash";
    }
    return null;
  } catch {
    return "must be a valid absolute URL";
  }
}

export function normalizePublicSiteUrl(value) {
  if (validatePublicSiteUrl(value)) return undefined;
  return new URL(value.trim()).origin;
}

export function validateGtmId(value) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return "must be configured";
  return GTM_ID_PATTERN.test(normalizedValue) ? null : "must match GTM-XXXXXXX";
}

export function normalizeGtmId(value) {
  if (validateGtmId(value)) return undefined;
  return value.trim();
}
