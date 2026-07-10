import { notFound } from "next/navigation";
import { Container, Stack } from "@/components/ui";
import { isLocale, type Locale } from "@/types/common";
import { thankYouCopy } from "./thank-you.copy";

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = thankYouCopy[locale as Locale];

  return (
    <main className="bg-cream pb-24 pt-32">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-borderWarm bg-porcelain/90 p-6 shadow-large sm:p-8 lg:p-10">
          <Stack gap="xl">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-tomato">{copy.eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">{copy.title}</h1>
              <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{copy.body}</p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              {copy.status.map((item) => (
                <div className="rounded-[1.5rem] border border-borderWarm bg-cream/85 p-5" key={item.label}>
                  <dt className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{item.label}</dt>
                  <dd className="mt-3 text-sm leading-7 text-charcoal sm:text-base">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Stack>
        </div>
      </Container>
    </main>
  );
}
