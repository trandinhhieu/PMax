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
          className={cn(
            "inline-flex min-h-10 shrink-0 snap-start items-center rounded-lg border px-3.5 py-2 text-sm font-bold shadow-small transition sm:min-h-11 sm:px-4",
            activeCategory === category.id
              ? "border-tomato bg-tomato text-white"
              : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato hover:text-tomato",
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
