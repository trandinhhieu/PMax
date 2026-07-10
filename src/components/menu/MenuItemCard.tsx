import Image from "next/image";
import { getMenuItemDescription, getMenuItemImage, getMenuItemNote, type MenuItem } from "@/data/menu";
import { getMenuCopy } from "@/features/menu/menu.copy";
import type { Locale } from "@/types/common";
import { PriceTag } from "./PriceTag";
import { RecommendedBadge } from "./RecommendedBadge";

type MenuItemCardProps = {
  item: MenuItem;
  locale: Locale;
  compact?: boolean;
};

export function MenuItemCard({ item, locale, compact = false }: MenuItemCardProps) {
  const copy = getMenuCopy(locale);
  const description = getMenuItemDescription(item, locale);
  const note = getMenuItemNote(item, locale);
  const image = getMenuItemImage(item);
  const showPlus = item.kind === "addon";

  if (compact) {
    return (
      <article className="flex min-h-16 items-start justify-between gap-3 rounded-2xl border border-borderWarm bg-cream px-3.5 py-3 shadow-small transition hover:-translate-y-0.5 hover:border-tomato/50 hover:shadow-hover sm:items-center sm:gap-4 sm:px-4">
        <div className="min-w-0">
          <h4 className="flex items-center gap-1.5 text-sm font-bold leading-5 text-charcoal">
            <span>{item.name}</span>
            {item.recommended ? <RecommendedBadge locale={locale} /> : null}
          </h4>
          {description ? <p className="mt-1 text-xs leading-5 text-muted">{description}</p> : null}
          {note ? <p className="mt-1 text-xs font-semibold text-olive">{note}</p> : null}
        </div>
        <PriceTag className="justify-end" compact price={item.price} prices={item.prices} showPlus={showPlus} />
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-borderWarm bg-cream shadow-small transition hover:-translate-y-1 hover:border-tomato/50 hover:shadow-hover md:flex-row lg:flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-stoneWarm/45 md:aspect-auto md:w-[42%] md:shrink-0 lg:aspect-[4/3] lg:w-auto">
        <Image
          alt={image.alt[locale]}
          className={`${image.isPlaceholder ? "object-contain p-10 opacity-80" : "object-contain p-2 sm:p-3"} transition duration-200 group-hover:scale-[1.03]`}
          decoding="async"
          fill
          loading="lazy"
          quality={68}
          sizes="(min-width: 1280px) 370px, (min-width: 1024px) 30vw, (min-width: 768px) 40vw, 92vw"
          src={image.src}
        />
        {image.isPlaceholder ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
            <span className="rounded-full border border-borderWarm bg-cream/95 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-olive shadow-small">
              {copy.badge.noPhoto}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 md:p-4 xl:p-5">
        <div>
          <h3 className="flex min-w-0 items-center gap-2 font-display text-xl font-bold leading-tight text-charcoal xl:text-[1.35rem]">
            <span>{item.name}</span>
            {item.recommended ? <RecommendedBadge className="mt-0.5" locale={locale} /> : null}
          </h3>
        </div>
        <div className="mt-2.5">
          {description ? <p className="line-clamp-3 text-sm leading-6 text-muted">{description}</p> : null}
        </div>

        <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
          {note ? <p className="line-clamp-2 text-sm font-semibold leading-5 text-olive">{note}</p> : null}
          <PriceTag className="justify-start" price={item.price} prices={item.prices} showPlus={showPlus} />
          {item.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span className="rounded-full border border-olive/15 bg-porcelain px-3 py-1 text-xs font-bold leading-5 text-olive" key={tag.en}>
                  #{tag[locale]}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
