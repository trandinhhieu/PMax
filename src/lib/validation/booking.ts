import { z } from "zod";
import { businessInfo } from "@/config/business";
import { formatDateStringInTimeZone, isIsoDateString } from "@/lib/date";

const bookingContactChannels = ["phone", "whatsapp", "zalo", "messenger"] as const;
const bookingTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const contactValuePattern = /^[\d\s+().-]+$/;

function isExistingIsoDateString(value: string) {
  if (!isIsoDateString(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

export const otpCodeSchema = z.string().trim().regex(/^\d{4,10}$/, "Please enter the verification code.");

const bookingDateSchema = z
  .string()
  .trim()
  .min(1, "Please choose a date.")
  .refine(isExistingIsoDateString, "Please choose a valid date.")
  .refine((value) => {
    const today = formatDateStringInTimeZone(new Date(), businessInfo.timeZone);
    return value >= today;
  }, "Please choose today or a future date.");

const bookingTimeSchema = z
  .string()
  .trim()
  .min(1, "Please choose a time.")
  .regex(bookingTimePattern, "Please choose a valid time.")
  .refine((value) => value >= businessInfo.openingHoursStructured.opens && value <= businessInfo.openingHoursStructured.closes, {
    message: `Please choose a time between ${businessInfo.openingHoursStructured.opens} and ${businessInfo.openingHoursStructured.closes}.`,
  });

const bookingNameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(80, "Please keep your name under 80 characters.");

const bookingContactSchema = z
  .string()
  .trim()
  .min(6, "Please enter a phone number or chat contact.")
  .max(50, "Please keep the contact detail under 50 characters.")
  .refine((value) => contactValuePattern.test(value), "Please enter only digits and phone symbols.");

const bookingPhoneSchema = z
  .string()
  .trim()
  .min(6, "Please enter a phone number.")
  .max(50, "Please keep the phone number under 50 characters.")
  .refine((value) => contactValuePattern.test(value), "Please enter only digits and phone symbols.");

const bookingNoteSchema = z
  .string()
  .trim()
  .max(300, "Please keep your note under 300 characters.")
  .optional();

const bookingGuestsSchema = z.coerce.number().int("Please enter a whole number of guests.").min(1, "Please enter at least 1 guest.").max(20, "Please contact us directly for groups over 20.");

export const bookingSchema = z.object({
  name: bookingNameSchema,
  contact: bookingContactSchema,
  contactChannel: z.enum(bookingContactChannels),
  date: bookingDateSchema,
  time: bookingTimeSchema,
  guests: bookingGuestsSchema,
  note: bookingNoteSchema,
});

export const bookingRequestSchema = z
  .object({
    name: bookingNameSchema,
    email: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
    phone: bookingPhoneSchema.optional().or(z.literal("")),
    contact: bookingContactSchema.optional().or(z.literal("")),
    contactChannel: z.enum(bookingContactChannels).default("phone"),
    date: bookingDateSchema,
    time: bookingTimeSchema,
    guests: bookingGuestsSchema,
    note: bookingNoteSchema,
    otpCode: otpCodeSchema.optional().or(z.literal("")),
    locale: z.enum(["en", "vi"]).default("en"),
  })
  .refine((booking) => Boolean(booking.contact || booking.phone || booking.email), {
    message: "Please enter a phone number, email, or chat contact.",
    path: ["contact"],
  })
  .transform((booking) => ({
    ...booking,
    email: booking.email || undefined,
    phone: booking.phone || undefined,
    contact: booking.contact || booking.phone || booking.email || "",
  }));

export const bookingOtpStartSchema = z.object({
  contact: bookingPhoneSchema,
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type BookingRequestValues = z.output<typeof bookingRequestSchema>;
export type BookingField = keyof BookingFormValues;
