// src/app/api/hello/route.ts

import {NextResponse} from 'next/server';

export async function GET() {
  return NextResponse.json({message: 'Hello, world!'});
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({message: 'Data received', data});
}