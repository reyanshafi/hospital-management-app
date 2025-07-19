import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Bed = require("@/models/Bed");
// @ts-ignore
const User = require("@/models/User");

export async function GET() {
  try {
    await connectToDatabase();
    // Populate patient name if assigned
    const beds = await Bed.find({}).lean();
    for (const bed of beds) {
      if (!bed.available && bed.patient) {
        const patient = await User.findById(bed.patient);
        bed.patientName = patient ? patient.name : "-";
      } else {
        bed.patientName = "-";
      }
    }
    return NextResponse.json({ beds });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { number } = await req.json();
    if (!number) {
      return NextResponse.json({ error: "Missing bed number" }, { status: 400 });
    }
    const existing = await Bed.findOne({ number });
    if (existing) {
      return NextResponse.json({ error: "Bed number already exists" }, { status: 409 });
    }
    const bed = await Bed.create({ number, available: true });
    return NextResponse.json({ message: "Bed added", bed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
