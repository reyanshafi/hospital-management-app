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
