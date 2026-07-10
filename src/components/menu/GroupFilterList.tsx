"use client";

import { getMenuCopy } from "@/features/menu/menu.copy";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

type GroupFilter = {
  id: string;
  title: Record<Locale, string>;
};

type GroupFilterListProps = {
  activeGroupId: string;
  allCount: number;
  groups: GroupFilter[];
  groupCountMap: Record<string, number>;
  locale: Locale;
  onSelect: (groupId: string) => void;
  stacked?: boolean;
};

export function GroupFilterList({ activeGroupId, allCount, groups, groupCountMap, locale, onSelect, stacked = false }: GroupFilterListProps) {
  const copy = getMenuCopy(locale);

  return (
    <>
      <button
        aria-pressed={activeGroupId === "all"}
        className={cn(
          "inline-flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3.5 py-2 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-4",
          stacked && "w-full justify-between",
          activeGroupId === "all" ? "border-tomato bg-tomato text-white shadow-small" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
        )}
        onClick={() => onSelect("all")}
        type="button"
      >
        <span>{copy.filter.all}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-extrabold", activeGroupId === "all" ? "bg-white/14 text-white/80" : "bg-charcoal/6 text-muted")}>{allCount}</span>
      </button>
      {groups.map((group) => (
        <button
          aria-pressed={activeGroupId === group.id}
          className={cn(
            "inline-flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3.5 py-2 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-4",
            stacked && "w-full justify-between",
            activeGroupId === group.id ? "border-tomato bg-tomato text-white shadow-small" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
          )}
          key={group.id}
          onClick={() => onSelect(group.id)}
          type="button"
        >
          <span>{group.title[locale]}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.7rem] font-extrabold",
              activeGroupId === group.id ? "bg-white/14 text-white/80" : "bg-charcoal/6 text-muted",
            )}
          >
            {groupCountMap[group.id] ?? 0}
          </span>
        </button>
      ))}
    </>
  );
}