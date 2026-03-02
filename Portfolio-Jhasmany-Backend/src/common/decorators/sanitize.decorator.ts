import { Transform } from 'class-transformer';

// Sanitize HTML and trim whitespace
export function SanitizeHtml() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    // Basic HTML sanitization - remove script tags and dangerous attributes
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .trim();
  });
}

// Sanitize and normalize email
export function SanitizeEmail() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.toLowerCase().trim();
  });
}

// Sanitize text input
export function SanitizeText() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.trim().replace(/\s+/g, ' ');
  });
}