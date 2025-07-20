import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Result = require("@/models/Result");
// @ts-ignore
const Patient = require("@/models/Patient");
// @ts-ignore
const Doctor = require("@/models/Doctor");

export async function GET() {
  await connectToDatabase();
  const results = await Result.find({}).populate("patient").populate("doctor").sort({ date: -1 });
  return NextResponse.json({ results });
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { patient, doctor, status, report, date, category, findings, impression, results } = await req.json();
    if (!patient || !doctor || !status || !report || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await Result.create({ patient, doctor, status, report, date, category, findings, impression, results });
    return NextResponse.json({ message: "Result created", result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
} 