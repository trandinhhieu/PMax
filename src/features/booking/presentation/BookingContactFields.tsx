import { ChevronDown } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { BookingFormField, FormStatus, OtpStatus } from "./useBookingForm";

type BookingContactFieldsProps = {
  contactLabel: string;
  channelLabel: string;
  channelPhoneLabel: string;
  smsCodeLabel: string;
  otpSendingLabel: string;
  isOtpEnabled: boolean;
  hasValidContact: boolean;
  status: FormStatus;
  otpStatus: OtpStatus;
  otpMessage: string;
  contactRegister: UseFormRegisterReturn;
  otpRegister: UseFormRegisterReturn;
  channelRegister: UseFormRegisterReturn;
  fieldError: (field: BookingFormField) => string | undefined;
  onRequestOtp: () => void;
};

function RequiredMark() {
  return (
    <span aria-hidden className="ml-1 text-error">
      *
    </span>
  );
}

export function BookingContactFields({
  contactLabel,
  channelLabel,
  channelPhoneLabel,
  smsCodeLabel,
  otpSendingLabel,
  isOtpEnabled,
  hasValidContact,
  status,
  otpStatus,
  otpMessage,
  contactRegister,
  otpRegister,
  channelRegister,
  fieldError,
  onRequestOtp,
}: BookingContactFieldsProps) {
  const contactError = fieldError("contact");
  const otpError = fieldError("otpCode");
  const channelError = fieldError("contactChannel");

  return (
    <>
      <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-contact">
        {contactLabel}
        <RequiredMark />
        <span className="mt-2 flex min-w-0 gap-2">
          <input
            aria-describedby={contactError ? "booking-contact-error" : undefined}
            aria-invalid={Boolean(contactError)}
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
              onClick={onRequestOtp}
              type="button"
            >
              {otpStatus === "sending" ? otpSendingLabel : "OTP"}
            </button>
          ) : null}
        </span>
        {contactError ? <span className="mt-2 block text-sm text-error" id="booking-contact-error">{contactError}</span> : null}
        {isOtpEnabled && otpMessage ? (
          <span className={`mt-2 block text-sm ${otpStatus === "sent" ? "text-success" : "text-error"}`} role={otpStatus === "sent" ? "status" : "alert"}>
            {otpMessage}
          </span>
        ) : null}
      </label>

      {isOtpEnabled ? (
        <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-otp">
          {smsCodeLabel}
          <RequiredMark />
          <input
            aria-describedby={otpError ? "booking-otp-error" : undefined}
            aria-invalid={Boolean(otpError)}
            className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
            id="booking-otp"
            inputMode="numeric"
            placeholder="123456"
            required
            type="text"
            {...otpRegister}
          />
          {otpError ? <span className="mt-2 block text-sm text-error" id="booking-otp-error">{otpError}</span> : null}
        </label>
      ) : null}

      <label className="min-w-0 text-sm font-semibold text-charcoal sm:col-span-2" htmlFor="booking-channel">
        {channelLabel}
        <RequiredMark />
        <span className="relative mt-2 block min-w-0">
          <select
            aria-describedby={channelError ? "booking-channel-error" : undefined}
            aria-invalid={Boolean(channelError)}
            className="ios-form-control min-h-12 w-full appearance-none rounded-lg border border-borderWarm bg-white px-3 py-3 pr-12 text-base outline-none focus:border-olive"
            id="booking-channel"
            required
            {...channelRegister}
          >
            <option value="phone">{channelPhoneLabel}</option>
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
        {channelError ? <span className="mt-2 block text-sm text-error" id="booking-channel-error">{channelError}</span> : null}
      </label>
    </>
  );
}
