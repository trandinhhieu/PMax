import { NextResponse } from "next/server";
import { submitBooking } from "@/server/booking/booking-service";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const result = await submitBooking(body);

  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json(result);
}
