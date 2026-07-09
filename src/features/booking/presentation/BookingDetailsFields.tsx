import type { UseFormRegisterReturn } from "react-hook-form";
import { businessInfo } from "@/config/business";
import type { BookingFormField } from "./useBookingForm";

type BookingDetailsFieldsProps = {
  labels: {
    name: string;
    date: string;
    time: string;
    guests: string;
    note: string;
  };
  minDate: string;
  nameRegister: UseFormRegisterReturn;
  dateRegister: UseFormRegisterReturn;
  timeRegister: UseFormRegisterReturn;
  guestsRegister: UseFormRegisterReturn;
  noteRegister: UseFormRegisterReturn;
  fieldError: (field: BookingFormField) => string | undefined;
};

function RequiredMark() {
  return (
    <span aria-hidden className="ml-1 text-error">
      *
    </span>
  );
}

export function BookingDetailsFields({
  labels,
  minDate,
  nameRegister,
  dateRegister,
  timeRegister,
  guestsRegister,
  noteRegister,
  fieldError,
}: BookingDetailsFieldsProps) {
  const nameError = fieldError("name");
  const dateError = fieldError("date");
  const timeError = fieldError("time");
  const guestsError = fieldError("guests");
  const noteError = fieldError("note");

  return (
    <>
      <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-name">
        {labels.name}
        <RequiredMark />
        <input
          aria-describedby={nameError ? "booking-name-error" : undefined}
          aria-invalid={Boolean(nameError)}
          className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
          id="booking-name"
          required
          type="text"
          {...nameRegister}
        />
        {nameError ? <span className="mt-2 block text-sm text-error" id="booking-name-error">{nameError}</span> : null}
      </label>

      <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-date">
        {labels.date}
        <RequiredMark />
        <input
          aria-describedby={dateError ? "booking-date-error" : undefined}
          aria-invalid={Boolean(dateError)}
          className="booking-native-date-control ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
          id="booking-date"
          min={minDate}
          required
          type="date"
          {...dateRegister}
        />
        {dateError ? <span className="mt-2 block text-sm text-error" id="booking-date-error">{dateError}</span> : null}
      </label>

      <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-time">
        {labels.time}
        <RequiredMark />
        <input
          aria-describedby={timeError ? "booking-time-error" : undefined}
          aria-invalid={Boolean(timeError)}
          className="booking-native-date-control ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
          id="booking-time"
          max={businessInfo.openingHoursStructured.closes}
          min={businessInfo.openingHoursStructured.opens}
          required
          type="time"
          {...timeRegister}
        />
        {timeError ? <span className="mt-2 block text-sm text-error" id="booking-time-error">{timeError}</span> : null}
      </label>

      <label className="min-w-0 text-sm font-semibold text-charcoal" htmlFor="booking-guests">
        {labels.guests}
        <RequiredMark />
        <input
          aria-describedby={guestsError ? "booking-guests-error" : undefined}
          aria-invalid={Boolean(guestsError)}
          className="ios-form-control mt-2 min-h-12 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
          id="booking-guests"
          max={20}
          min={1}
          required
          step={1}
          type="number"
          {...guestsRegister}
        />
        {guestsError ? <span className="mt-2 block text-sm text-error" id="booking-guests-error">{guestsError}</span> : null}
      </label>

      <label className="min-w-0 text-sm font-semibold text-charcoal sm:col-span-2" htmlFor="booking-note">
        {labels.note}
        <textarea
          aria-describedby={noteError ? "booking-note-error" : undefined}
          aria-invalid={Boolean(noteError)}
          className="ios-form-control mt-2 min-h-28 w-full rounded-lg border border-borderWarm bg-white px-3 py-3 text-base outline-none focus:border-olive"
          id="booking-note"
          maxLength={300}
          {...noteRegister}
        />
        {noteError ? <span className="mt-2 block text-sm text-error" id="booking-note-error">{noteError}</span> : null}
      </label>
    </>
  );
}
