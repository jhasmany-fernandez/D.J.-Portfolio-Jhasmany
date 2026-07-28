import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const STATE_COOKIE = 'google_oauth_state';

const getSiteOrigin = (request: NextRequest) => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return request.nextUrl.origin;
};

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const loginUrl = new URL('/auth/login', getSiteOrigin(request));
    loginUrl.searchParams.set('error', 'Google sign-in is not configured.');
    return NextResponse.redirect(loginUrl);
  }

  const origin = getSiteOrigin(request);
  const state = randomUUID();
  const redirectUri = `${origin}/api/auth/google/callback`;

  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleUrl.searchParams.set('client_id', clientId);
  googleUrl.searchParams.set('redirect_uri', redirectUri);
  googleUrl.searchParams.set('response_type', 'code');
  googleUrl.searchParams.set('scope', 'openid email profile');
  googleUrl.searchParams.set('state', state);
  googleUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(googleUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });

  return response;
}
