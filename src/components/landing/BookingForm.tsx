"use client";

import { MessageCircle, Phone } from "lucide-react";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { BookingContactFields } from "@/features/booking/presentation/BookingContactFields";
import { BookingDetailsFields } from "@/features/booking/presentation/BookingDetailsFields";
import { useBookingForm } from "@/features/booking/presentation/useBookingForm";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

export function BookingForm({ locale }: { locale: Locale }) {
  const bookingForm = useBookingForm(locale);
  const { copy: t, formCopy, registers } = bookingForm;

  return (
    <section className="safe-area-inline overflow-x-clip bg-cream py-20" id="booking">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-tomato">{formCopy.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">{t.sections.bookingTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{t.sections.bookingBody}</p>
          <div className="mt-8 rounded-lg border border-borderWarm bg-porcelain p-5 text-sm leading-6 text-muted">
            {formCopy.requestNotice}
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
              {formCopy.callLabel}
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

        <form className="overflow-x-clip rounded-lg border border-borderWarm bg-porcelain p-5 pb-24 shadow-large sm:p-6 md:pb-6" noValidate onSubmit={bookingForm.onSubmit}>
          <p className="mb-5 rounded-lg border border-borderWarm bg-white px-4 py-3 text-sm font-semibold text-muted">
            {bookingForm.isOtpEnabled ? formCopy.otpIntro : formCopy.defaultIntro}
          </p>

          {bookingForm.status === "error" ? (
            <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
              {bookingForm.submitMessage || formCopy.defaultError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <BookingContactFields
              channelLabel={t.form.channel}
              channelPhoneLabel={formCopy.channelPhone}
              contactLabel={t.form.phone}
              contactRegister={registers.contact}
              fieldError={bookingForm.fieldError}
              hasValidContact={bookingForm.hasValidContact}
              isOtpEnabled={bookingForm.isOtpEnabled}
              onRequestOtp={() => void bookingForm.requestOtp()}
              otpMessage={bookingForm.otpMessage}
              otpRegister={registers.otpCode}
              otpSendingLabel={formCopy.otpSending}
              otpStatus={bookingForm.otpStatus}
              smsCodeLabel={formCopy.smsCode}
              status={bookingForm.status}
              channelRegister={registers.contactChannel}
            />

            <BookingDetailsFields
              dateRegister={registers.date}
              fieldError={bookingForm.fieldError}
              guestsRegister={registers.guests}
              labels={{
                name: t.form.name,
                date: t.form.date,
                time: t.form.time,
                guests: t.form.guests,
                note: t.form.note,
              }}
              minDate={bookingForm.minDate}
              nameRegister={registers.name}
              noteRegister={registers.note}
              timeRegister={registers.time}
            />
          </div>

          <p className="mt-3 text-sm text-muted">{t.form.privacy}</p>

          {bookingForm.status === "success" ? (
            <p className="mt-5 rounded-lg bg-success/10 px-4 py-3 text-sm font-bold text-success" role="status">
              {t.form.success}
            </p>
          ) : null}

          <button
            className="mt-6 min-h-12 w-full rounded-lg bg-tomato px-6 py-4 font-bold text-white transition hover:bg-tomato-hover disabled:cursor-not-allowed disabled:opacity-70"
            disabled={bookingForm.status === "submitting"}
            type="submit"
          >
            {bookingForm.status === "submitting" ? formCopy.submitPending : t.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
