import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");
const Visit = require("@/models/Visit");
const Patient = require("@/models/Patient");

export async function GET() {
  await connectToDatabase();
  const records = await Visit.find({}).populate("patient").sort({ date: -1 });
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { patient, doctor, type, date, status, notes } = await req.json();
    if (!patient || !doctor || !type || !date || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const record = await Visit.create({ patient, doctor, type, date, status, notes });
    return NextResponse.json({ message: "Record created", record });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { patient, doctor, type, date, status, notes } = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const record = await Visit.findByIdAndUpdate(
      id,
      { patient, doctor, type, date, status, notes },
      { new: true }
    );
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record updated", record });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const record = await Visit.findByIdAndDelete(id);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record deleted" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
} 