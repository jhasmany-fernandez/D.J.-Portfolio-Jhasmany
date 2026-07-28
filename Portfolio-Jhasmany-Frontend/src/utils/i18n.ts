export function pickLocalizedText<T extends object>(
  item: T,
  field: string,
  language: string,
): string {
  const localizedField = language === 'Es' ? `${field}Es` : field
  const values = item as Record<string, unknown>
  const localizedValue = values[localizedField]
  const fallbackValue = values[field]

  if (typeof localizedValue === 'string' && localizedValue.trim()) {
    return localizedValue
  }

  return typeof fallbackValue === 'string' ? fallbackValue : ''
}

export function pickLocalizedArray<T extends object>(
  item: T,
  field: string,
  language: string,
): string[] | undefined {
  const localizedField = language === 'Es' ? `${field}Es` : field
  const values = item as Record<string, unknown>
  const localizedValue = values[localizedField]
  const fallbackValue = values[field]

  if (Array.isArray(localizedValue) && localizedValue.length > 0) {
    return localizedValue.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
  }

  if (Array.isArray(fallbackValue)) {
    return fallbackValue.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
  }

  return undefined
}
