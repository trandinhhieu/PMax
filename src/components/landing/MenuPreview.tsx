"use client";

import Image from "next/image";
import { useState } from "react";
import { PriceTag } from "@/components/menu/PriceTag";
import { RecommendedBadge } from "@/components/menu/RecommendedBadge";
import type { Locale } from "@/types/common";
import { getMenuItemDescription, getMenuItemImage, getMenuPreviewItems, menuCategories, type MenuCategory } from "@/data/menu";
import { copy } from "@/data/content";
import { trackingCtaTypes, trackingEvents } from "@/config/tracking";
import { trackEvent } from "@/lib/analytics";
import { TrackedLink } from "./TrackedLink";

export function MenuPreview({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [active, setActive] = useState<MenuCategory>("pizza");
  const visibleItems = getMenuPreviewItems(active);

  return (
    <section className="bg-porcelain px-4 py-16 sm:px-6 lg:px-8" id="menu">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-wide text-tomato">Menu</p>
            <h2 className="font-display text-4xl font-bold text-charcoal sm:text-5xl">{t.sections.menuTitle}</h2>
            <p className="text-base leading-7 text-muted sm:text-lg">{t.sections.menuBody}</p>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Tap a category to preview a few representative dishes, then open the full menu for the complete list.
            </p>
          </div>
          <div className="hidden xl:flex xl:justify-end">
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-charcoal px-5 py-3 font-bold text-white transition hover:bg-charcoal/90"
              ctaType={trackingCtaTypes.menu}
              event={trackingEvents.viewMenu}
              href={`/${locale}/menu`}
              locale={locale}
              location="menu_preview"
            >
              View Full Menu
            </TrackedLink>
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {menuCategories.map((category) => (
            <button
              aria-pressed={active === category.id}
              className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-bold shadow-small transition ${
                active === category.id
                  ? "border-tomato bg-tomato text-white"
                  : "border-borderWarm bg-white text-charcoal hover:border-tomato hover:bg-porcelain"
              }`}
              key={category.id}
              onClick={() => {
                setActive(category.id);
                trackEvent(trackingEvents.menuCategoryClick, {
                  cta_type: trackingCtaTypes.menuCategory,
                  location: "menu_preview",
                  menu_category: category.id,
                  page_language: locale,
                });
              }}
              type="button"
            >
              {category.label[locale]}
            </button>
          ))}
        </div>
        {visibleItems.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((item) => {
              const image = getMenuItemImage(item);

              return (
                <button
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borderWarm bg-cream text-left shadow-small transition hover:-translate-y-1 hover:shadow-hover"
                  key={item.id}
                  onClick={() =>
                    trackEvent(trackingEvents.menuItemClick, {
                      cta_type: trackingCtaTypes.menuItem,
                      location: "menu_preview",
                      menu_category: item.category,
                      page_language: locale,
                      menu_item_id: item.id,
                    })
                  }
                  type="button"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-stoneWarm/40 sm:aspect-[4/3] lg:aspect-[16/11] xl:aspect-[4/3]">
                    <Image
                      alt={image.alt[locale]}
                      className={`${image.isPlaceholder ? "object-contain p-8" : "object-contain p-2 sm:p-3"} transition duration-200 group-hover:scale-[1.03]`}
                      decoding="async"
                      fill
                      loading="lazy"
                      quality={68}
                      sizes="(min-width: 1280px) 288px, (min-width: 1024px) 23vw, (min-width: 768px) 46vw, 92vw"
                      src={image.src}
                    />
                  </div>
                  <div className="flex min-h-[190px] flex-1 flex-col p-4">
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 className="line-clamp-2 min-w-0 font-display text-[1.45rem] font-bold leading-tight text-charcoal">{item.name}</h3>
                      {item.recommended ? <RecommendedBadge locale={locale} /> : null}
                    </div>
                    {getMenuItemDescription(item, locale) ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{getMenuItemDescription(item, locale)}</p> : null}
                    <div className="mt-3">
                      <PriceTag className="justify-start" compact price={item.price} prices={item.prices} />
                    </div>
                    {item.tags?.length ? (
                      <div className="mt-auto flex flex-wrap gap-2 pt-3">
                        {item.tags.map((tag) => (
                          <span className="rounded-full bg-porcelain px-3 py-1 text-xs font-bold text-olive" key={tag.en}>
                            #{tag[locale]}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-borderWarm bg-cream p-8 text-muted">
            {locale === "en" ? "More dishes are available at the restaurant." : "Quán còn nhiều món khác để bạn chọn tại chỗ."}
          </div>
        )}
      </div>
    </section>
  );
}
