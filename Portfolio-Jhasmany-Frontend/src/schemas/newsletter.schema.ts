import { z } from 'zod'

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  firstName: z
    .string()
    .max(100, 'First name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .max(100, 'Last name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  source: z
    .string()
    .max(50, 'Source must be less than 50 characters')
    .optional()
    .or(z.literal('')),
})

export type NewsletterSubscribeFormData = z.infer<typeof newsletterSubscribeSchema>