import { isLocale, type Locale } from "@/types/common";

export function switchLocalePath(pathname: string, targetLocale: Locale) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = normalizedPathname.split("/").filter(Boolean);

  if (parts.length > 0 && isLocale(parts[0])) {
    parts[0] = targetLocale;
  } else {
    parts.unshift(targetLocale);
  }

  return `/${parts.join("/")}`;
}

export function getLocalizedPaths(path = "") {
  const normalizedPath = path === "" || path.startsWith("/") ? path : `/${path}`;

  return {
    en: `/en${normalizedPath}`,
    vi: `/vi${normalizedPath}`,
  } satisfies Record<Locale, string>;
}
