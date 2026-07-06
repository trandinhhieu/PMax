import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-charcoal px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-2xl font-bold">Hermanos Wood-fired Pizza</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">
            {locale === "en"
              ? "Fresh pizza, tacos, burgers and drinks in a cozy open-air space in Da Nang."
              : "Pizza, taco, burger và đồ uống trong không gian mở ấm cúng tại Đà Nẵng."}
          </p>
        </div>
        <div className="space-y-3 text-sm text-stone-300">
          <p className="flex gap-2">
            <MapPin aria-hidden className="h-4 w-4 text-fire" />
            {businessInfo.address[locale]}
          </p>
          <p className="flex gap-2">
            <Phone aria-hidden className="h-4 w-4 text-fire" />
            {businessInfo.displayPhone}
          </p>
          <p>{businessInfo.openingHours[locale]}</p>
        </div>
        <div className="grid gap-3 text-sm font-bold">
          <a className="text-white underline-offset-4 hover:underline" href={businessInfo.googleMapsUrl} rel="noreferrer" target="_blank">
            {locale === "en" ? "Directions" : "Chỉ đường"}
          </a>
          <a className="text-white underline-offset-4 hover:underline" href={`tel:${businessInfo.phone}`}>
            {locale === "en" ? "Call" : "Gọi ngay"}
          </a>
          <Link className="text-white underline-offset-4 hover:underline" href={`/${locale}/privacy-policy`}>
            {locale === "en" ? "Privacy policy" : "Chính sách riêng tư"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
