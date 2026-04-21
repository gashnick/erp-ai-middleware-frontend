/**
 * Safely format a date string to locale date
 * Returns "—" if date is invalid
 */
export function formatDateSafe(
  dateString: string | null | undefined,
  locale = "en-US",
): string {
  if (!dateString) return "—";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
