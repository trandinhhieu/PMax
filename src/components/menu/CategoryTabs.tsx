"use client";

import { menuCategories, type MenuCategory } from "@/data/menu";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

type CategoryTabsProps = {
  activeCategory: MenuCategory;
  locale: Locale;
  onSelect: (category: MenuCategory) => void;
};

export function CategoryTabs({ activeCategory, locale, onSelect }: CategoryTabsProps) {
  return (
    <>
      {menuCategories.map((category) => (
        <button
          aria-current={activeCategory === category.id ? "true" : undefined}
          aria-pressed={activeCategory === category.id}
          className={cn(
            "relative inline-flex min-h-10 shrink-0 snap-start items-center border-b-2 px-1.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-2",
            activeCategory === category.id
              ? "border-tomato text-tomato"
              : "border-transparent text-muted hover:border-borderWarm hover:text-charcoal",
          )}
          key={category.id}
          onClick={() => onSelect(category.id)}
          type="button"
        >
          {category.label[locale]}
        </button>
      ))}
    </>
  );
}
