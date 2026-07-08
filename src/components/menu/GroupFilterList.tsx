"use client";

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
};

export function GroupFilterList({ activeGroupId, allCount, groups, groupCountMap, locale, onSelect }: GroupFilterListProps) {
  return (
    <>
      <button
        className={cn(
          "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
          activeGroupId === "all" ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
        )}
        onClick={() => onSelect("all")}
        type="button"
      >
        {locale === "en" ? "All" : "Tất cả"}
        <span className="ml-2 text-xs opacity-70">{allCount}</span>
      </button>
      {groups.map((group) => (
        <button
          className={cn(
            "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
            activeGroupId === group.id ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
          )}
          key={group.id}
          onClick={() => onSelect(group.id)}
          type="button"
        >
          {group.title[locale]}
          <span className="ml-2 text-xs opacity-70">{groupCountMap[group.id] ?? 0}</span>
        </button>
      ))}
    </>
  );
}
