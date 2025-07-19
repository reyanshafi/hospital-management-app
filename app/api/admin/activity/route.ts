import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real activity feed from DB
  const activities = [
    {
      title: "New patient registered",
      description: "Sarah Johnson - 2 minutes ago",
    },
    {
      title: "Doctor assigned",
      description: "Dr. Smith assigned to Room 205 - 5 minutes ago",
    },
    {
      title: "Emergency alert resolved",
      description: "Patient John Doe - 10 minutes ago",
    },
    {
      title: "Bed 102 assigned",
      description: "Bed 102 assigned to Jane Doe - 15 minutes ago",
    },
  ];
  return NextResponse.json({ activities });
} 