import { businessInfo } from "@/config/business";
import type { BookingRequestValues } from "@/lib/validation/booking";
import { EmailConfigurationError, sendEmail } from "@/server/email/resend";

const contactChannelLabels: Record<BookingRequestValues["contactChannel"], string> = {
  phone: "Phone",
  whatsapp: "WhatsApp",
  zalo: "Zalo",
  messenger: "Facebook Messenger",
};

function readEmailEnv(name: "BOOKING_FROM_EMAIL" | "BOOKING_NOTIFY_EMAIL") {
  const value = process.env[name]?.trim();

  if (!value) return "";

  return value.replace(/^["'](.*)["']$/, "$1").trim();
}

function isEmailLike(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function getAddressFromSender(value: string) {
  return value.match(/<([^<>]+)>/)?.[1]?.trim() ?? value.trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

function buildBookingLines(booking: BookingRequestValues, submittedAt: Date) {
  const note = booking.note?.trim();

  return [
    `Customer name: ${booking.name}`,
    `Phone number: ${booking.phone ?? booking.contact}`,
    `Preferred contact: ${contactChannelLabels[booking.contactChannel]}`,
    `Booking date: ${formatDate(booking.date)}`,
    `Booking time: ${booking.time}`,
    `Number of guests: ${booking.guests}`,
    `Note/message: ${note || "Not provided"}`,
    `Submission timestamp: ${formatTimestamp(submittedAt)}`,
  ].filter(Boolean) as string[];
}

function buildTextEmail(booking: BookingRequestValues, submittedAt: Date) {
  return [
    `New booking request for ${businessInfo.displayName}`,
    "",
    ...buildBookingLines(booking, submittedAt),
    "",
    "Internal notification only. No customer confirmation email was sent.",
  ].join("\n");
}

function buildHtmlEmail(booking: BookingRequestValues, submittedAt: Date) {
  const rows = buildBookingLines(booking, submittedAt)
    .map((line) => {
      const [label, ...valueParts] = line.split(": ");
      return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(valueParts.join(": "))}</td></tr>`;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.5;">
      <h1 style="font-size:20px;margin:0 0 16px;">New booking request</h1>
      <p style="margin:0 0 16px;">${escapeHtml(businessInfo.displayName)} received a booking request from the website.</p>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:640px;">${rows}</table>
      <p style="margin:16px 0 0;color:#666;font-size:13px;">Internal notification only. No customer confirmation email was sent.</p>
    </div>
  `;
}

export async function sendBookingEmail(booking: BookingRequestValues) {
  const from = readEmailEnv("BOOKING_FROM_EMAIL");
  const to = readEmailEnv("BOOKING_NOTIFY_EMAIL");

  if (!from || !to) {
    throw new EmailConfigurationError("BOOKING_FROM_EMAIL and BOOKING_NOTIFY_EMAIL must be configured.");
  }

  const senderAddress = getAddressFromSender(from);
  if (!isEmailLike(senderAddress)) {
    throw new EmailConfigurationError("BOOKING_FROM_EMAIL must be a valid sender, for example Hermanos <onboarding@resend.dev>.");
  }

  if (senderAddress.endsWith(".vercel.app")) {
    throw new EmailConfigurationError("BOOKING_FROM_EMAIL cannot use a vercel.app sender domain.");
  }

  const recipients = to.split(",").map((email) => email.trim()).filter(Boolean);
  if (!recipients.length) {
    throw new EmailConfigurationError("BOOKING_NOTIFY_EMAIL must include at least one recipient.");
  }

  const invalidRecipient = recipients.find((email) => !isEmailLike(email));
  if (invalidRecipient) {
    throw new EmailConfigurationError(`BOOKING_NOTIFY_EMAIL includes an invalid recipient: ${invalidRecipient}.`);
  }

  const submittedAt = new Date();

  console.info("Sending booking notification email", {
    from: senderAddress,
    to: recipients,
  });

  return sendEmail({
    from,
    to: recipients,
    subject: `New booking request: ${booking.name} - ${formatDate(booking.date)} ${booking.time}`,
    text: buildTextEmail(booking, submittedAt),
    html: buildHtmlEmail(booking, submittedAt),
  });
}
