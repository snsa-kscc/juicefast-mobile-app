/**
 * Utility functions for input sanitization and validation
 */

export function sanitizeForLog(input: any): string {
  if (typeof input === 'string') {
    return input.replace(/[\r\n\t]/g, ' ').trim();
  }
  return JSON.stringify(input).replace(/[\r\n\t]/g, ' ');
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>\"'&]/g, '').trim();
}

export function validateNumericRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeUserId(userId: string): string {
  return userId.replace(/[^a-zA-Z0-9-_]/g, '');
}