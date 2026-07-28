import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../../_utils';

const AUTH_COOKIE = 'auth_token';
const STATE_COOKIE = 'google_oauth_state';

const getSiteOrigin = (request: NextRequest) => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return request.nextUrl.origin;
};

const redirectToLogin = (request: NextRequest, message: string) => {
  const loginUrl = new URL('/auth/login', getSiteOrigin(request));
  loginUrl.searchParams.set('error', message);
  return NextResponse.redirect(loginUrl);
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const oauthError = request.nextUrl.searchParams.get('error');
  const savedState = request.cookies.get(STATE_COOKIE)?.value;

  if (oauthError) {
    return redirectToLogin(request, 'Google sign-in was cancelled.');
  }

  if (!code || !state || !savedState || state !== savedState) {
    return redirectToLogin(request, 'Google sign-in could not be verified.');
  }

  try {
    const origin = getSiteOrigin(request);
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirectUri: `${origin}/api/auth/google/callback`,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.access_token) {
      const errorMessage =
        typeof result?.message === 'string'
          ? result.message
          : 'Google sign-in failed.';
      return redirectToLogin(request, errorMessage);
    }

    const dashboardPath =
      result.user?.role === 'testimonial' ? '/dashboard/testimonials' : '/dashboard';
    const dashboardUrl = new URL(dashboardPath, origin);
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    redirectResponse.cookies.delete(STATE_COOKIE);
    redirectResponse.cookies.set(AUTH_COOKIE, result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return redirectResponse;
  } catch (error) {
    return redirectToLogin(
      request,
      error instanceof Error ? error.message : 'Google sign-in failed.',
    );
  }
}
