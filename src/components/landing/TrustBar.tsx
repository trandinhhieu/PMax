import { Bike, Clock, Flame, MapPin } from "lucide-react";
import type { Locale } from "@/types/common";
import { copy, trustItems } from "@/data/content";

const icons = [Clock, MapPin, Flame, Bike];

export function TrustBar({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="border-b border-borderWarm bg-porcelain px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="sr-only">{t.sections.trustTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems[locale].map((item, index) => {
            const Icon = icons[index] ?? Flame;

            return (
              <div className="flex min-h-16 items-center gap-3 rounded-lg border border-borderWarm bg-cream px-4 py-3 text-sm font-bold text-charcoal" key={item}>
                <Icon aria-hidden className="h-5 w-5 shrink-0 text-olive" />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
