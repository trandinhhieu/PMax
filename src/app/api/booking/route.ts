import { NextResponse } from "next/server";
import type { SubmitBookingResult } from "@/features/booking/contracts/api";
import { submitBooking } from "@/server/booking/booking-service";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const result: SubmitBookingResult = {
      ok: false,
      status: 400,
      message: "Invalid JSON payload.",
      code: "INVALID_BOOKING_PAYLOAD",
    };

    return NextResponse.json(result, { status: result.status });
  }

  const result = await submitBooking(body);

  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json(result);
}
