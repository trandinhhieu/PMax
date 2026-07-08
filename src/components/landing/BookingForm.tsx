"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import {
  isBookingFieldErrorCode,
  type BookingApiField,
  type BookingFieldErrorCode,
  type StartBookingOtpResult,
  type SubmitBookingResult,
} from "@/features/booking/contracts/api";
import { getLocalizedBookingFieldError } from "@/features/booking/presentation/error-copy";
import { trackEvent } from "@/lib/analytics";
import { formatDateStringInTimeZone } from "@/lib/date";
import { bookingSchema, otpCodeSchema, type BookingField, type BookingFormValues } from "@/lib/validation/booking";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

type FormStatus = "idle" | "submitting" | "error" | "success";
type OtpStatus = "idle" | "sending" | "sent" | "error";
type BookingFormField = BookingField | "otpCode";

type BookingFormInput = BookingFormValues & {
  otpCode: string;
};

const bookingFormSchema = bookingSchema.extend({
  otpCode: z.string(),
});

const initialValues: BookingFormInput = {
  name: "",
  contact: "",
  contactChannel: "phone",
  date: "",
  time: "",
  guests: 1,
  note: "",
  otpCode: "",
};

const isOtpEnabled = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED?.toLowerCase() === "true";
const phoneChannel = "phone";

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
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const minDate = useMemo(() => formatDateStringInTimeZone(new Date(), businessInfo.timeZone), []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors, touchedFields, submitCount },
  } = useForm<BookingFormInput>({
    defaultValues: initialValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(bookingFormSchema),
    shouldFocusError: true,
  });

  const values = watch();
  const watchedContact = values.contact ?? "";
  const watchedContactChannel = values.contactChannel ?? phoneChannel;
  const watchedOtpCode = values.otpCode ?? "";
  const hasValidContact = bookingSchema.shape.contact.safeParse(watchedContact).success;

  const trackStartOnce = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent(trackingEvents.bookingStart, {
      location: "booking_section",
      page_language: locale,
    });
  };

  const localizeError = useCallback((field: BookingApiField, message: string, code?: BookingFieldErrorCode) => {
    return getLocalizedBookingFieldError(locale, field, message, code);
  }, [locale]);

  const fieldError = (field: BookingFormField) => {
    const shouldShow = touchedFields[field as keyof typeof touchedFields] || submitCount > 0;
    if (!shouldShow) return undefined;

    const message = field === "otpCode" ? errors.otpCode?.message : errors[field as BookingField]?.message;
    if (!message) return undefined;

    return localizeError(field, message, isBookingFieldErrorCode(message) ? message : undefined);
  };

  const defaultErrorMessage = locale === "en" ? "Please check the highlighted fields before sending." : "Vui lòng kiểm tra các trường đang bị lỗi trước khi gửi.";

  useEffect(() => {
    if (otpContact && watchedContact.trim() !== otpContact) {
      setOtpStatus("idle");
      setOtpMessage("");
      setOtpContact("");

      if (watchedOtpCode.trim()) {
        setError("otpCode", {
          type: "manual",
          message: localizeError("otpCode", "Please request a new SMS verification code for this phone number.", "BOOKING_OTP_CONTACT_CHANGED"),
        });
      } else {
        clearErrors("otpCode");
      }
    }
  }, [clearErrors, localizeError, otpContact, setError, watchedContact, watchedOtpCode]);

  useEffect(() => {
    if (!isOtpEnabled) return;

    if (watchedContactChannel !== phoneChannel) {
      setError("contactChannel", {
        type: "manual",
        message: localizeError("contactChannel", "Please choose Phone to receive the SMS verification code.", "BOOKING_OTP_CHANNEL_REQUIRED"),
      });
      return;
    }

    if (errors.contactChannel?.type === "manual") {
      clearErrors("contactChannel");
    }
  }, [clearErrors, errors.contactChannel?.type, localizeError, setError, watchedContactChannel]);

  const requestOtp = async () => {
    const contact = getValues("contact").trim();
    const contactChannel = getValues("contactChannel");

    setOtpStatus("sending");
    setOtpMessage("");
    setSubmitMessage("");
    clearErrors(["contact", "contactChannel", "otpCode"]);

    if (!contact) {
      setError("contact", {
        type: "manual",
        message: localizeError("contact", "Please enter a phone number before requesting OTP.", "BOOKING_OTP_PHONE_REQUIRED"),
      });
      setOtpStatus("error");
      return;
    }

    if (!bookingSchema.shape.contact.safeParse(contact).success) {
      setError("contact", {
        type: "manual",
        message: localizeError("contact", "Please enter a valid phone number before requesting OTP.", "BOOKING_OTP_PHONE_INVALID"),
      });
      setOtpStatus("error");
      return;
    }

    if (contactChannel !== phoneChannel) {
      setError("contactChannel", {
        type: "manual",
        message: localizeError("contactChannel", "Please choose Phone to receive the SMS verification code.", "BOOKING_OTP_CHANNEL_REQUIRED"),
      });
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
      const result = (await response.json()) as StartBookingOtpResult;

      if (!response.ok || !result.ok) {
        setOtpStatus("error");
        setOtpMessage(result.message ?? (locale === "en" ? "We could not send the verification code." : "Không thể gửi mã xác thực."));
        return;
      }

      setOtpStatus("sent");
      setOtpContact(contact);
      setOtpMessage(locale === "en" ? "Verification code sent by SMS." : "Mã xác thực đã được gửi qua SMS.");
      clearErrors("otpCode");
    } catch {
      setOtpStatus("error");
      setOtpMessage(locale === "en" ? "We could not send the verification code." : "Không thể gửi mã xác thực.");
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    setSubmitMessage("");

    trackEvent(trackingEvents.bookingSubmit, {
      location: "booking_section",
      page_language: locale,
    });

    if (isOtpEnabled && data.contactChannel !== phoneChannel) {
      setError("contactChannel", {
        type: "manual",
        message: localizeError("contactChannel", "Please choose Phone to receive the SMS verification code.", "BOOKING_OTP_CHANNEL_REQUIRED"),
      });
      setStatus("error");
      return;
    }

    if (isOtpEnabled && !data.otpCode.trim()) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please enter the SMS verification code.", "BOOKING_OTP_REQUIRED"),
      });
      setStatus("error");
      return;
    }

    if (isOtpEnabled && !otpCodeSchema.safeParse(data.otpCode.trim()).success) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please enter a valid SMS verification code.", "BOOKING_OTP_INVALID_CODE"),
      });
      setStatus("error");
      return;
    }

    if (isOtpEnabled && (otpStatus !== "sent" || otpContact !== data.contact.trim())) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please request a new SMS verification code for this phone number.", "BOOKING_OTP_CONTACT_CHANGED"),
      });
      setStatus("error");
      return;
    }

    let result: SubmitBookingResult;

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          contact: data.contact,
          contactChannel: data.contactChannel,
          date: data.date,
          time: data.time,
          guests: data.guests,
          note: data.note,
          otpCode: isOtpEnabled ? data.otpCode.trim() : undefined,
          locale,
        }),
      });
      result = (await response.json()) as SubmitBookingResult;
    } catch {
      setSubmitMessage(t.form.error);
      setStatus("error");
      return;
    }

    if (!result.ok) {
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        const typedField = field as BookingApiField;
        setError(field as keyof BookingFormInput, {
          type: "server",
          message: localizeError(typedField, message, result.fieldErrorCodes?.[typedField]),
        });
      }

      setSubmitMessage(result.message ?? t.form.error);
      setStatus("error");
      return;
    }

    setStatus("success");
    setSubmitMessage("");
    setOtpStatus("idle");
    setOtpMessage("");
    setOtpContact("");
    reset(initialValues);

    try {
      trackEvent(trackingEvents.bookingSuccess, {
        location: "booking_section",
        page_language: locale,
        handoff_channel: "email",
      });
    } catch {
      // Tracking must never turn a successful booking into an error.
    }
  }, () => {
    setStatus("error");
    setSubmitMessage("");
  });

  const contactRegister = register("contact", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const otpRegister = register("otpCode", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const nameRegister = register("name", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const dateRegister = register("date", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const timeRegister = register("time", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const guestsRegister = register("guests", {
    valueAsNumber: true,
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const channelRegister = register("contactChannel", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

  const noteRegister = register("note", {
    onChange: () => {
      if (status === "success") setStatus("idle");
      if (status === "error") setSubmitMessage("");
    },
    onBlur: trackStartOnce,
  });

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

        <form className="overflow-x-clip rounded-lg border border-borderWarm bg-porcelain p-5 pb-24 shadow-large sm:p-6 md:pb-6" noValidate onSubmit={onSubmit}>
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
                  placeholder="+84905906842"
                  required
                  type="tel"
                  {...contactRegister}
                />
                {isOtpEnabled ? (
                  <button
                    className="min-h-12 shrink-0 rounded-lg border border-borderWarm bg-charcoal px-4 py-3 text-sm font-bold text-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={!hasValidContact || otpStatus === "sending" || status === "submitting"}
                    onClick={() => void requestOtp()}
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
                  placeholder="123456"
                  required
                  type="text"
                  {...otpRegister}
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
                required
                type="text"
                {...nameRegister}
              />
              {fieldError("name") ? <span className="mt-2 block text-sm text-error" id="booking-name-error">{fieldError("name")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-date">
              {t.form.date}
              <RequiredMark />
              <input
                aria-describedby={fieldError("date") ? "booking-date-error" : undefined}
                aria-invalid={Boolean(fieldError("date"))}
                className="booking-native-date-control ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-date"
                min={minDate}
                required
                type="date"
                {...dateRegister}
              />
              {fieldError("date") ? <span className="mt-2 block text-sm text-error" id="booking-date-error">{fieldError("date")}</span> : null}
            </label>

            <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-time">
              {t.form.time}
              <RequiredMark />
              <input
                aria-describedby={fieldError("time") ? "booking-time-error" : undefined}
                aria-invalid={Boolean(fieldError("time"))}
                className="booking-native-date-control ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="booking-time"
                max={businessInfo.openingHoursStructured.closes}
                min={businessInfo.openingHoursStructured.opens}
                required
                type="time"
                {...timeRegister}
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
                required
                step={1}
                type="number"
                {...guestsRegister}
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
                  required
                  {...channelRegister}
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
              {...noteRegister}
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
            {status === "submitting" ? (locale === "en" ? "Sending..." : "Đang gửi...") : t.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
