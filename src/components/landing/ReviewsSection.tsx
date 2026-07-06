import { ExternalLink, ShieldCheck } from "lucide-react";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy, reviewSources } from "@/data/content";
import { TrackedLink } from "./TrackedLink";

const sourceUrls = [businessInfo.googleMapsUrl, businessInfo.socials.tripadvisor, businessInfo.socials.facebook];

export function ReviewsSection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="bg-porcelain px-4 py-20 sm:px-6 lg:px-8" id="reviews">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full bg-olive/10 px-4 py-2 text-sm font-bold text-olive">
            <ShieldCheck aria-hidden className="mr-2 h-4 w-4" />
            {locale === "en" ? "Social proof" : "Tín hiệu tin cậy"}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-charcoal sm:text-5xl">{t.sections.reviewsTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{t.sections.reviewsBody}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviewSources[locale].map(([title, body], index) => (
            <article className="rounded-lg border border-borderWarm bg-cream p-6" key={title}>
              <h3 className="font-display text-2xl font-bold text-charcoal">{title}</h3>
              <p className="mt-3 leading-7 text-muted">{body}</p>
              <TrackedLink
                className="mt-5 inline-flex items-center font-bold text-tomato underline-offset-4 hover:underline"
                event={trackingEvents.reviewClick}
                external
                href={sourceUrls[index]}
                locale={locale}
                location="reviews_section"
              >
                {locale === "en" ? "Open source" : "Mở nguồn"}
                <ExternalLink aria-hidden className="ml-2 h-4 w-4" />
              </TrackedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
