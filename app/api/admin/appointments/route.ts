import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");
const Appointment = require("@/models/Appointment");

export async function GET() {
  await connectToDatabase();
  const appointments = await Appointment.find({}).sort({ date: 1 });
  return NextResponse.json({ appointments });
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Appointment updated", appointment });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
} 