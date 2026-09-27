export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function isMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}
