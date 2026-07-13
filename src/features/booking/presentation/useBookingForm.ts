"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  type SubmitBookingResult,
} from "@/features/booking/contracts/api";
import { submitBookingRequest, startBookingOtp } from "@/features/booking/infrastructure/browser/booking-api-client";
import { getLocalizedBookingFieldError } from "@/features/booking/presentation/error";
import { trackEvent } from "@/lib/analytics";
import { formatDateStringInTimeZone } from "@/lib/date";
import { addFutureBookingTimeIssue, bookingSchema, otpCodeSchema, type BookingField, type BookingFormValues } from "@/lib/validation/booking";
import type { Locale } from "@/types/common";
import { getBookingFormCopy } from "./booking-form";

export type FormStatus = "idle" | "submitting" | "error" | "success";
export type OtpStatus = "idle" | "sending" | "sent" | "error";
export type BookingFormField = BookingField | "otpCode";

export type BookingFormInput = BookingFormValues & {
  otpCode: string;
};

const bookingFormSchema = bookingSchema.extend({
  otpCode: z.string(),
}).superRefine((booking, context) => addFutureBookingTimeIssue(booking, context));

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

const phoneChannel = "phone";

export const isBookingOtpEnabled = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED?.toLowerCase() === "true";

export function useBookingForm(locale: Locale) {
  const t = copy[locale];
  const formCopy = getBookingFormCopy(locale);
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
    setValue,
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

  const clearSubmitFeedback = useCallback(() => {
    if (status === "success") setStatus("idle");
    if (status === "error") setSubmitMessage(formCopy.defaultError);
  }, [formCopy.defaultError, status]);

  const trackStartOnce = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent(trackingEvents.bookingStart, {
      location: "booking_section",
      page_language: locale,
    });
  }, [hasStarted, locale]);

  const localizeError = useCallback((field: BookingApiField, message: string, code?: BookingFieldErrorCode) => {
    return getLocalizedBookingFieldError(locale, field, message, code);
  }, [locale]);

  const fieldError = useCallback((field: BookingFormField) => {
    const shouldShow = touchedFields[field as keyof typeof touchedFields] || submitCount > 0;
    if (!shouldShow) return undefined;

    const message = field === "otpCode" ? errors.otpCode?.message : errors[field as BookingField]?.message;
    if (!message) return undefined;

    return localizeError(field, message, isBookingFieldErrorCode(message) ? message : undefined);
  }, [errors, localizeError, submitCount, touchedFields]);

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
    if (!isBookingOtpEnabled) return;

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

  const requestOtp = useCallback(async () => {
    const contact = getValues("contact").trim();
    const contactChannel = getValues("contactChannel");

    setOtpStatus("sending");
    setOtpMessage("");
    setSubmitMessage(formCopy.defaultError);
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
      const { responseOk, result } = await startBookingOtp(contact);

      if (!responseOk || !result.ok) {
        setOtpStatus("error");
        setOtpMessage(result.message ?? formCopy.otpSendFailed);
        return;
      }

      setOtpStatus("sent");
      setOtpContact(contact);
      setOtpMessage(formCopy.otpSent);
      clearErrors("otpCode");
    } catch {
      setOtpStatus("error");
      setOtpMessage(formCopy.otpSendFailed);
    }
  }, [clearErrors, formCopy, getValues, localizeError, setError]);

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    setSubmitMessage(formCopy.defaultError);

    trackEvent(trackingEvents.bookingSubmit, {
      location: "booking_section",
      page_language: locale,
    });

    if (isBookingOtpEnabled && data.contactChannel !== phoneChannel) {
      setError("contactChannel", {
        type: "manual",
        message: localizeError("contactChannel", "Please choose Phone to receive the SMS verification code.", "BOOKING_OTP_CHANNEL_REQUIRED"),
      });
      setStatus("error");
      return;
    }

    if (isBookingOtpEnabled && !data.otpCode.trim()) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please enter the SMS verification code.", "BOOKING_OTP_REQUIRED"),
      });
      setStatus("error");
      return;
    }

    if (isBookingOtpEnabled && !otpCodeSchema.safeParse(data.otpCode.trim()).success) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please enter a valid SMS verification code.", "BOOKING_OTP_INVALID_CODE"),
      });
      setStatus("error");
      return;
    }

    if (isBookingOtpEnabled && (otpStatus !== "sent" || otpContact !== data.contact.trim())) {
      setError("otpCode", {
        type: "manual",
        message: localizeError("otpCode", "Please request a new SMS verification code for this phone number.", "BOOKING_OTP_CONTACT_CHANGED"),
      });
      setStatus("error");
      return;
    }

    let result: SubmitBookingResult;

    try {
      result = await submitBookingRequest({
        name: data.name,
        contact: data.contact,
        contactChannel: data.contactChannel,
        date: data.date,
        time: data.time,
        guests: data.guests,
        note: data.note,
        otpCode: isBookingOtpEnabled ? data.otpCode.trim() : undefined,
        locale,
      });
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
    setSubmitMessage(formCopy.defaultError);
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
    setSubmitMessage(formCopy.defaultError);
  });

  const registerWithFeedback = useCallback((field: keyof BookingFormInput, options: { valueAsNumber?: boolean } = {}) => {
    return register(field, {
      ...options,
      onChange: clearSubmitFeedback,
      onBlur: trackStartOnce,
    });
  }, [clearSubmitFeedback, register, trackStartOnce]);

  return {
    copy: t,
    formCopy,
    status,
    otpStatus,
    otpMessage,
    submitMessage,
    minDate,
    hasValidContact,
    isOtpEnabled: isBookingOtpEnabled,
    onSubmit,
    requestOtp,
    fieldError,
    setValue,
    values,
    registers: {
      contact: registerWithFeedback("contact"),
      otpCode: registerWithFeedback("otpCode"),
      name: registerWithFeedback("name"),
      date: registerWithFeedback("date"),
      time: registerWithFeedback("time"),
      guests: registerWithFeedback("guests", { valueAsNumber: true }),
      contactChannel: registerWithFeedback("contactChannel"),
      note: registerWithFeedback("note"),
    },
  };
}

