import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Test API route is working',
    timestamp: new Date().toISOString(),
    env_check: process.env.OPENAI_API_KEY ? 'API key found' : 'API key missing'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'ok',
      message: 'Test POST is working',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to parse JSON',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
