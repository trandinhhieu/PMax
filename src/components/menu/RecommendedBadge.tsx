import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

type RecommendedBadgeProps = {
  locale: Locale;
  className?: string;
  hidden?: boolean;
};

export function RecommendedBadge({ locale, className, hidden = false }: RecommendedBadgeProps) {
  return (
    <span
      aria-hidden={hidden}
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full bg-tomato/12 px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-tomato ring-1 ring-tomato/20",
        hidden && "invisible",
        className,
      )}
    >
      <Flame aria-hidden className="mr-1.5 h-3.5 w-3.5" />
      {locale === "en" ? "Recommended" : "Đề xuất"}
    </span>
  );
}
