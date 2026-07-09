import { businessInfo } from "@/config/business";
import { formatIsoDateForDisplay } from "@/lib/date";
import type { BookingRequestValues } from "@/lib/validation/booking";

const contactChannelLabels: Record<BookingRequestValues["contactChannel"], string> = {
  phone: "Phone",
  whatsapp: "WhatsApp",
  zalo: "Zalo",
  messenger: "Facebook Messenger",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: string) {
  return formatIsoDateForDisplay(date, businessInfo.timeZone);
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: businessInfo.timeZone,
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
  ];
}

export function buildBookingEmailSubject(booking: BookingRequestValues) {
  return `New booking request: ${booking.name} - ${formatDate(booking.date)} ${booking.time}`;
}

export function buildBookingEmailText(booking: BookingRequestValues, submittedAt: Date) {
  return [
    `New booking request for ${businessInfo.displayName}`,
    "",
    ...buildBookingLines(booking, submittedAt),
    "",
    "Internal notification only. No customer confirmation email was sent.",
  ].join("\n");
}

export function buildBookingEmailHtml(booking: BookingRequestValues, submittedAt: Date) {
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
