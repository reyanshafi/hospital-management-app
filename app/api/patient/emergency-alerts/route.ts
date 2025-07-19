import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");

export async function GET(req: Request) {
  await connectToDatabase();
  // @ts-ignore
  const Alert = require("@/models/Alert");
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ alerts: [] });
  try {
    const alerts = await Alert.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .select("type message createdAt isCritical");
    return NextResponse.json({ alerts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
} 