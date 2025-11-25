export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${day} ${month}`;
}
