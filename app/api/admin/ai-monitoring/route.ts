import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import AIMonitoring from '@/models/AIMonitoring';

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { patientId, patientName, heartRate, spo2, temperature, status } = await req.json();
    if (!patientId || !patientName || !heartRate || !spo2 || !temperature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const data = await AIMonitoring.create({ patientId, patientName, heartRate, spo2, temperature, status });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    // Get latest monitoring data for each patient
    const latest = await AIMonitoring.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
        _id: '$patientId',
        patientName: { $first: '$patientName' },
        heartRate: { $first: '$heartRate' },
        spo2: { $first: '$spo2' },
        temperature: { $first: '$temperature' },
        status: { $first: '$status' },
        timestamp: { $first: '$timestamp' },
      }}
    ]);
    return NextResponse.json({ monitoring: latest });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 