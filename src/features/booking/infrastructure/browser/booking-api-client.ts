import type { StartBookingOtpResult, SubmitBookingResult } from "@/features/booking/contracts/api";
import type { BookingFormValues } from "@/lib/validation/booking";
import type { Locale } from "@/types/common";

type BookingSubmitPayload = BookingFormValues & {
  otpCode?: string;
  locale: Locale;
};

export async function submitBookingRequest(payload: BookingSubmitPayload): Promise<SubmitBookingResult> {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return (await response.json()) as SubmitBookingResult;
}

export async function startBookingOtp(contact: string): Promise<{
  responseOk: boolean;
  result: StartBookingOtpResult;
}> {
  const response = await fetch("/api/booking/otp/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contact }),
  });

  return {
    responseOk: response.ok,
    result: (await response.json()) as StartBookingOtpResult,
  };
}
