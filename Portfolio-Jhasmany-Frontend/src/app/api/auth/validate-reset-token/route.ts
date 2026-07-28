import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../_utils';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ valid: false, message: 'Reset token is required' }, { status: 400 });
  }

  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    );

    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        message: error instanceof Error ? error.message : 'Failed to validate token',
      },
      { status: 500 },
    );
  }
}
