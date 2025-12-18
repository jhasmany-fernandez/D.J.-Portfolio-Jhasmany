import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.API_URL || 'http://backend:3001';
    const response = await fetch(`${apiUrl}/api/testimonials-section/active`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch testimonials section' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Testimonials section API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
