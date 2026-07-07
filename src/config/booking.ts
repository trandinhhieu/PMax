export function isBookingOtpEnabled() {
  const serverValue = process.env.BOOKING_OTP_ENABLED;
  const publicValue = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED;

  return (serverValue ?? publicValue ?? "").toLowerCase() === "true";
}
