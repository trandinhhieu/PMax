import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";
import { Container, Stack } from "@/components/ui";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-charcoal py-12 text-white">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <Stack gap="md">
            <p className="font-display text-2xl font-bold">Hermanos Wood-fired Pizza</p>
            <p className="max-w-md text-sm leading-6 text-stone-300">
              {locale === "en"
                ? "Fresh pizza, tacos, burgers and drinks in a cozy open-air space in Da Nang."
                : "Pizza, taco, burger và đồ uống trong không gian mở ấm cúng tại Đà Nẵng."}
            </p>
          </Stack>
          <Stack gap="sm" className="text-sm text-stone-300">
            <p className="flex gap-2">
              <MapPin aria-hidden className="h-4 w-4 text-fire" />
              {businessInfo.address[locale]}
            </p>
            <p className="flex gap-2">
              <Phone aria-hidden className="h-4 w-4 text-fire" />
              {businessInfo.displayPhone}
            </p>
            <p>{businessInfo.openingHours[locale]}</p>
          </Stack>
          <Stack gap="sm" className="justify-items-start text-sm font-bold">
            <a className="text-white underline-offset-4 hover:underline" href={businessInfo.googleMapsUrl} rel="noreferrer" target="_blank">
              {locale === "en" ? "Directions" : "Chỉ đường"}
            </a>
            <a className="text-white underline-offset-4 hover:underline" href={`tel:${businessInfo.phone}`}>
              {locale === "en" ? "Call" : "Gọi ngay"}
            </a>
            <Link className="text-white underline-offset-4 hover:underline" href={`/${locale}/privacy-policy`}>
              {locale === "en" ? "Privacy policy" : "Chính sách riêng tư"}
            </Link>
          </Stack>
        </div>
      </Container>
    </footer>
  );
}
