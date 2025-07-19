import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");

export async function GET() {
  await connectToDatabase();
  // @ts-ignore
  const Patient = require("@/models/Patient");
  try {
    const patients = await Patient.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName age createdAt");
    return NextResponse.json({ patients });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
} 