export type Locale = "en" | "vi";

export type LocalizedText = Record<Locale, string>;

export const locales: Locale[] = ["en", "vi"];

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "vi";
}
