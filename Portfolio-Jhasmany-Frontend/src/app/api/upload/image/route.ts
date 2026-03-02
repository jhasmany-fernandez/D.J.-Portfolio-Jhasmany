import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.API_URL || 'http://backend:3001';

    const response = await fetch(`${backendUrl}/api/upload/images`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch images' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ images: result || [] });
  } catch (error) {
    console.error('[Upload API] List proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');


    // Forward the request to the backend
    const backendUrl = process.env.API_URL || 'http://backend:3001';

    const response = await fetch(`${backendUrl}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Upload API] Backend upload error:', response.status, errorText);
      return NextResponse.json(
        { error: errorText || 'Failed to upload image' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Upload API] Upload proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
