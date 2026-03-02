import ky, { HTTPError } from 'ky'
import { env } from './env'

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Create a configured ky instance
export const apiClient = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  retry: {
    limit: 2,
    methods: ['get', 'post'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add custom headers if needed
        request.headers.set('Content-Type', 'application/json')
        request.headers.set('Accept', 'application/json')
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Log errors for debugging
        if (!response.ok) {
          const url = _request.url
          console.error(`[API Error] ${response.status} - ${url}`)
        }
        return response
      },
    ],
  },
})

// Helper function to handle API errors consistently
export async function handleAPICall<T>(
  apiCall: Promise<T>,
): Promise<{ success: true; data: T } | { success: false; error: string; details?: unknown }> {
  try {
    const data = await apiCall
    return { success: true, data }
  } catch (error) {
    if (error instanceof HTTPError) {
      const details = await error.response.json().catch(() => null)
      return {
        success: false,
        error: `Request failed with status ${error.response.status}`,
        details,
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
