import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");
const Appointment = require("@/models/Appointment");

export async function GET() {
  await connectToDatabase();
  const appointments = await Appointment.find({}).populate('patient', 'firstName lastName').sort({ date: 1 });
  return NextResponse.json({ appointments });
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id, status, doctor, date, time, type } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });
    }
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (doctor) updateData.doctor = doctor;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (type) updateData.type = type;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
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

export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });
    }
    
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
} 