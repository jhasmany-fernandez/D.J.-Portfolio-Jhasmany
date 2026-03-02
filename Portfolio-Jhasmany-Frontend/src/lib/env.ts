import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  CONTACT_FORM_ACTION_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Create a safe env object that works on both client and server
const createEnv = () => {
  // On the client, use hardcoded values or runtime config
  if (typeof window !== 'undefined') {
    return {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://181.114.111.21',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      CONTACT_FORM_ACTION_URL: process.env.CONTACT_FORM_ACTION_URL,
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    }
  }

  // On the server, validate strictly
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      console.error(JSON.stringify(error.issues, null, 2))
      throw new Error('Invalid environment variables')
    }
    throw error
  }
}

export const env = createEnv()
