import { getConfiguredSiteUrl } from "@/config/public-env";
import { normalizePublicSiteUrl } from "@/config/public-env-validation.mjs";

export function getDeploymentUrl() {
  const publicSiteUrl = getConfiguredSiteUrl();
  if (publicSiteUrl) return publicSiteUrl;

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  return normalizePublicSiteUrl(vercelUrl) ?? "";
}
