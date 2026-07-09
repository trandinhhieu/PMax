import type { BookingRequestValues } from "@/lib/validation/booking";
import { EmailConfigurationError, sendEmail } from "@/server/email/resend";
import { buildBookingEmailHtml, buildBookingEmailSubject, buildBookingEmailText } from "@/server/booking/booking-email";

function readEmailEnv(name: "BOOKING_FROM_EMAIL" | "BOOKING_NOTIFY_EMAIL") {
  const value = process.env[name]?.trim();
  if (!value) return "";
  return value.replace(/^['\"](.*)['\"]$/, "$1").trim();
}

function isEmailLike(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function getAddressFromSender(value: string) {
  return value.match(/<([^<>]+)>/)?.[1]?.trim() ?? value.trim();
}

export async function sendBookingEmail(booking: BookingRequestValues) {
  const from = readEmailEnv("BOOKING_FROM_EMAIL");
  const to = readEmailEnv("BOOKING_NOTIFY_EMAIL");

  if (!from || !to) throw new EmailConfigurationError("BOOKING_FROM_EMAIL and BOOKING_NOTIFY_EMAIL must be configured.");

  const senderAddress = getAddressFromSender(from);
  if (!isEmailLike(senderAddress)) {
    throw new EmailConfigurationError("BOOKING_FROM_EMAIL must be a valid sender, for example Hermanos <onboarding@resend.dev>.");
  }

  if (senderAddress.endsWith(".vercel.app")) {
    throw new EmailConfigurationError("BOOKING_FROM_EMAIL cannot use a vercel.app sender domain.");
  }

  const recipients = to.split(",").map((email) => email.trim()).filter(Boolean);
  if (!recipients.length) throw new EmailConfigurationError("BOOKING_NOTIFY_EMAIL must include at least one recipient.");

  const invalidRecipient = recipients.find((email) => !isEmailLike(email));
  if (invalidRecipient) throw new EmailConfigurationError(`BOOKING_NOTIFY_EMAIL includes an invalid recipient: ${invalidRecipient}.`);

  const submittedAt = new Date();
  console.info("Sending booking notification email", { from: senderAddress, to: recipients });

  return sendEmail({
    from,
    to: recipients,
    subject: buildBookingEmailSubject(booking),
    text: buildBookingEmailText(booking, submittedAt),
    html: buildBookingEmailHtml(booking, submittedAt),
  });
}
