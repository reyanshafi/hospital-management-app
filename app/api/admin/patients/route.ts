import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET() {
  try {
    await connectToDatabase();
    const patients = await Patient.find({});
    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id, ...update } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const patient = await Patient.findByIdAndUpdate(id, update, { new: true });
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json({ message: "Patient updated", patient });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json({ message: "Patient deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
