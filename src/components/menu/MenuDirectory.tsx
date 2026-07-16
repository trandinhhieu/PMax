import {
  getMenuItemDescription,
  getMenuItemNote,
  menuCategories,
  menuGroups,
  menuItems,
} from "@/data/menu";
import { getMenuCopy } from "@/features/menu/menu.copy";
import type { Locale } from "@/types/common";
import { PriceTag } from "./PriceTag";
import { RecommendedBadge } from "./RecommendedBadge";

export function MenuDirectory({ locale }: { locale: Locale }) {
  const copy = getMenuCopy(locale);

  return (
    <section
      aria-labelledby="complete-menu-title"
      className="hidden"
      id="complete-menu"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-tomato">
          {copy.directory.eyebrow}
        </p>
        <h2
          className="sr-only"
          id="complete-menu-title"
        >
          {copy.directory.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          {copy.directory.body}
        </p>
      </div>

      <nav aria-label={copy.directory.categoriesLabel} className="mt-6">
        <ul className="flex flex-wrap gap-2" role="list">
          {menuCategories.map((category) => (
            <li key={category.id}>
              <a
                className="inline-flex min-h-11 items-center rounded-full border border-borderWarm bg-porcelain px-4 py-2 text-sm font-bold text-charcoal transition hover:border-tomato hover:text-tomato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                href={`#menu-directory-${category.id}`}
              >
                {category.label[locale]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 grid gap-4">
        {menuCategories.map((category) => {
          const categoryGroups = menuGroups.filter(
            (group) => group.category === category.id,
          );
          const categoryItems = menuItems.filter(
            (item) => item.category === category.id,
          );

          return (
            <details
              className="scroll-mt-28 rounded-[1.5rem] border border-borderWarm bg-porcelain/80 shadow-small"
              data-menu-category={category.id}
              id={`menu-directory-${category.id}`}
              key={category.id}
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-xl font-bold text-charcoal marker:hidden sm:px-6 sm:text-2xl">
                <span>{category.label[locale]}</span>
                <span className="shrink-0 font-sans text-xs font-bold uppercase tracking-[0.16em] text-olive">
                  {copy.counts.totalItems(categoryItems.length)}
                </span>
              </summary>

              <div className="border-t border-borderWarm px-5 pb-6 pt-5 sm:px-6">
                <h3 className="sr-only">{category.label[locale]}</h3>
                <p className="max-w-3xl text-sm leading-6 text-muted sm:text-base">
                  {category.description[locale]}
                </p>

                <nav
                  aria-label={`${category.label[locale]} — ${copy.nav.groups}`}
                  className="mt-4"
                >
                  <ul className="flex flex-wrap gap-2" role="list">
                    {categoryGroups.map((group) => (
                      <li key={group.id}>
                        <a
                          className="text-sm font-bold text-olive underline decoration-olive/30 underline-offset-4 hover:decoration-olive"
                          href={`#menu-directory-${category.id}-${group.id}`}
                        >
                          {group.title[locale]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 grid gap-8">
                  {categoryGroups.map((group) => {
                    const groupItems = categoryItems.filter(
                      (item) => item.groupId === group.id,
                    );
                    if (!groupItems.length) return null;

                    return (
                      <section
                        aria-labelledby={`menu-directory-${category.id}-${group.id}-title`}
                        className="scroll-mt-28"
                        id={`menu-directory-${category.id}-${group.id}`}
                        key={group.id}
                      >
                        <h4
                          className="font-display text-2xl font-bold text-charcoal"
                          id={`menu-directory-${category.id}-${group.id}-title`}
                        >
                          {group.title[locale]}
                        </h4>
                        {group.note ? (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                            {group.note[locale]}
                          </p>
                        ) : null}

                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {groupItems.map((item) => {
                            const description = getMenuItemDescription(item, locale);
                            const note = getMenuItemNote(item, locale);

                            return (
                              <article
                                className="flex min-h-24 items-start justify-between gap-4 rounded-2xl border border-borderWarm bg-cream/80 p-4"
                                data-menu-item-id={item.id}
                                key={item.id}
                              >
                                <div className="min-w-0">
                                  <h5 className="flex flex-wrap items-center gap-2 text-sm font-bold leading-5 text-charcoal">
                                    <span>{item.name}</span>
                                    {item.recommended ? (
                                      <RecommendedBadge locale={locale} />
                                    ) : null}
                                  </h5>
                                  {description ? (
                                    <p className="mt-1.5 text-xs leading-5 text-muted">
                                      {description}
                                    </p>
                                  ) : null}
                                  {note ? (
                                    <p className="mt-1.5 text-xs font-semibold leading-5 text-olive">
                                      {note}
                                    </p>
                                  ) : null}
                                </div>
                                <PriceTag
                                  className="shrink-0 justify-end"
                                  compact
                                  price={item.price}
                                  prices={item.prices}
                                  showPlus={item.kind === "addon"}
                                />
                              </article>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
