import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  contact: z.string().trim().min(6, "Please enter a phone number or chat contact."),
  contactChannel: z.enum(["phone", "whatsapp", "zalo", "messenger"]),
  date: z.coerce.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Please choose today or a future date."),
  time: z.string().min(1, "Please choose a time."),
  guests: z.coerce.number().int().min(1, "Please enter at least 1 guest.").max(20, "Please contact us directly for groups over 20."),
  note: z.string().trim().max(300, "Please keep your note under 300 characters.").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type BookingField = keyof BookingFormValues;
