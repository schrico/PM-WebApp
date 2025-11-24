export function formatNumber(value: number): string {
  return value.toLocaleString("en-US"); // 1,234 style
}

export function formatDate(dateStr: string): string {
  // Input like "2025-11-25"
  const date = new Date(dateStr + "T00:00:00"); // avoid timezone issues
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }); // e.g. "25 Nov"
}
