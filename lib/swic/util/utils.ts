/** Map a category name to its dot color class */
export function getCategoryDotClass(category: string): string {
  const key = category.toLowerCase().replace(/\s+/g, '-');
  const map: Record<string, string> = {
    mattress: 'cat-dot-mattress',
    'adjustable-base': 'cat-dot-adjustable',
    bedding: 'cat-dot-bedding',
    accessories: 'cat-dot-accessories',
    tvs: 'cat-dot-tvs',
    computers: 'cat-dot-computers',
    audio: 'cat-dot-audio',
    'smart-home': 'cat-dot-smart-home',
    warranty: 'cat-dot-warranty',
  };
  return map[key] ?? 'cat-dot-accessories';
}

/** Map a category name to its hex color */
export function getCategoryColor(category: string): string {
  const key = category.toLowerCase().replace(/\s+/g, '-');
  const map: Record<string, string> = {
    mattress: '#3b82f6',
    'adjustable-base': '#8b5cf6',
    bedding: '#14b8a6',
    accessories: '#f59e0b',
    tvs: '#3b82f6',
    computers: '#8b5cf6',
    audio: '#14b8a6',
    'smart-home': '#06b6d4',
    warranty: '#22c55e',
  };
  return map[key] ?? '#f59e0b';
}
