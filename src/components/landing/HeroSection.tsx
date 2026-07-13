import Image from "next/image";
import { businessInfo } from "@/config/business";
import { copy } from "@/data/content";
import type { Locale } from "@/types/common";

export function HeroSection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="relative min-h-[640px] overflow-hidden bg-charcoal text-white min-[600px]:min-h-[720px]">
      <div className="absolute inset-0">
        <Image
          priority
          alt=""
          className="object-cover object-[64%_center] min-[390px]:object-[61%_center] min-[600px]:object-[58%_center] lg:object-center"
          fetchPriority="high"
          fill
          quality={72}
          sizes="100vw"
          src={businessInfo.assets.hero}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/80 min-[600px]:from-black/15 min-[600px]:via-black/40 min-[600px]:to-black/75 lg:to-black/45" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#160d08]/70 via-[#160d08]/35 to-transparent min-[600px]:w-[90%] min-[600px]:from-[#160d08]/75 min-[600px]:via-[#160d08]/30 lg:w-[68%] lg:from-[#160d08]/85" />
      </div>

      <div className="relative mx-auto flex min-h-[640px] max-w-7xl items-start px-4 pb-24 pt-60 min-[390px]:px-5 min-[600px]:min-h-[720px] min-[600px]:px-6 min-[600px]:pb-24 min-[600px]:pt-[20.5rem] md:px-8 md:pt-[21rem] lg:items-center lg:px-8 lg:pb-16 lg:pt-20">
        <div className="w-full max-w-[36rem] md:max-w-[42.5rem] lg:max-w-[46rem]">
          <p className="mb-6 inline-flex rounded-full border border-white/25 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md min-[600px]:mb-7">
            {t.hero.eyebrow}
          </p>

          <h1 className="font-display text-5xl font-bold leading-[0.92] tracking-[-0.03em] min-[390px]:text-[3.25rem] min-[600px]:whitespace-nowrap min-[600px]:text-[3.5rem] md:text-[4rem] lg:text-[4.25rem]">
            <span className="block min-[600px]:inline">{t.hero.titleLead}</span>
            <span className="block min-[600px]:inline"> {t.hero.titleRest}</span>
          </h1>

          <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-6 text-white/90 min-[390px]:max-w-[40ch] min-[390px]:text-base min-[600px]:mt-6 min-[600px]:max-w-[34rem] min-[600px]:text-lg min-[600px]:leading-8 md:max-w-[38rem] lg:text-xl">
            {t.hero.body}
          </p>

          <p className="mt-5 max-w-xl text-[0.9375rem] font-semibold leading-6 text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] min-[600px]:mt-6">
            {t.hero.trustLine}
          </p>
        </div>
      </div>
    </section>
  );
}
