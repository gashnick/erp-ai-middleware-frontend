/**
 * Detect if a value is encrypted (hex:hex:hex format)
 */
export function isEncrypted(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^[a-f0-9]+:[a-f0-9]+:[a-f0-9]+$/.test(value);
}

/**
 * Display encrypted value as placeholder or original if decrypted
 */
export function displayEncrypted(value: unknown, placeholder = "Encrypted"): string {
  if (typeof value !== "string") return String(value ?? "—");
  return isEncrypted(value) ? placeholder : value;
}
