import Image from "next/image";
import { getMenuItemDescription, getMenuItemImage, getMenuItemNote, type MenuItem } from "@/data/menu";
import type { Locale } from "@/types/common";
import { PriceTag } from "./PriceTag";
import { RecommendedBadge } from "./RecommendedBadge";

type MenuItemCardProps = {
  item: MenuItem;
  locale: Locale;
  compact?: boolean;
};

function RecommendationSlot({ recommended, locale }: { recommended?: boolean; locale: Locale }) {
  return (
    <div className="mt-2 h-7">
      <RecommendedBadge hidden={!recommended} locale={locale} />
    </div>
  );
}

export function MenuItemCard({ item, locale, compact = false }: MenuItemCardProps) {
  const description = getMenuItemDescription(item, locale);
  const note = getMenuItemNote(item, locale);
  const image = getMenuItemImage(item);
  const showPlus = item.kind === "addon";

  if (compact) {
    return (
      <article className="flex min-h-16 items-start justify-between gap-3 rounded-lg border border-borderWarm bg-cream px-3.5 py-3 shadow-small transition hover:-translate-y-0.5 hover:border-tomato/50 hover:shadow-hover sm:items-center sm:gap-4 sm:px-4">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-charcoal">{item.name}</h4>
          <RecommendationSlot locale={locale} recommended={item.recommended} />
          {description ? <p className="mt-1 text-xs leading-5 text-muted">{description}</p> : null}
          {note ? <p className="mt-1 text-xs font-semibold text-olive">{note}</p> : null}
        </div>
        <PriceTag compact price={item.price} prices={item.prices} showPlus={showPlus} />
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-borderWarm bg-cream shadow-small transition hover:-translate-y-1 hover:border-tomato/50 hover:shadow-hover">
      <div className="relative aspect-[16/10] overflow-hidden bg-stoneWarm/45 sm:aspect-[4/3] lg:aspect-[16/11] xl:aspect-[4/3]">
        <Image
          alt={image.alt[locale]}
          className={`${image.isPlaceholder ? "object-contain p-8" : "object-contain p-2 sm:p-3"} transition duration-200 group-hover:scale-[1.03]`}
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
          src={image.src}
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:min-h-[190px] sm:p-4">
        <h3 className="line-clamp-2 font-display text-[1.35rem] font-bold leading-tight text-charcoal sm:min-h-[3.625rem] sm:text-[1.45rem]">{item.name}</h3>
        <RecommendationSlot locale={locale} recommended={item.recommended} />
        <div className="mt-2 sm:min-h-12">
          {description ? <p className="line-clamp-2 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {note ? <p className="mt-2 line-clamp-1 text-sm font-semibold text-olive">{note}</p> : null}
        <div className="mt-3">
          <PriceTag className="justify-start" price={item.price} prices={item.prices} showPlus={showPlus} />
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
    </article>
  );
}
