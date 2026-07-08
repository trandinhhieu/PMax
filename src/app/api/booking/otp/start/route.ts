import { NextResponse } from "next/server";
import type { StartBookingOtpResult } from "@/features/booking/contracts/api";
import { startBookingOtp } from "@/server/booking/booking-otp-service";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const result: StartBookingOtpResult = {
      ok: false,
      status: 400,
      message: "Invalid JSON payload.",
      code: "INVALID_OTP_PAYLOAD",
    };

    return NextResponse.json(result, { status: result.status });
  }

  const result = await startBookingOtp(body);

  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json(result);
}
