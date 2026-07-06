"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { menuCategories, menuGroups, menuItems, type MenuCategory } from "@/data/menu";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { MenuItemCard } from "./MenuItemCard";

type MenuCatalogProps = {
  locale: Locale;
};

const pageSize = 12;

export function MenuCatalog({ locale }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("pizza");
  const [activeGroupId, setActiveGroupId] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const activeCategoryMeta = menuCategories.find((category) => category.id === activeCategory) ?? menuCategories[0];
  const activeCategoryIndex = menuCategories.findIndex((category) => category.id === activeCategory);
  const nextCategory = menuCategories[(activeCategoryIndex + 1) % menuCategories.length];
  const activeGroups = useMemo(() => menuGroups.filter((group) => group.category === activeCategory), [activeCategory]);
  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        if (item.category !== activeCategory) return false;
        if (activeGroupId === "all") return true;
        return item.groupId === activeGroupId;
      }),
    [activeCategory, activeGroupId],
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  useEffect(() => {
    setActiveGroupId("all");
    setVisibleCount(pageSize);
  }, [activeCategory]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeGroupId]);

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + pageSize, filteredItems.length));
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filteredItems.length, hasMore]);

  const chooseCategory = (category: MenuCategory) => {
    setActiveCategory(category);
    window.requestAnimationFrame(() => {
      document.getElementById("menu-catalog")?.scrollIntoView({ block: "start" });
    });
  };

  const chooseGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    window.requestAnimationFrame(() => {
      document.getElementById("menu-items")?.scrollIntoView({ block: "start" });
    });
  };

  const categoryButtons = menuCategories.map((category) => (
    <button
      className={cn(
        "inline-flex min-h-10 shrink-0 snap-start items-center rounded-lg border px-3.5 py-2 text-sm font-bold shadow-small transition sm:min-h-11 sm:px-4",
        activeCategory === category.id
          ? "border-tomato bg-tomato text-white"
          : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato hover:text-tomato",
      )}
      key={category.id}
      onClick={() => chooseCategory(category.id)}
      type="button"
    >
      {category.label[locale]}
    </button>
  ));

  const groupFilterButtons = (
    <>
      <button
        className={cn(
          "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
          activeGroupId === "all" ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
        )}
        onClick={() => chooseGroup("all")}
        type="button"
      >
        {locale === "en" ? "All" : "Tất cả"}
        <span className="ml-2 text-xs opacity-70">{menuItems.filter((item) => item.category === activeCategory).length}</span>
      </button>
      {activeGroups.map((group) => {
        const count = menuItems.filter((item) => item.groupId === group.id).length;

        return (
          <button
            className={cn(
              "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
              activeGroupId === group.id ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
            )}
            key={group.id}
            onClick={() => chooseGroup(group.id)}
            type="button"
          >
            {group.title[locale]}
            <span className="ml-2 text-xs opacity-70">{count}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <section className="mt-6 sm:mt-8" id="menu-catalog">
      <div className="sticky top-16 z-20 -mx-4 border-y border-borderWarm bg-cream/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 sm:py-3 md:top-[72px] lg:hidden">
        <nav aria-label={locale === "en" ? "Menu categories" : "Danh mục menu"}>
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">{categoryButtons}</div>
        </nav>
        <nav aria-label={locale === "en" ? "Menu groups" : "Nhóm món"} className="mt-2 border-t border-borderWarm pt-2">
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto">{groupFilterButtons}</div>
        </nav>
      </div>
      <nav
        aria-label={locale === "en" ? "Menu categories" : "Danh mục menu"}
        className="sticky top-[72px] z-20 -mx-8 hidden border-y border-borderWarm bg-cream/95 px-8 py-3 backdrop-blur lg:block"
      >
        <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">
          {menuCategories.map((category) => (
            <button
              className={cn(
                "inline-flex min-h-10 shrink-0 snap-start items-center rounded-lg border px-3.5 py-2 text-sm font-bold shadow-small transition sm:min-h-11 sm:px-4",
                activeCategory === category.id
                  ? "border-tomato bg-tomato text-white"
                  : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato hover:text-tomato",
              )}
              key={category.id}
              onClick={() => chooseCategory(category.id)}
              type="button"
            >
              {category.label[locale]}
            </button>
          ))}
        </div>
      </nav>

      <div className="py-6 sm:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
          <aside className="min-w-0 lg:sticky lg:top-36">
            <div className="border-b border-borderWarm pb-4 sm:pb-5">
              <p className="text-sm font-bold uppercase tracking-wide text-tomato">{activeCategoryMeta.label[locale]}</p>
              <p className="mt-2 text-sm leading-6 text-muted sm:mt-3">{activeCategoryMeta.description[locale]}</p>
            </div>
            <div className="scrollbar-none mt-5 hidden snap-x gap-2 overflow-x-auto lg:grid lg:overflow-visible lg:pb-0">
              <button
                className={cn(
                  "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
                  activeGroupId === "all" ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
                )}
                onClick={() => chooseGroup("all")}
                type="button"
              >
                {locale === "en" ? "All" : "Tất cả"}
                <span className="ml-2 text-xs opacity-70">{menuItems.filter((item) => item.category === activeCategory).length}</span>
              </button>
              {activeGroups.map((group) => {
                const count = menuItems.filter((item) => item.groupId === group.id).length;

                return (
                  <button
                    className={cn(
                      "min-h-10 shrink-0 snap-start rounded-lg border px-3.5 py-2 text-left text-sm font-bold transition sm:px-4",
                      activeGroupId === group.id ? "border-charcoal bg-charcoal text-white" : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato",
                    )}
                    key={group.id}
                    onClick={() => chooseGroup(group.id)}
                    type="button"
                  >
                    {group.title[locale]}
                    <span className="ml-2 text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="menu-items-anchor min-w-0" id="menu-items">
            <div className="mb-4 flex flex-col gap-2 border-b border-borderWarm pb-4 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-olive">
                  {locale === "en"
                    ? `${Math.min(visibleCount, filteredItems.length)} of ${filteredItems.length} items`
                    : `${Math.min(visibleCount, filteredItems.length)} / ${filteredItems.length} món`}
                </p>
              </div>
            </div>

            <div className="space-y-7 sm:space-y-8">
              {activeGroups.map((group) => {
                const groupItems = visibleItems.filter((item) => item.groupId === group.id);
                if (!groupItems.length) return null;

                const isCompact = group.layout === "compact";

                return (
                  <section key={group.id}>
                    <div className="mb-3">
                      <h4 className="font-display text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">{group.title[locale]}</h4>
                      {group.note ? <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{group.note[locale]}</p> : null}
                    </div>
                    <div className={isCompact ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"}>
                      {groupItems.map((item) => (
                        <MenuItemCard compact={isCompact} item={item} key={item.id} locale={locale} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {hasMore ? (
              <div className="mt-10 flex justify-center" ref={sentinelRef}>
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-borderWarm bg-porcelain px-5 py-3 text-sm font-bold text-charcoal shadow-small transition hover:border-tomato hover:text-tomato"
                  onClick={() => setVisibleCount((current) => Math.min(current + pageSize, filteredItems.length))}
                  type="button"
                >
                  {locale === "en" ? "Load more" : "Xem thêm"}
                </button>
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-lg border border-borderWarm bg-porcelain px-5 py-4 text-center text-sm font-bold text-olive sm:flex-row sm:text-left">
                <span>{locale === "en" ? "End of this category" : "Đã hết danh mục này"}</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-borderWarm bg-cream px-4 py-2 text-sm font-bold text-charcoal transition hover:border-tomato hover:text-tomato"
                    onClick={() => document.getElementById("menu-catalog")?.scrollIntoView({ block: "start" })}
                    type="button"
                  >
                    {locale === "en" ? "Back to top" : "Lên đầu menu"}
                  </button>
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-tomato px-4 py-2 text-sm font-bold text-white transition hover:bg-tomato-hover"
                    onClick={() => chooseCategory(nextCategory.id)}
                    type="button"
                  >
                    {locale === "en" ? `Explore ${nextCategory.label.en}` : `Xem ${nextCategory.label.vi}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
