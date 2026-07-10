import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Stack } from "@/components/ui";
import { siteConfig } from "@/config/business";
import { getLocalizedPaths } from "@/lib/locale-routing";
import { isLocale, type Locale } from "@/types/common";
import { privacyPolicyCopy } from "./privacy-policy.copy";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = privacyPolicyCopy[locale];
  const localizedPaths = getLocalizedPaths("/privacy-policy");

  return {
    title: copy.title,
    alternates: {
      canonical: siteConfig.domain ? `${siteConfig.domain}/${locale}/privacy-policy` : undefined,
      languages: siteConfig.domain
        ? {
            en: `${siteConfig.domain}${localizedPaths.en}`,
            vi: `${siteConfig.domain}${localizedPaths.vi}`,
          }
        : undefined,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = privacyPolicyCopy[locale as Locale];

  return (
    <main className="min-h-[calc(100vh-312px)] bg-cream pb-16 pt-28">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-borderWarm bg-porcelain/85 p-6 shadow-small sm:p-8 lg:p-10">
          <Stack gap="xl">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-tomato">{copy.eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">{copy.title}</h1>
            </div>

            <div className="grid gap-4">
              {copy.sections.map((section) => (
                <section className="rounded-[1.5rem] border border-borderWarm bg-cream/80 p-5" key={section.title}>
                  <h2 className="font-display text-2xl font-bold text-charcoal">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{section.body}</p>
                </section>
              ))}
            </div>
          </Stack>
        </div>
      </Container>
    </main>
  );
}
