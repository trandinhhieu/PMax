import Image from "next/image";
import { Instagram } from "lucide-react";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy, gallery } from "@/data/content";
import { TrackedLink } from "./TrackedLink";

export function GallerySection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="bg-charcoal px-4 py-20 text-white sm:px-6 lg:px-8" id="gallery">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-200">{locale === "en" ? "Gallery" : "Thư viện ảnh"}</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t.sections.galleryTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-stone-200">{t.sections.galleryBody}</p>
            <TrackedLink
              className="mt-6 inline-flex min-h-12 items-center rounded-lg border border-white/35 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              event={trackingEvents.socialClick}
              href={businessInfo.socials.instagram}
              locale={locale}
              location="gallery_section"
            >
              <Instagram aria-hidden className="mr-2 h-5 w-5" />
              {locale === "en" ? "Instagram" : "Instagram"}
            </TrackedLink>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div className={`relative overflow-hidden rounded-lg ${index === 0 ? "aspect-[4/5] md:col-span-2 md:row-span-2" : "aspect-square"}`} key={image.src}>
                <Image alt={image.alt[locale]} className="object-cover transition duration-200 hover:scale-[1.03]" fill sizes="(min-width: 1024px) 320px, 50vw" src={image.src} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
