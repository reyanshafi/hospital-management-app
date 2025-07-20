import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Visit = require("@/models/Visit");
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const doctorName = url.searchParams.get("doctorName");
  const query = doctorName ? { doctor: doctorName } : {};
  const records = await Visit.find(query).populate("patient").sort({ date: -1 });
  return NextResponse.json({ records });
} 