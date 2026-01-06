import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const apiUrl = process.env.API_URL || 'http://backend:3001';

    const response = await fetch(`${apiUrl}/api/footer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update footer configuration' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Revalidate the cache to show updated footer on the main page
    revalidatePath('/', 'layout');
    revalidateTag('footer');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Footer update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
