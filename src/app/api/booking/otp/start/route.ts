import { NextResponse } from "next/server";
import type { StartBookingOtpResult } from "@/features/booking/contracts/api";
import { startBookingOtp } from "@/server/booking/booking-otp-service";
import { isBookingOtpEnabled } from "@/config/booking";
import { startSmsOtp } from "@/server/otp/twilio-verify";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const result: StartBookingOtpResult = { ok: false, status: 400, message: "Invalid JSON payload.", code: "INVALID_OTP_PAYLOAD" };
    return NextResponse.json(result, { status: result.status });
  }

  const result = await startBookingOtp(body, { isOtpEnabled: isBookingOtpEnabled, startSmsOtp });
  return NextResponse.json(result, result.ok ? undefined : { status: result.status });
}
