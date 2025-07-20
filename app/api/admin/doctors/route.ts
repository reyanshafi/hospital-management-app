import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Doctor = require("@/models/Doctor");

export async function GET() {
  try {
    await connectToDatabase();
    const doctors = await Doctor.find({});
    return NextResponse.json({ doctors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { name, email, phone, specialty } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const doctor = await Doctor.findByIdAndUpdate(id, { name, email, phone, specialty }, { new: true });
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    return NextResponse.json({ message: "Doctor updated", doctor });
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
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    return NextResponse.json({ message: "Doctor deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
