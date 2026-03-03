/**
 * Generate a stable unique ID for list items.
 * Uses crypto.randomUUID when available (Expo/RN), otherwise a fallback.
 */
export function generateStableId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
