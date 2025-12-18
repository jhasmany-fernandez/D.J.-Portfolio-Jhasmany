import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join('/');
    const backendUrl = process.env.API_URL || 'http://backend:3001';

    // Fetch image from backend
    const imageUrl = `${backendUrl}/uploads/${path}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get image data
    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return image with proper headers
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
