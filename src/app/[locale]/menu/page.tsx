import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FloatingActionGroup } from "@/components/layout/FloatingActionGroup";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Stack } from "@/components/ui";
import { MenuCatalog, MenuDirectory } from "@/features/menu";
import { getMenuCopy } from "@/features/menu/menu.copy";
import { buildMenuPageGraph } from "@/lib/schema";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getMenuPageMetadata(locale: Locale) {
  const copy = getMenuCopy(locale);
  return {
    title:
      locale === "en"
        ? "Hermanos Full Menu | Pizza, Tacos, Pasta & Drinks"
        : "Menu Hermanos | Pizza, Taco, Pasta & \u0110\u1ED3 u\u1ED1ng",
    description: `${copy.page.body} ${copy.page.pricingValue}.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { description, title } = getMenuPageMetadata(locale);
  return buildLocalizedMetadata({
    locale,
    pathname: "/menu",
    title,
    description,
  });
}

export default async function MenuPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const copy = getMenuCopy(typedLocale);
  const { description, title } = getMenuPageMetadata(typedLocale);
  const schemaGraph = buildMenuPageGraph({
    locale: typedLocale,
    title,
    description,
  });

  return (
    <main className="bg-cream pb-14 pt-20 sm:pt-24" id="menu">
      {schemaGraph ? <JsonLd data={schemaGraph} /> : null}
      <Container>
        <section className="rounded-[2rem] border border-borderWarm bg-porcelain/80 p-6 shadow-small sm:p-8 lg:p-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-center">
            <Stack className="max-w-3xl" gap="md">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-tomato">{copy.page.eyebrow}</p>
                <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-charcoal sm:text-5xl lg:text-[3.5rem]">{copy.page.title}</h1>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">{copy.page.body}</p>
            </Stack>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" role="list">
              {copy.page.highlights.map((highlight) => (
                <li className="rounded-2xl border border-borderWarm bg-cream/80 px-4 py-3" key={highlight.title}>
                  <p className="font-display text-lg font-bold text-charcoal">{highlight.title}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{highlight.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <MenuCatalog locale={typedLocale} />
        <MenuDirectory locale={typedLocale} />
      </Container>
      <FloatingActionGroup locale={typedLocale} />
    </main>
  );
}
