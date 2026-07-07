import { z } from "zod";

const bookingDateSchema = z.coerce.date().refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}, "Please choose today or a future date.");

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  contact: z.string().trim().min(6, "Please enter a phone number or chat contact."),
  contactChannel: z.enum(["phone", "whatsapp", "zalo", "messenger"]),
  date: bookingDateSchema,
  time: z.string().min(1, "Please choose a time."),
  guests: z.coerce.number().int().min(1, "Please enter at least 1 guest.").max(20, "Please contact us directly for groups over 20."),
  note: z.string().trim().max(300, "Please keep your note under 300 characters.").optional(),
});

export const bookingRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name."),
    email: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
    phone: z.string().trim().min(6, "Please enter a phone number.").optional().or(z.literal("")),
    contact: z.string().trim().min(6, "Please enter a phone number or chat contact.").optional().or(z.literal("")),
    contactChannel: z.enum(["phone", "whatsapp", "zalo", "messenger"]).default("phone"),
    date: bookingDateSchema,
    time: z.string().min(1, "Please choose a time."),
    guests: z.coerce.number().int().min(1, "Please enter at least 1 guest.").max(20, "Please contact us directly for groups over 20."),
    note: z.string().trim().max(300, "Please keep your note under 300 characters.").optional(),
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

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type BookingRequestValues = z.output<typeof bookingRequestSchema>;
export type BookingField = keyof BookingFormValues;
