// Generic API Response types for consistent error handling
export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown }

// Contact form response type
export interface ContactFormResponse {
  success: boolean
  message?: string
  error?: string
  details?: unknown
}
