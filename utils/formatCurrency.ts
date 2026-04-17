export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency: string = "USD",
): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${formatCurrency(value / 1_000_000, currency)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${formatCurrency(value / 1_000, currency)}K`;
  }
  return formatCurrency(value, currency);
}
