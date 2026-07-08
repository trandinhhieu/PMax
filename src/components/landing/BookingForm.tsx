"use client";

import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { formatDateStringInTimeZone } from "@/lib/date";
import { bookingSchema, type BookingField } from "@/lib/validation/booking";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

type FormStatus = "idle" | "submitting" | "error" | "success";
type OtpStatus = "idle" | "sending" | "sent" | "error";
type BookingFormField = BookingField | "otpCode";
type FieldErrors = Partial<Record<BookingFormField, string>>;

type BookingApiResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
};

type OtpApiResponse = {
  ok: boolean;
  message?: string;
};

type RequiredValues = {
  name: string;
  contact: string;
  contactChannel: string;
  date: string;
  time: string;
  guests: string;
  otpCode?: string;
};

const initialRequiredValues: RequiredValues = {
  name: "",
  contact: "",
  contactChannel: "phone",
  date: "",
  time: "",
  guests: "",
  otpCode: "",
};

const isOtpEnabled = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED?.toLowerCase() === "true";

function RequiredMark() {
  return (
    <span aria-hidden className="ml-1 text-error">
      *
    </span>
  );
}

export function BookingForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<FormStatus>("idle");
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpContact, setOtpContact] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [requiredValues, setRequiredValues] = useState<RequiredValues>(initialRequiredValues);
  const [canSubmitBooking, setCanSubmitBooking] = useState(false);

  const minDate = useMemo(() => formatDateStringInTimeZone(new Date(), businessInfo.timeZone), []);
  const hasValidContact = requiredValues.contact.trim().length >= 6;

  const canSubmitValues = (values: RequiredValues) => {
    const guests = Number(values.guests);
    const hasValidGuests = Number.isInteger(guests) && guests >= 1 && guests <= 20;
    const hasValidRequiredFields =
      values.name.trim().length >= 2 &&
      values.contact.trim().length >= 6 &&
      ["phone", "whatsapp", "zalo", "messenger"].includes(values.contactChannel) &&
      values.date >= minDate &&
      Boolean(values.time) &&
      hasValidGuests;
    const hasValidOtp =
      !isOtpEnabled ||
      (/^\d{4,10}$/.test(values.otpCode?.trim() ?? "") && otpStatus === "sent" && otpContact === values.contact.trim());

    return hasValidRequiredFields && hasValidOtp;
  };

  const trackStartOnce = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent(trackingEvents.bookingStart, {
      location: "booking_section",
      page_language: locale,
    });
  };

  const localizeError = (field: BookingFormField, message: string) => {
    if (locale === "en") return message;

    const viMessages: Partial<Record<BookingFormField, string>> = {
      name: "Vui lòng nhập tên của bạn.",
      contact: isOtpEnabled ? "Vui lòng nhập số điện thoại để nhận mã SMS." : "Vui lòng nhập số điện thoại hoặc WhatsApp.",
      contactChannel: "Vui lòng chọn kênh liên hệ.",
      date: "Vui lòng chọn hôm nay hoặc một ngày sắp tới.",
      time: "Vui lòng chọn giờ.",
      guests: "Vui lòng nhập số khách từ 1 đến 20.",
      note: "Vui lòng giữ ghi chú dưới 300 ký tự.",
      otpCode: "Vui lòng nhập mã xác thực SMS.",
    };

    return viMessages[field] ?? message;
  };

  const fieldError = (field: BookingFormField) => errors[field];
  const defaultErrorMessage = locale === "en" ? "Please check the highlighted fields before sending." : "Vui lòng kiểm tra các trường bị lỗi trước khi gửi.";
  const applyRequiredValues = (values: RequiredValues) => {
    setRequiredValues(values);
    setCanSubmitBooking(canSubmitValues(values));
  };

  const syncRequiredValues = (form: HTMLFormElement) => {
    const formData = new FormData(form);

    applyRequiredValues({
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? ""),
      contactChannel: String(formData.get("contactChannel") ?? "phone"),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
      guests: String(formData.get("guests") ?? ""),
      otpCode: String(formData.get("otpCode") ?? ""),
    });
  };

  const updateRequiredValue = (field: keyof RequiredValues, value: string) => {
    setRequiredValues((current) => {
      const next = { ...current, [field]: value };
      setCanSubmitBooking(canSubmitValues(next));
      return next;
    });

    if (isOtpEnabled && field === "contact" && value.trim() !== otpContact) {
      setOtpStatus("idle");
      setOtpMessage("");
      setOtpContact("");
      setErrors((current) => ({ ...current, otpCode: undefined }));
    }

    if (status === "success") {
      setStatus("idle");
    }
  };

  const requestOtp = async (form: HTMLFormElement) => {
    setOtpStatus("sending");
    setOtpMessage("");
    setSubmitMessage("");
    setErrors((current) => ({ ...current, contact: undefined, otpCode: undefined }));

    const formData = new FormData(form);
    const contact = String(formData.get("contact") ?? "").trim();

    if (!contact) {
      setErrors((current) => ({
        ...current,
        contact: localizeError("contact", "Please enter a phone number before requesting OTP."),
      }));
      setOtpStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/booking/otp/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact }),
      });
      const result = (await response.json()) as OtpApiResponse;

      if (!response.ok || !result.ok) {
        setOtpStatus("error");
        setOtpMessage(result.message ?? (locale === "en" ? "We could not send the verification code." : "Không thể gửi mã xác thực."));
        return;
      }

      setOtpStatus("sent");
      setOtpContact(contact);
      setOtpMessage(locale === "en" ? "Verification code sent by SMS." : "Mã xác thực đã được gửi qua SMS.");
    } catch {
      setOtpStatus("error");
      setOtpMessage(locale === "en" ? "We could not send the verification code." : "Không thể gửi mã xác thực.");
    }
  };

  return (
    <section className="safe-area-inline overflow-x-clip bg-cream py-20" id="booking">
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
          className="overflow-x-clip rounded-lg border border-borderWarm bg-porcelain p-5 pb-24 shadow-large sm:p-6 md:pb-6"
          noValidate
          onChange={(event) => syncRequiredValues(event.currentTarget)}
          onInput={(event) => syncRequiredValues(event.currentTarget)}
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
            const otpCode = String(formData.get("otpCode") ?? "").trim();

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

            if (isOtpEnabled && !otpCode) {
              setErrors({ otpCode: localizeError("otpCode", "Please enter the SMS verification code.") });
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
                  otpCode: isOtpEnabled ? otpCode : undefined,
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
                nextErrors[field as BookingFormField] = localizeError(field as BookingFormField, message);
              }

              setErrors(nextErrors);
              setSubmitMessage(result.message ?? t.form.error);
              setStatus("error");
              return;
            }

            setErrors({});
            setSubmitMessage("");
            setStatus("success");
            setOtpStatus("idle");
            setOtpMessage("");
            setOtpContact("");
            setRequiredValues(initialRequiredValues);
            setCanSubmitBooking(false);
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
          <p className="mb-5 rounded-lg border border-borderWarm bg-white px-4 py-3 text-sm font-semibold text-muted">
            {isOtpEnabled
              ? locale === "en"
                ? "Enter your phone number first, request the SMS code, then complete the booking details."
                : "Nhập số điện thoại, lấy mã SMS, rồi hoàn tất thông tin đặt bàn."
              : locale === "en"
                ? "Share your contact details and preferred table time below."
                : "Điền thông tin liên hệ và thời gian bạn muốn đặt bàn bên dưới."}
          </p>

          {status === "error" ? (
            <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
              {submitMessage || defaultErrorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-contact">
              {t.form.phone}
              <RequiredMark />
              <span className="mt-2 flex min-w-0 gap-2">
                <input
                  aria-describedby={fieldError("contact") ? "booking-contact-error" : undefined}
                  aria-invalid={Boolean(fieldError("contact"))}
                  className="ios-form-control min-h-12 flex-1 rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                  id="booking-contact"
                  name="contact"
                  onChange={(event) => updateRequiredValue("contact", event.currentTarget.value)}
                  onFocus={trackStartOnce}
                  onInput={(event) => updateRequiredValue("contact", event.currentTarget.value)}
                  placeholder="+84905906842"
                  required
                  type="tel"
                />
                {isOtpEnabled ? (
                  <button
                    className="min-h-12 shrink-0 rounded-lg border border-borderWarm bg-charcoal px-4 py-3 text-sm font-bold text-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={!hasValidContact || otpStatus === "sending" || status === "submitting"}
                    onClick={(event) => {
                      if (event.currentTarget.form) {
                        void requestOtp(event.currentTarget.form);
                      }
                    }}
                    type="button"
                  >
                    {otpStatus === "sending" ? (locale === "en" ? "Sending" : "Đang gửi") : "OTP"}
                  </button>
                ) : null}
              </span>
              {fieldError("contact") ? <span className="mt-2 block text-sm text-error" id="booking-contact-error">{fieldError("contact")}</span> : null}
              {isOtpEnabled && otpMessage ? (
                <span className={`mt-2 block text-sm ${otpStatus === "sent" ? "text-success" : "text-error"}`} role={otpStatus === "sent" ? "status" : "alert"}>
                  {otpMessage}
                </span>
              ) : null}
            </label>

            {isOtpEnabled ? (
              <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-otp">
                {locale === "en" ? "SMS code" : "Mã SMS"}
                <RequiredMark />
                <input
                  aria-describedby={fieldError("otpCode") ? "booking-otp-error" : undefined}
                  aria-invalid={Boolean(fieldError("otpCode"))}
                  className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                  id="booking-otp"
                  inputMode="numeric"
                  name="otpCode"
                  onChange={(event) => updateRequiredValue("otpCode", event.currentTarget.value)}
                  onFocus={trackStartOnce}
                  onInput={(event) => updateRequiredValue("otpCode", event.currentTarget.value)}
                  placeholder="123456"
                  required
                  type="text"
                />
                {fieldError("otpCode") ? <span className="mt-2 block text-sm text-error" id="booking-otp-error">{fieldError("otpCode")}</span> : null}
              </label>
            ) : null}

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-name">
              {t.form.name}
              <RequiredMark />
              <input
                aria-describedby={fieldError("name") ? "booking-name-error" : undefined}
                aria-invalid={Boolean(fieldError("name"))}
                className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-name"
                name="name"
                onChange={(event) => updateRequiredValue("name", event.currentTarget.value)}
                onFocus={trackStartOnce}
                onInput={(event) => updateRequiredValue("name", event.currentTarget.value)}
                required
                type="text"
              />
              {fieldError("name") ? <span className="mt-2 block text-sm text-error" id="booking-name-error">{fieldError("name")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-date">
              {t.form.date}
              <RequiredMark />
              <input
                aria-describedby={fieldError("date") ? "booking-date-error" : undefined}
                aria-invalid={Boolean(fieldError("date"))}
                className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-date"
                min={minDate}
                name="date"
                onChange={(event) => updateRequiredValue("date", event.currentTarget.value)}
                onFocus={trackStartOnce}
                onInput={(event) => updateRequiredValue("date", event.currentTarget.value)}
                required
                type="date"
              />
              {fieldError("date") ? <span className="mt-2 block text-sm text-error" id="booking-date-error">{fieldError("date")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-time">
              {t.form.time}
              <RequiredMark />
              <input
                aria-describedby={fieldError("time") ? "booking-time-error" : undefined}
                aria-invalid={Boolean(fieldError("time"))}
                className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-time"
                max={businessInfo.openingHoursStructured.closes}
                min={businessInfo.openingHoursStructured.opens}
                name="time"
                onChange={(event) => updateRequiredValue("time", event.currentTarget.value)}
                onFocus={trackStartOnce}
                onInput={(event) => updateRequiredValue("time", event.currentTarget.value)}
                required
                type="time"
              />
              {fieldError("time") ? <span className="mt-2 block text-sm text-error" id="booking-time-error">{fieldError("time")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-guests">
              {t.form.guests}
              <RequiredMark />
              <input
                aria-describedby={fieldError("guests") ? "booking-guests-error" : undefined}
                aria-invalid={Boolean(fieldError("guests"))}
                className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-guests"
                max={20}
                min={1}
                name="guests"
                onChange={(event) => updateRequiredValue("guests", event.currentTarget.value)}
                onFocus={trackStartOnce}
                onInput={(event) => updateRequiredValue("guests", event.currentTarget.value)}
                required
                type="number"
              />
              {fieldError("guests") ? <span className="mt-2 block text-sm text-error" id="booking-guests-error">{fieldError("guests")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal sm:col-span-2" htmlFor="booking-channel">
              {t.form.channel}
              <RequiredMark />
              <span className="relative mt-2 block min-w-0">
                <select
                  aria-describedby={fieldError("contactChannel") ? "booking-channel-error" : undefined}
                  aria-invalid={Boolean(fieldError("contactChannel"))}
                  className="ios-form-control min-h-12 w-full appearance-none rounded-lg border border-borderWarm bg-white px-3 py-3 pr-12 text-base outline-none focus:border-olive"
                  id="booking-channel"
                  name="contactChannel"
                  onChange={(event) => updateRequiredValue("contactChannel", event.currentTarget.value)}
                  onFocus={trackStartOnce}
                  required
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
          </div>
          <label className="mt-4 block min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-note">
            {t.form.note}
            <textarea
              aria-describedby={fieldError("note") ? "booking-note-error" : undefined}
              aria-invalid={Boolean(fieldError("note"))}
              className="ios-form-control mt-2 min-h-28 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
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

          {canSubmitBooking ? (
            <button
              className="mt-6 min-h-12 w-full rounded-lg bg-tomato px-6 py-4 font-bold text-white transition hover:bg-tomato-hover disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === "submitting"}
              type="submit"
            >
              {status === "submitting" ? (locale === "en" ? "Sending..." : "Đang gửi...") : t.form.submit}
            </button>
          ) : (
            <p className="mt-6 rounded-lg border border-borderWarm bg-white px-4 py-3 text-sm font-semibold text-muted" role="status">
              {isOtpEnabled
                ? locale === "en"
                  ? "Complete the required fields and SMS code to send your booking request."
                  : "Hoàn tất các trường bắt buộc và mã SMS để gửi yêu cầu đặt bàn."
                : locale === "en"
                  ? "Complete the required fields to send your booking request."
                  : "Hoàn tất các trường bắt buộc để gửi yêu cầu đặt bàn."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

