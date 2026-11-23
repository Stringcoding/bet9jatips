import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Tips API Route" });
}

export async function POST() {
  return NextResponse.json({ message: "Tips POST Route" });
}
