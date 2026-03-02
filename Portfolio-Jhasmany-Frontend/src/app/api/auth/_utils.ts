import { cookies } from 'next/headers'

export const getBackendUrl = () => process.env.API_URL || 'http://backend:3001'

export async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`,
  }
}

