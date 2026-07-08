"use client";

import type { Locale } from "@/types/common";
import { CategoryTabs } from "./CategoryTabs";
import { GroupFilterList } from "./GroupFilterList";
import { MenuItemCard } from "./MenuItemCard";
import { useMenuCatalogController } from "./useMenuCatalogController";

type MenuCatalogProps = {
  locale: Locale;
};

export function MenuCatalog({ locale }: MenuCatalogProps) {
  const {
    activeCategory,
    activeCategoryMeta,
    activeGroups,
    activeGroupId,
    chooseCategory,
    chooseGroup,
    filteredItems,
    groupCountMap,
    hasMore,
    loadMore,
    nextCategory,
    sentinelRef,
    visibleCount,
    visibleItems,
    visibleTotalCount,
  } = useMenuCatalogController();

  return (
    <section className="mt-6 sm:mt-8" id="menu-catalog">
      <div className="sticky top-16 z-20 -mx-4 border-y border-borderWarm bg-cream/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 sm:py-3 md:top-[72px] lg:hidden">
        <nav aria-label={locale === "en" ? "Menu categories" : "Danh mục menu"}>
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">
            <CategoryTabs activeCategory={activeCategory} locale={locale} onSelect={chooseCategory} />
          </div>
        </nav>
        <nav aria-label={locale === "en" ? "Menu groups" : "Nhóm món"} className="mt-2 border-t border-borderWarm pt-2">
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
        aria-label={locale === "en" ? "Menu categories" : "Danh mục menu"}
        className="sticky top-[72px] z-20 -mx-8 hidden border-y border-borderWarm bg-cream/95 px-8 py-3 backdrop-blur lg:block"
      >
        <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">
          <CategoryTabs activeCategory={activeCategory} locale={locale} onSelect={chooseCategory} />
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
              <GroupFilterList
                activeGroupId={activeGroupId}
                allCount={visibleTotalCount}
                groupCountMap={groupCountMap}
                groups={activeGroups}
                locale={locale}
                onSelect={chooseGroup}
              />
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
                  onClick={loadMore}
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
