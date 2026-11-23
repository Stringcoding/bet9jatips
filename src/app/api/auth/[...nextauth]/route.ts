import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Auth API Route" });
}

export async function POST() {
  return NextResponse.json({ message: "Auth POST Route" });
}
