"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Stack } from "@/components/ui";
import { trackingCtaTypes, trackingEvents } from "@/config/tracking";
import { menuItems } from "@/data/menu";
import { getMenuCopy } from "@/features/menu/menu.copy";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";
import { CategoryTabs } from "./CategoryTabs";
import { GroupFilterList } from "./GroupFilterList";
import { MenuItemCard } from "./MenuItemCard";
import { useMenuCatalogController } from "./useMenuCatalogController";

type MenuCatalogProps = {
  locale: Locale;
};

export function MenuCatalog({ locale }: MenuCatalogProps) {
  const copy = getMenuCopy(locale);
  const desktopCategoryNavMeasureRef = useRef<HTMLElement>(null);
  const [desktopCategoryNavHeight, setDesktopCategoryNavHeight] = useState(120);
  const {
    activeCategory,
    activeCategoryMeta,
    activeGroupMeta,
    activeGroups,
    activeGroupId,
    catalogRef,
    chooseCategory,
    chooseGroup,
    displayGroups,
    filteredItems,
    groupCountMap,
    hasMore,
    loadMore,
    mobileNavigationRef,
    nextCategory,
    resetGroup,
    scrollToCatalog,
    itemsRef,
    sentinelRef,
    visibleCount,
    visibleItems,
    visibleTotalCount,
    desktopNavigationRef,
  } = useMenuCatalogController();
  const visibleItemCount = Math.min(visibleCount, filteredItems.length);
  const activeCategoryPrices = menuItems
    .filter((item) => item.category === activeCategory)
    .flatMap((item) => [item.price, ...Object.values(item.prices ?? {})])
    .filter((price): price is number => typeof price === "number");
  const priceRange = activeCategoryPrices.length
    ? copy.sidebar.priceRange(Math.min(...activeCategoryPrices), Math.max(...activeCategoryPrices))
    : copy.sidebar.priceUnavailable;

  const selectCategory = (category: typeof activeCategory) => {
    chooseCategory(category);
    trackEvent(trackingEvents.menuCategoryClick, {
      cta_type: trackingCtaTypes.menuCategory,
      location: "menu_catalog",
      menu_category: category,
      page_language: locale,
    });
  };

  useEffect(() => {
    const navigation = desktopCategoryNavMeasureRef.current;
    if (!navigation) return;

    const updateHeight = () => setDesktopCategoryNavHeight(navigation.getBoundingClientRect().height);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(navigation);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section className="mt-6 sm:mt-8" id="menu-catalog" ref={catalogRef}>
      <div className="sticky top-16 z-20 -mx-4 border-y border-borderWarm bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:top-[72px] lg:hidden" ref={mobileNavigationRef}>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted">{copy.nav.currentCategory}</p>
            <p className="mt-1 text-sm font-bold text-charcoal">{activeCategoryMeta.label[locale]}</p>
          </div>
          <p className="text-right text-xs font-semibold text-olive">{copy.counts.items(visibleItemCount, filteredItems.length)}</p>
        </div>

        <nav aria-label={copy.nav.categories}>
          <div className="scrollbar-none flex snap-x gap-5 overflow-x-auto pb-1">
            <CategoryTabs activeCategory={activeCategory} locale={locale} onSelect={selectCategory} />
          </div>
        </nav>
        <nav aria-label={copy.nav.groups} className="mt-3 border-t border-borderWarm pt-3">
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto">
            <GroupFilterList
              activeGroupId={activeGroupId}
              allCount={visibleTotalCount}
              groupCountMap={groupCountMap}
              groups={activeGroups}
              locale={locale}
              onSelect={chooseGroup}
            />
          </div>
        </nav>
      </div>

      <nav
        aria-label={copy.nav.categories}
        className="sticky top-[72px] z-20 -mx-8 hidden border-y border-borderWarm bg-cream/95 px-8 py-4 backdrop-blur lg:block"
        ref={(navigation) => {
          desktopCategoryNavMeasureRef.current = navigation;
          desktopNavigationRef.current = navigation;
        }}
      >
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-muted">{copy.nav.currentCategory}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-display text-2xl font-bold text-charcoal">{activeCategoryMeta.label[locale]}</p>
              <p className="text-sm text-muted">{copy.counts.items(visibleItemCount, filteredItems.length)}</p>
            </div>
          </div>
         </div>
        <div className="scrollbar-none mt-2 flex snap-x gap-5 overflow-x-auto pb-1">
          <CategoryTabs activeCategory={activeCategory} locale={locale} onSelect={selectCategory} />
        </div>
      </nav>

      <div className="py-5 sm:py-6">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start xl:gap-7">
          <aside
            className="min-w-0 lg:sticky"
            style={{ top: `calc(72px + ${desktopCategoryNavHeight}px + 1rem)` }}
          >
            <Stack gap="md">
              <div className="rounded-[1.25rem] bg-white/55 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-tomato">{copy.sidebar.title}</p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-charcoal">{activeCategoryMeta.label[locale]}</h2>
                                 <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl border border-borderWarm bg-cream/80 p-3">
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted">{copy.sidebar.priceRangeLabel}</dt>
                    <dd className="mt-1.5 font-display text-lg font-bold leading-tight text-charcoal">{priceRange}</dd>
                  </div>
                  <div className="rounded-2xl border border-borderWarm bg-cream/80 p-3">
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted">{copy.sidebar.pricingLabel}</dt>
                    <dd className="mt-1.5 text-sm font-bold leading-5 text-charcoal">{copy.sidebar.pricingValue}</dd>
                  </div>
                </dl>
              </div>

              <div className="hidden rounded-[1.75rem] border border-borderWarm bg-porcelain/80 p-4 shadow-small lg:block">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{copy.sidebar.jumpBetweenGroups}</p>
                <div className="mt-4 grid gap-2">
                  <GroupFilterList
                    activeGroupId={activeGroupId}
                    allCount={visibleTotalCount}
                    groupCountMap={groupCountMap}
                    groups={activeGroups}
                    locale={locale}
                    onSelect={chooseGroup}
                    stacked
                  />
                </div>
              </div>
            </Stack>
          </aside>

          <div className="menu-items-anchor min-w-0 scroll-mt-44 lg:scroll-mt-[10.5rem]" id="menu-items" ref={itemsRef}>
            <div className="mb-5 rounded-[1.75rem] border border-borderWarm bg-porcelain/80 p-5 shadow-small sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-tomato">{copy.results.showingNow}</p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold leading-tight text-charcoal">
                    {activeGroupMeta ? activeGroupMeta.title[locale] : copy.results.allItems}
                  </h3>
                  {activeGroupMeta?.note ? <p className="mt-2 text-sm leading-6 text-muted">{activeGroupMeta.note[locale]}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-h-11 items-center rounded-full border border-borderWarm bg-cream px-4 py-2 text-sm font-bold text-olive">
                    {copy.counts.items(visibleItemCount, filteredItems.length)}
                  </span>
                  {activeGroupId !== "all" ? (
                    <Button className="rounded-full" onClick={resetGroup} size="md" variant="secondary">
                      {copy.results.showAllGroups}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {!filteredItems.length ? (
              <div className="rounded-[1.75rem] border border-dashed border-borderWarm bg-white/80 p-6 shadow-small sm:p-8">
                <h4 className="font-display text-2xl font-bold text-charcoal">{copy.empty.title}</h4>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{copy.empty.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button className="rounded-full" onClick={resetGroup} size="md" variant="secondary">
                    {copy.results.showAllGroups}
                  </Button>
                  <Button className="rounded-full" onClick={() => selectCategory(nextCategory.id)} size="md" variant="primary">
                    {copy.results.viewNextCategory(nextCategory.label[locale])}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-7">
                {displayGroups.map((group) => {
                  const groupItems = visibleItems.filter((item) => item.groupId === group.id);
                  if (!groupItems.length) return null;

                  const isCompact = group.layout === "compact";

                  return (
                    <section key={group.id}>
                      <div className="mb-3 border-b border-borderWarm/70 pb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-display text-2xl font-bold leading-tight text-charcoal">{group.title[locale]}</h4>
                          <span className="text-xs font-semibold text-muted">
                            {copy.counts.totalItems(groupItems.length)}
                          </span>
                        </div>
                        {group.note ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{group.note[locale]}</p> : null}
                      </div>
                      <div className={isCompact ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"}>
                        {groupItems.map((item) => (
                          <MenuItemCard compact={isCompact} item={item} key={item.id} locale={locale} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {hasMore ? (
              <div className="mt-8 flex justify-center" ref={sentinelRef}>
                <Button className="rounded-full" onClick={loadMore} size="lg" variant="secondary">
                  {copy.results.loadMore}
                </Button>
              </div>
            ) : filteredItems.length ? (
              <div className="mt-8 rounded-[1.5rem] border border-borderWarm bg-porcelain/90 p-5 shadow-small sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h4 className="font-display text-2xl font-bold text-charcoal">{copy.endState.title}</h4>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{copy.endState.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeGroupId !== "all" ? (
                      <Button className="rounded-full" onClick={resetGroup} size="md" variant="secondary">
                        {copy.results.allGroups}
                      </Button>
                    ) : null}
                    <Button className="rounded-full" onClick={scrollToCatalog} size="md" variant="secondary">
                      {copy.results.backToTop}
                    </Button>
                    <Button className="rounded-full" onClick={() => selectCategory(nextCategory.id)} size="md" variant="primary">
                      {copy.results.viewNextCategory(nextCategory.label[locale])}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
