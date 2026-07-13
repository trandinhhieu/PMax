"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, Users, Check } from "lucide-react";
import { useBookingForm } from "./useBookingForm";
import { BookingContactFields } from "./BookingContactFields";
import { getPremiumFormCopy } from "./booking-form-premium";
import { TIME_SLOTS, SPECIAL_REQUEST_CHIPS, MIN_GUESTS, MAX_GUESTS } from "./booking.constants";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";
import { formatDateStringInTimeZone, formatTimeStringInTimeZone, isFutureTimeForDate } from "@/lib/date";

/**
 * Demo availability logic --- NOT production data.
 *
 * Provides a realistic-looking availability display for the premium form.
 * Slots are deterministically derived from the date+time hash so the demo
 * never surprises users with real-time changes. Replace with a real
 * availability endpoint when implementing production availability.
 */
function getSlotAvailability(
  date: string,
  time: string,
): { label: "Available" | "Limited" | "Full"; isFull: boolean; remaining: number } {
  const hash = date + time;
  let code = 0;
  for (let i = 0; i < hash.length; i++) {
    code = ((code << 5) - code) + hash.charCodeAt(i);
  }
  const mod = Math.abs(code) % 10;
  if (mod === 0) return { label: "Full", isFull: true, remaining: 0 };
  if (mod <= 3) return { label: "Limited", isFull: false, remaining: Math.abs(mod) };
  return { label: "Available", isFull: false, remaining: 8 + mod };
}

