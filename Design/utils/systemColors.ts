export const systemColors: Record<string, string> = {
  'Phrase': 'bg-blue-500',
  'Trados': 'bg-purple-500',
  'MemoQ': 'bg-green-500',
};

export function getSystemColor(system: string): string {
  return systemColors[system] || 'bg-gray-500';
}
