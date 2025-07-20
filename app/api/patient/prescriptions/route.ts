import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Prescription = require("@/models/Prescription");
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
  const prescriptions = await Prescription.find({ patient: patientId }).populate("patient").sort({ expires: -1 });
  return NextResponse.json({ prescriptions });
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    const prescription = await Prescription.findByIdAndUpdate(id, { status }, { new: true });
    if (!prescription) return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    return NextResponse.json({ message: "Prescription updated", prescription });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
