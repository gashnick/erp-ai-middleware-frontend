type DateInput = string | Date | number;

export function formatDate(
  input: DateInput,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  locale: string = "en-US",
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(input));
}

export function formatRelativeDate(input: DateInput): string {
  const date = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(input);
}

export function isOverdue(dueDate: DateInput): boolean {
  return new Date(dueDate) < new Date();
}
