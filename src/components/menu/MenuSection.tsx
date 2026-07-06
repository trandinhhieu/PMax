import { menuGroups, menuItems, type MenuCategoryMeta } from "@/data/menu";
import type { Locale } from "@/types/common";
import { MenuItemCard } from "./MenuItemCard";

type MenuSectionProps = {
  category: MenuCategoryMeta;
  locale: Locale;
};

export function MenuSection({ category, locale }: MenuSectionProps) {
  const groups = menuGroups.filter((group) => group.category === category.id);

  return (
    <section className="scroll-mt-28 py-12" id={`menu-${category.id}`}>
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-tomato">{category.label[locale]}</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">{category.label[locale]}</h2>
        <p className="mt-4 text-lg leading-8 text-muted">{category.description[locale]}</p>
      </div>

      <div className="mt-8 space-y-10">
        {groups.map((group) => {
          const groupItems = menuItems.filter((item) => item.groupId === group.id);
          if (!groupItems.length) return null;

          const isCompact = group.layout === "compact";

          return (
            <div key={group.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-3xl font-bold text-charcoal">{group.title[locale]}</h3>
                  {group.note ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{group.note[locale]}</p> : null}
                </div>
              </div>
              <div className={isCompact ? "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
                {groupItems.map((item) => (
                  <MenuItemCard compact={isCompact} item={item} key={item.id} locale={locale} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
