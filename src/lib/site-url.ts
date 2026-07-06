function normalizeUrl(value: string | undefined) {
  if (!value || value.includes("TODO")) return "";

  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

export function getDeploymentUrl() {
  const publicSiteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (publicSiteUrl) return publicSiteUrl;

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  return normalizeUrl(vercelUrl);
}
