import type { Locale } from "@/types/common";
import { faq } from "@/data/content";

export function FaqSection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-porcelain px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-wide text-tomato">FAQ</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-charcoal">
          {locale === "en" ? "Questions before dinner" : "Những câu hỏi trước bữa tối"}
        </h2>
        <div className="mt-8 divide-y divide-borderWarm rounded-lg border border-borderWarm bg-cream">
          {faq[locale].map(([question, answer]) => (
            <details className="group p-5" key={question}>
              <summary className="cursor-pointer text-lg font-bold text-charcoal">{question}</summary>
              <p className="mt-3 leading-7 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