export function PremiumBookingForm({ locale }: { locale: Locale }) {
  const bookingForm = useBookingForm(locale);
  const premiumCopy = getPremiumFormCopy(locale);
  const t = bookingForm.copy;
  const formCopy = bookingForm.formCopy;

  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const watchedDate = bookingForm.values.date ?? "";
  const watchedTime = bookingForm.values.time ?? "";
  const setBookingValue = bookingForm.setValue;
  const today = currentTime
    ? formatDateStringInTimeZone(currentTime, businessInfo.timeZone)
    : "";
  const currentTimeValue = currentTime
    ? formatTimeStringInTimeZone(currentTime, businessInfo.timeZone)
    : "";
  const visibleTimeSlots = TIME_SLOTS.filter(
    (slot) => watchedDate !== today || !currentTimeValue || slot > currentTimeValue,
  );

  const selectedPresetAvailability =
    watchedDate && TIME_SLOTS.includes(watchedTime as (typeof TIME_SLOTS)[number])
      ? getSlotAvailability(watchedDate, watchedTime)
      : null;

  const hasCoreDetails =
    !!watchedDate &&
    !!watchedTime &&
    (!currentTime || isFutureTimeForDate(watchedDate, watchedTime, currentTime, businessInfo.timeZone)) &&
    !selectedPresetAvailability?.isFull;

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(new Date());
    updateCurrentTime();
    const interval = window.setInterval(updateCurrentTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      currentTime &&
      watchedDate &&
      watchedTime &&
      TIME_SLOTS.includes(watchedTime as (typeof TIME_SLOTS)[number]) &&
      !isFutureTimeForDate(watchedDate, watchedTime, currentTime, businessInfo.timeZone)
    ) {
      setBookingValue("time", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [currentTime, setBookingValue, watchedDate, watchedTime]);

  const handleChipToggle = (key: string) => {
    setSelectedChips((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleTimeSelect = (slot: string) => {
    setBookingValue("time", slot, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleChipWithNote = (key: string) => {
    const chipLabel = SPECIAL_REQUEST_CHIPS.find((c) => c.key === key)?.[locale] ?? "";
    const textarea = document.getElementById("premium-note") as HTMLTextAreaElement | null;
    if (textarea) {
      const currentVal = textarea.value;
      const prefix = currentVal && !selectedChips.includes(key) ? currentVal + ", " : "";
      const escapedLabel = chipLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(,\\s*)?${escapedLabel}`);
      const newVal = selectedChips.includes(key)
        ? currentVal.replace(regex, "")
        : prefix + chipLabel;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(textarea, newVal.trim());
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    handleChipToggle(key);
  };

  return (
    <form
      className="rounded-2xl border border-borderWarm bg-porcelain p-6 shadow-large"
      noValidate
      onSubmit={bookingForm.onSubmit}
    >
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
            hasCoreDetails ? "bg-olive text-white" : "bg-charcoal text-white"
          }`}
        >
          1
        </span>
        <span className={hasCoreDetails ? "text-muted" : "text-charcoal"}>
          {premiumCopy.stepDate}
        </span>
        <span className="mx-2 text-borderWarm/60">&rarr;</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
            hasCoreDetails ? "bg-charcoal text-white" : "bg-borderWarm text-muted"
          }`}
        >
          2
        </span>
        <span className={hasCoreDetails ? "text-charcoal" : "text-disabled"}>
          {premiumCopy.stepContact}
        </span>
      </div>

      {!hasCoreDetails ? (
        <p className="mb-5 rounded-lg border border-borderWarm bg-white px-4 py-3 text-sm font-semibold text-muted">
          {premiumCopy.contactUnlockHint}
        </p>
      ) : null}

      {bookingForm.status === "error" && bookingForm.submitMessage ? (
        <div
          className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error"
          role="alert"
        >
          {bookingForm.submitMessage}
        </div>
      ) : null}

      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-charcoal" htmlFor="premium-date">
            <CalendarDays className="mr-1.5 inline-block h-4 w-4 text-muted" />
            {premiumCopy.selectDate}
          </label>
          <input
            className="ios-form-control booking-native-date-time-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
            id="premium-date"
            min={bookingForm.minDate}
            required
            type="date"
            {...bookingForm.registers.date}
          />
          {bookingForm.fieldError("date") ? (
            <span className="mt-1 block text-sm text-error" role="alert">
              {bookingForm.fieldError("date")}
            </span>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-semibold text-charcoal">
            <Clock className="mr-1.5 inline-block h-4 w-4 text-muted" />
            {premiumCopy.selectTime}
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {visibleTimeSlots.map((slot) => {
              const availability = watchedDate
                ? getSlotAvailability(watchedDate, slot)
                : { label: "Available" as const, isFull: false, remaining: 10 };
              const isSelected = watchedTime === slot;

              return (
                <button
                  key={slot}
                  className={`relative min-h-[3rem] rounded-lg border px-2 py-2 text-sm font-medium transition ${
                    availability.isFull
                      ? "cursor-not-allowed border-borderWarm bg-gray-50 text-disabled"
                      : isSelected
                        ? "border-olive bg-olive/10 text-olive ring-1 ring-olive"
                        : "border-borderWarm bg-white text-charcoal hover:border-olive hover:bg-olive/5"
                  }`}
                  disabled={availability.isFull}
                  onClick={() => handleTimeSelect(slot)}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${slot}${availability.isFull ? " \u2014 " + premiumCopy.slotFull : ""}`}
                >
                  <span className="block">{slot}</span>
                  {availability.isFull ? (
                    <span className="block text-[10px] font-normal text-error">
                      {premiumCopy.slotFull}
                    </span>
                  ) : availability.label === "Limited" ? (
                    <span className="block text-[10px] font-normal text-warning">
                      {premiumCopy.slotLimited} &mdash;{" "}
                      {premiumCopy.slotRemaining.replace("{n}", String(availability.remaining))}
                    </span>
                  ) : (
                    <span className="block text-[10px] font-normal text-success">
                      {premiumCopy.slotAvailable}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {watchedDate === today && visibleTimeSlots.length === 0 ? (
            <p className="mt-3 rounded-lg border border-borderWarm bg-white px-3 py-2 text-sm text-muted">
              {premiumCopy.noFutureSlots}
            </p>
          ) : null}
          <div className="mt-4">
            <label className="text-sm font-semibold text-charcoal" htmlFor="premium-custom-time">
              {premiumCopy.customTime}
            </label>
            <input
              className="ios-form-control booking-native-date-time-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
              id="premium-custom-time"
              min={businessInfo.openingHoursStructured.opens}
              max={businessInfo.openingHoursStructured.closes}
              step={60}
              type="time"
              {...bookingForm.registers.time}
            />
            <span className="mt-1 block text-xs text-muted">{premiumCopy.customTimeHint}</span>
          </div>
          {bookingForm.fieldError("time") ? (
            <span className="mt-1 block text-sm text-error" role="alert">
              {bookingForm.fieldError("time")}
            </span>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-semibold text-charcoal" htmlFor="premium-guests">
            <Users className="mr-1.5 inline-block h-4 w-4 text-muted" />
            {premiumCopy.selectGuests}
          </label>
          <input
            className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
            id="premium-guests"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            required
            step={1}
            type="number"
            {...bookingForm.registers.guests}
          />
          {bookingForm.fieldError("guests") ? (
            <span className="mt-1 block text-sm text-error" role="alert">
              {bookingForm.fieldError("guests")}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={`mt-8 space-y-5 transition-opacity duration-300 ${
          hasCoreDetails ? "" : "pointer-events-none opacity-55"
        }`}
      >
        <div className="flex items-center gap-2 border-t border-borderWarm pt-6">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-xs text-white">
            2
          </span>
          <span className="text-sm font-semibold text-charcoal">{premiumCopy.stepContact}</span>
        </div>

        {!hasCoreDetails ? (
          <p className="rounded-lg border border-borderWarm bg-white px-4 py-3 text-sm text-muted">{premiumCopy.contactUnlockHint}</p>
        ) : (
          <>
            <label
              className="min-w-0 text-sm font-semibold text-charcoal"
              htmlFor="premium-name"
            >
              {t.form.name}
              <span aria-hidden className="ml-1 text-error">
                *
              </span>
              <input
                aria-describedby={
                  bookingForm.fieldError("name") ? "premium-name-error" : undefined
                }
                aria-invalid={Boolean(bookingForm.fieldError("name"))}
                className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="premium-name"
                required
                type="text"
                {...bookingForm.registers.name}
              />
              {bookingForm.fieldError("name") ? (
                <span className="mt-2 block text-sm text-error" id="premium-name-error">
                  {bookingForm.fieldError("name")}
                </span>
              ) : null}
            </label>

            <BookingContactFields
              channelLabel={t.form.channel}
              channelPhoneLabel={formCopy.channelPhone}
              contactLabel={t.form.phone}
              contactRegister={bookingForm.registers.contact}
              fieldError={bookingForm.fieldError}
              hasValidContact={bookingForm.hasValidContact}
              isOtpEnabled={bookingForm.isOtpEnabled}
              onRequestOtp={() => void bookingForm.requestOtp()}
              otpMessage={bookingForm.otpMessage}
              otpRegister={bookingForm.registers.otpCode}
              otpSendingLabel={formCopy.otpSending}
              otpStatus={bookingForm.otpStatus}
              smsCodeLabel={formCopy.smsCode}
              status={bookingForm.status}
              channelRegister={bookingForm.registers.contactChannel}
            />

            <div>
              <label className="text-sm font-semibold text-charcoal">
                {premiumCopy.specialRequests}
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SPECIAL_REQUEST_CHIPS.map((chip) => (
                  <button
                    key={chip.key}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selectedChips.includes(chip.key)
                        ? "border-olive bg-olive/10 text-olive"
                        : "border-borderWarm bg-white text-muted hover:border-olive"
                    }`}
                    onClick={() => handleChipWithNote(chip.key)}
                    type="button"
                  >
                    {chip[locale]}
                  </button>
                ))}
              </div>
              <textarea
                aria-describedby={
                  bookingForm.fieldError("note") ? "premium-note-error" : undefined
                }
                aria-invalid={Boolean(bookingForm.fieldError("note"))}
                className="ios-form-control mt-2 min-h-20 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
                id="premium-note"
                maxLength={300}
                placeholder={premiumCopy.requestChipPlaceholder}
                {...bookingForm.registers.note}
              />
              {bookingForm.fieldError("note") ? (
                <span className="mt-2 block text-sm text-error" id="premium-note-error">
                  {bookingForm.fieldError("note")}
                </span>
              ) : null}
            </div>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-muted">{t.form.privacy}</p>

      {bookingForm.status === "success" ? (
        <div className="mt-6 rounded-xl border border-success/20 bg-success/5 p-6 text-center" role="status">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
            <Check className="h-6 w-6 text-success" />
          </div>
          <p className="mt-4 text-lg font-bold text-charcoal">{premiumCopy.successTitle}</p>
          <p className="mt-2 text-sm text-muted">{premiumCopy.successBody}</p>
        </div>
      ) : null}

      <button
        className="mt-6 min-h-12 w-full rounded-lg bg-tomato px-6 py-4 font-bold text-white transition hover:bg-tomato-hover disabled:cursor-not-allowed disabled:opacity-70"
        disabled={bookingForm.status === "submitting" || !hasCoreDetails}
        type="submit"
      >
        {bookingForm.status === "submitting" ? formCopy.submitPending : premiumCopy.submitButton}
      </button>
    </form>
  );
}
