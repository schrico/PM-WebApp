export const systemColors: Record<string, string> = {
  'B0X': 'bg-blue-500',
  'XTM': 'bg-purple-500',
  'SSE': 'bg-green-500',
  'STM': 'bg-orange-500',
  'LAT': 'bg-pink-500',
};

export function getSystemColor(system: string): string {
  return systemColors[system] || 'bg-gray-500';
}
