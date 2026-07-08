export function normalizeBookingPhoneNumber(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "");

  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("0")) return `+84${compact.slice(1)}`;
  if (compact.startsWith("84")) return `+${compact}`;

  return compact;
}

export function isE164BookingPhoneNumber(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

export function isValidBookingOtpPhoneNumber(value: string) {
  return isE164BookingPhoneNumber(normalizeBookingPhoneNumber(value));
}
