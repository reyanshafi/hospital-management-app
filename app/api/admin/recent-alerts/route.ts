import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");

export async function GET() {
  await connectToDatabase();
  // @ts-ignore
  const Alert = require("@/models/Alert");
  try {
    const alerts = await Alert.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("patientName message createdAt");
    return NextResponse.json({ alerts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
} 