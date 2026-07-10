import { Star } from "lucide-react";
import { getMenuCopy } from "@/features/menu/menu.copy";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

type RecommendedBadgeProps = {
  locale: Locale;
  className?: string;
};

export function RecommendedBadge({ locale, className }: RecommendedBadgeProps) {
  const copy = getMenuCopy(locale);

  return (
    <span className={cn("inline-flex shrink-0 align-middle text-tomato", className)} title={copy.badge.recommended}>
      <Star aria-hidden className="h-3.5 w-3.5 fill-current" />
      <span className="sr-only">{copy.badge.recommended}</span>
    </span>
  );
}
