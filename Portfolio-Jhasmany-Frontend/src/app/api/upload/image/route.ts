import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    console.log('[Upload API] Received file:', file ? (file as File).name : 'no file');

    // Forward the request to the backend
    const backendUrl = process.env.API_URL || 'http://backend:3001';
    console.log('[Upload API] Forwarding to:', `${backendUrl}/api/upload/image`);

    const response = await fetch(`${backendUrl}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    console.log('[Upload API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Upload API] Backend upload error:', response.status, errorText);
      return NextResponse.json(
        { error: errorText || 'Failed to upload image' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('[Upload API] Upload successful:', result.url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Upload API] Upload proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
