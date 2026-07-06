import { Flame, MapPinned, UsersRound } from "lucide-react";
import type { Locale } from "@/types/common";
import { copy } from "@/data/content";

const items = [
  { icon: Flame, en: "Wood-fired pizza", vi: "Pizza nướng củi" },
  { icon: UsersRound, en: "Date nights and groups", vi: "Hẹn hò và nhóm bạn" },
  { icon: MapPinned, en: "Near My Khe / Son Tra", vi: "Gần Mỹ Khê / Sơn Trà" },
];

export function WhySection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="bg-porcelain px-4 py-20 sm:px-6 lg:px-8" id="story">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-tomato">Hermanos</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">{t.sections.whyTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{t.sections.whyBody}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div className="rounded-lg border border-borderWarm bg-cream p-6 shadow-small" key={item.en}>
                <Icon aria-hidden className="h-8 w-8 text-fire" />
                <h3 className="mt-4 text-xl font-bold text-charcoal">{item[locale]}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
