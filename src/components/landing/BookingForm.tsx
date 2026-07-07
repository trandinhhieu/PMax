"use client";

import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { bookingSchema, type BookingField } from "@/lib/validation/booking";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

type FormStatus = "idle" | "submitting" | "error" | "success";
type FieldErrors = Partial<Record<BookingField, string>>;
type BookingApiResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
};

export function BookingForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const trackStartOnce = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent(trackingEvents.bookingStart, {
      location: "booking_section",
      page_language: locale,
    });
  };

  const localizeError = (field: BookingField, message: string) => {
    if (locale === "en") return message;

    const viMessages: Partial<Record<BookingField, string>> = {
      name: "Vui lòng nhập tên của bạn.",
      contact: "Vui lòng nhập số điện thoại hoặc kênh chat.",
      contactChannel: "Vui lòng chọn kênh liên hệ.",
      date: "Vui lòng chọn hôm nay hoặc một ngày sắp tới.",
      time: "Vui lòng chọn giờ.",
      guests: "Vui lòng nhập số khách từ 1 đến 20.",
      note: "Vui lòng giữ ghi chú dưới 300 ký tự.",
    };

    return viMessages[field] ?? message;
  };

  const fieldError = (field: BookingField) => errors[field];
  const defaultErrorMessage = locale === "en" ? "Please check the highlighted fields before sending." : "Vui long kiem tra cac truong bi loi truoc khi gui.";

  return (
    <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8" id="booking">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-tomato">{locale === "en" ? "Booking" : "Đặt bàn"}</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">{t.sections.bookingTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{t.sections.bookingBody}</p>
          <div className="mt-8 rounded-lg border border-borderWarm bg-porcelain p-5 text-sm leading-6 text-muted">
            {locale === "en"
              ? "This is a booking request, not an instant confirmation. Hermanos will confirm by your preferred channel."
              : "Đây là yêu cầu đặt bàn, không phải xác nhận tức thì. Hermanos sẽ xác nhận qua kênh bạn chọn."}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal hover:border-tomato"
              event={trackingEvents.clickCall}
              href={`tel:${businessInfo.phone}`}
              locale={locale}
              location="booking_form"
            >
              <Phone aria-hidden className="mr-2 h-4 w-4" />
              {locale === "en" ? "Call Hermanos" : "Gọi Hermanos"}
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal hover:border-tomato"
              event={trackingEvents.clickWhatsapp}
              external
              href={businessInfo.socials.whatsapp}
              locale={locale}
              location="booking_form"
            >
              <MessageCircle aria-hidden className="mr-2 h-4 w-4" />
              WhatsApp
            </TrackedLink>
          </div>
        </div>

        <form
          className="rounded-lg border border-borderWarm bg-porcelain p-6 pb-24 shadow-large md:pb-6"
          noValidate
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            setStatus("submitting");
            setErrors({});
            setSubmitMessage("");

            const formData = new FormData(form);
            const parsed = bookingSchema.safeParse({
              name: formData.get("name"),
              contact: formData.get("contact"),
              contactChannel: formData.get("contactChannel"),
              date: formData.get("date"),
              time: formData.get("time"),
              guests: formData.get("guests"),
              note: formData.get("note"),
            });

            trackEvent(trackingEvents.bookingSubmit, {
              location: "booking_section",
              page_language: locale,
            });

            if (!parsed.success) {
              const nextErrors: FieldErrors = {};
              for (const issue of parsed.error.issues) {
                const field = issue.path[0] as BookingField | undefined;
                if (field && !nextErrors[field]) {
                  nextErrors[field] = localizeError(field, issue.message);
                }
              }

              setErrors(nextErrors);
              setStatus("error");
              return;
            }
            let result: BookingApiResponse;
            let responseOk = false;

            try {
              const response = await fetch("/api/booking", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: parsed.data.name,
                  contact: parsed.data.contact,
                  contactChannel: parsed.data.contactChannel,
                  date: String(formData.get("date") ?? ""),
                  time: parsed.data.time,
                  guests: parsed.data.guests,
                  note: parsed.data.note,
                  locale,
                }),
              });
              responseOk = response.ok;
              result = (await response.json()) as BookingApiResponse;
            } catch {
              setErrors({});
              setSubmitMessage(t.form.error);
              setStatus("error");
              return;
            }

            if (!responseOk || !result.ok) {
              const nextErrors: FieldErrors = {};
              for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
                nextErrors[field as BookingField] = localizeError(field as BookingField, message);
              }

              setErrors(nextErrors);
              setSubmitMessage(result.message ?? t.form.error);
              setStatus("error");
              return;
            }

            setErrors({});
            setSubmitMessage("");
            setStatus("success");
            form.reset();
            try {
              trackEvent(trackingEvents.bookingSuccess, {
                location: "booking_section",
                page_language: locale,
                handoff_channel: "email",
              });
            } catch {
              // Tracking must never turn a successful booking into an error.
            }
          }}
        >
          {status === "error" ? (
            <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
              {submitMessage || defaultErrorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-name">
              {t.form.name}
              <input
                aria-describedby={fieldError("name") ? "booking-name-error" : undefined}
                aria-invalid={Boolean(fieldError("name"))}
                className="mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-name"
                name="name"
                onFocus={trackStartOnce}
                required
                type="text"
              />
              {fieldError("name") ? <span className="mt-2 block text-sm text-error" id="booking-name-error">{fieldError("name")}</span> : null}
            </label>

            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-contact">
              {t.form.phone}
              <input
                aria-describedby={fieldError("contact") ? "booking-contact-error" : undefined}
                aria-invalid={Boolean(fieldError("contact"))}
                className="mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-contact"
                name="contact"
                onFocus={trackStartOnce}
                required
                type="tel"
              />
              {fieldError("contact") ? <span className="mt-2 block text-sm text-error" id="booking-contact-error">{fieldError("contact")}</span> : null}
            </label>

            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-channel">
              {t.form.channel}
              <span className="relative mt-2 block">
                <select
                  aria-describedby={fieldError("contactChannel") ? "booking-channel-error" : undefined}
                  aria-invalid={Boolean(fieldError("contactChannel"))}
                  className="min-h-12 w-full appearance-none rounded-lg border border-borderWarm bg-white px-3 py-3 pr-12 text-base outline-none focus:border-olive"
                  id="booking-channel"
                  name="contactChannel"
                  onFocus={trackStartOnce}
                >
                  <option value="phone">{locale === "en" ? "Phone" : "Điện thoại"}</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="zalo">Zalo</option>
                  <option value="messenger">Facebook Messenger</option>
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal"
                  strokeWidth={2}
                />
              </span>
              {fieldError("contactChannel") ? <span className="mt-2 block text-sm text-error" id="booking-channel-error">{fieldError("contactChannel")}</span> : null}
            </label>

            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-date">
              {t.form.date}
              <input
                aria-describedby={fieldError("date") ? "booking-date-error" : undefined}
                aria-invalid={Boolean(fieldError("date"))}
                className="mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-date"
                min={minDate}
                name="date"
                onFocus={trackStartOnce}
                required
                type="date"
              />
              {fieldError("date") ? <span className="mt-2 block text-sm text-error" id="booking-date-error">{fieldError("date")}</span> : null}
            </label>

            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-time">
              {t.form.time}
              <input
                aria-describedby={fieldError("time") ? "booking-time-error" : undefined}
                aria-invalid={Boolean(fieldError("time"))}
                className="mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-time"
                max={businessInfo.openingHoursStructured.closes}
                min={businessInfo.openingHoursStructured.opens}
                name="time"
                onFocus={trackStartOnce}
                required
                type="time"
              />
              {fieldError("time") ? <span className="mt-2 block text-sm text-error" id="booking-time-error">{fieldError("time")}</span> : null}
            </label>

            <label className="text-sm font-semibold text-charcoal" htmlFor="booking-guests">
              {t.form.guests}
              <input
                aria-describedby={fieldError("guests") ? "booking-guests-error" : undefined}
                aria-invalid={Boolean(fieldError("guests"))}
                className="mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-guests"
                max={20}
                min={1}
                name="guests"
                onFocus={trackStartOnce}
                required
                type="number"
              />
              {fieldError("guests") ? <span className="mt-2 block text-sm text-error" id="booking-guests-error">{fieldError("guests")}</span> : null}
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-charcoal" htmlFor="booking-note">
            {t.form.note}
            <textarea
              aria-describedby={fieldError("note") ? "booking-note-error" : undefined}
              aria-invalid={Boolean(fieldError("note"))}
              className="mt-2 min-h-28 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
              id="booking-note"
              maxLength={300}
              name="note"
              onFocus={trackStartOnce}
            />
            {fieldError("note") ? <span className="mt-2 block text-sm text-error" id="booking-note-error">{fieldError("note")}</span> : null}
          </label>

          <p className="mt-3 text-sm text-muted">{t.form.privacy}</p>

          {status === "success" ? (
            <p className="mt-5 rounded-lg bg-success/10 px-4 py-3 text-sm font-bold text-success" role="status">
              {t.form.success}
            </p>
          ) : null}

          <button
            className="mt-6 min-h-12 w-full rounded-lg bg-tomato px-6 py-4 font-bold text-white transition hover:bg-tomato-hover disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === "submitting"}
            type="submit"
          >
            {status === "submitting" ? (locale === "en" ? "Sending..." : "Äang gá»­i...") : t.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

