import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Bed = require("@/models/Bed");
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET() {
  try {
    await connectToDatabase();
    // Populate patient name if assigned
    const beds = await Bed.find({}).lean();
    for (const bed of beds) {
      if (!bed.available && bed.patient) {
        const patient = await Patient.findById(bed.patient);
        bed.patientName = patient ? `${patient.firstName} ${patient.lastName}` : "-";
      } else {
        bed.patientName = "-";
      }
      // Ensure ward is present
      if (!bed.ward) bed.ward = "General";
    }
    return NextResponse.json({ beds });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { number, ward } = await req.json();
    if (!number) {
      return NextResponse.json({ error: "Missing bed number" }, { status: 400 });
    }
    const existing = await Bed.findOne({ number });
    if (existing) {
      return NextResponse.json({ error: "Bed number already exists" }, { status: 409 });
    }
    const bed = await Bed.create({ number, available: true, ward: ward || "General" });
    return NextResponse.json({ message: "Bed added", bed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { ward, available } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const bed = await Bed.findByIdAndUpdate(id, { ward, available }, { new: true });
    if (!bed) return NextResponse.json({ error: "Bed not found" }, { status: 404 });
    return NextResponse.json({ message: "Bed updated", bed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
