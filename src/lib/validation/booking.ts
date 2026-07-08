import { z } from "zod";
import { businessInfo } from "@/config/business";
import {
  bookingContactChannels,
  bookingLocales,
  isBookingFieldErrorCode,
  type BookingApiField,
  type BookingField,
  type BookingFieldErrorCodes,
  type BookingFieldErrorCode,
  type BookingFieldErrors,
} from "@/features/booking/contracts/api";
import { getBookingFieldErrorMessage } from "@/features/booking/domain/validation-errors";
import { formatDateStringInTimeZone, isIsoDateString } from "@/lib/date";

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

type BookingSchemaOptions = {
  now?: Date;
};

const messageCode = (code: BookingFieldErrorCode) => code;
const enumErrorMap = (code: BookingFieldErrorCode) => () => ({ message: messageCode(code) });

export const otpCodeSchema = z.string().trim().regex(/^\d{4,10}$/, messageCode("BOOKING_OTP_INVALID_CODE"));

function createBookingDateSchema(options: BookingSchemaOptions = {}) {
  return z
    .string()
    .trim()
    .min(1, messageCode("BOOKING_DATE_REQUIRED"))
    .refine(isExistingIsoDateString, messageCode("BOOKING_DATE_INVALID"))
    .refine((value) => {
      const today = formatDateStringInTimeZone(options.now ?? new Date(), businessInfo.timeZone);
      return value >= today;
    }, messageCode("BOOKING_DATE_PAST"));
}

const bookingTimeSchema = z
  .string()
  .trim()
  .min(1, messageCode("BOOKING_TIME_REQUIRED"))
  .regex(bookingTimePattern, messageCode("BOOKING_TIME_INVALID"))
  .refine((value) => value >= businessInfo.openingHoursStructured.opens && value <= businessInfo.openingHoursStructured.closes, {
    message: messageCode("BOOKING_TIME_OUTSIDE_OPENING_HOURS"),
  });

const bookingNameSchema = z
  .string()
  .trim()
  .min(2, messageCode("BOOKING_NAME_REQUIRED"))
  .max(80, messageCode("BOOKING_NAME_TOO_LONG"));

function createContactSchema(requiredCode: BookingFieldErrorCode) {
  return z
    .string()
    .trim()
    .min(6, messageCode(requiredCode))
    .max(50, messageCode("BOOKING_CONTACT_TOO_LONG"))
    .refine((value) => contactValuePattern.test(value), messageCode("BOOKING_CONTACT_INVALID_SYMBOLS"));
}

const bookingContactSchema = createContactSchema("BOOKING_CONTACT_REQUIRED");
const bookingPhoneSchema = createContactSchema("BOOKING_OTP_PHONE_REQUIRED");

const bookingNoteSchema = z
  .string()
  .trim()
  .max(300, messageCode("BOOKING_NOTE_TOO_LONG"))
  .optional();

const bookingGuestsSchema = z.coerce
  .number({
    invalid_type_error: messageCode("BOOKING_GUESTS_INTEGER"),
    required_error: messageCode("BOOKING_GUESTS_MIN"),
  })
  .int(messageCode("BOOKING_GUESTS_INTEGER"))
  .min(1, messageCode("BOOKING_GUESTS_MIN"))
  .max(20, messageCode("BOOKING_GUESTS_MAX"));

export function createBookingSchemas(options: BookingSchemaOptions = {}) {
  const bookingDateSchema = createBookingDateSchema(options);
  const bookingBaseSchema = z.object({
    name: bookingNameSchema,
    contact: bookingContactSchema,
    contactChannel: z.enum(bookingContactChannels, { errorMap: enumErrorMap("BOOKING_CONTACT_CHANNEL_INVALID") }),
    date: bookingDateSchema,
    time: bookingTimeSchema,
    guests: bookingGuestsSchema,
    note: bookingNoteSchema,
  });

  const bookingRequestBaseSchema = z.object({
    name: bookingNameSchema,
    email: z.string().trim().email(messageCode("BOOKING_EMAIL_INVALID")).optional().or(z.literal("")),
    phone: bookingPhoneSchema.optional().or(z.literal("")),
    contact: bookingContactSchema.optional().or(z.literal("")),
    contactChannel: z.enum(bookingContactChannels, { errorMap: enumErrorMap("BOOKING_CONTACT_CHANNEL_INVALID") }).default("phone"),
    date: bookingDateSchema,
    time: bookingTimeSchema,
    guests: bookingGuestsSchema,
    note: bookingNoteSchema,
    otpCode: otpCodeSchema.optional().or(z.literal("")),
    locale: z.enum(bookingLocales).default("en"),
  });

  return {
    bookingSchema: bookingBaseSchema,
    bookingRequestSchema: bookingRequestBaseSchema
      .refine((booking) => Boolean(booking.contact || booking.phone || booking.email), {
        message: messageCode("BOOKING_CONTACT_METHOD_REQUIRED"),
        path: ["contact"],
      })
      .transform((booking) => ({
        ...booking,
        email: booking.email || undefined,
        phone: booking.phone || undefined,
        contact: booking.contact || booking.phone || booking.email || "",
      })),
    bookingOtpStartSchema: z.object({
      contact: bookingPhoneSchema,
    }),
  };
}

const currentSchemas = createBookingSchemas();

export const bookingSchema = currentSchemas.bookingSchema;
export const bookingRequestSchema = currentSchemas.bookingRequestSchema;
export const bookingOtpStartSchema = currentSchemas.bookingOtpStartSchema;

export function formatBookingValidationIssues(error: z.ZodError): {
  fieldErrors: BookingFieldErrors;
  fieldErrorCodes: BookingFieldErrorCodes;
} {
  const fieldErrors: BookingFieldErrors = {};
  const fieldErrorCodes: BookingFieldErrorCodes = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as BookingApiField | undefined;
    if (!field || fieldErrors[field]) continue;

    const code = getBookingFieldErrorCode(field, issue.message);
    fieldErrorCodes[field] = code;
    fieldErrors[field] = getBookingFieldErrorMessage(code);
  }

  return { fieldErrors, fieldErrorCodes };
}

function getBookingFieldErrorCode(field: BookingApiField, message: string): BookingFieldErrorCode {
  if (isBookingFieldErrorCode(message)) {
    return message;
  }

  const defaultCodes: Record<BookingApiField, BookingFieldErrorCode> = {
    name: "BOOKING_NAME_REQUIRED",
    contact: "BOOKING_CONTACT_REQUIRED",
    contactChannel: "BOOKING_CONTACT_CHANNEL_INVALID",
    date: "BOOKING_DATE_INVALID",
    time: "BOOKING_TIME_INVALID",
    guests: "BOOKING_GUESTS_INTEGER",
    note: "BOOKING_NOTE_TOO_LONG",
    email: "BOOKING_EMAIL_INVALID",
    phone: "BOOKING_CONTACT_REQUIRED",
    otpCode: "BOOKING_OTP_INVALID_CODE",
  };

  return defaultCodes[field];
}

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type BookingRequestValues = z.output<typeof bookingRequestSchema>;
export type { BookingField };
