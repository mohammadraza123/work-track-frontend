import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { lat, lng, timestamp } = await req.json();

  // Save to your database here
  // e.g. await db.locationLog.create({ data: { lat, lng, timestamp, employeeId } })

  console.log("Location ping:", { lat, lng, timestamp });

  return NextResponse.json({ success: true });
}