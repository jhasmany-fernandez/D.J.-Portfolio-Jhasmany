import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.API_URL || 'http://backend:3001';
    const response = await fetch(`${apiUrl}/api/footer/active`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch footer configuration' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Footer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
