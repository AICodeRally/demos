import type { SaleItem } from '@/lib/swic/engine/types';

// ── Bundle Definitions ─────────────────────────────────────

export interface BundleDefinition {
  id: string;
  label: string;
  requiredCategories: string[];
  bonusAmount: number;
}

export interface DetectedBundle {
  definition: BundleDefinition;
  items: SaleItem[];
  count: number;
}

// ── Default Bundle Catalog ─────────────────────────────────

export const MATTRESS_FIRM_BUNDLES: BundleDefinition[] = [
  {
    id: 'sleep-system',
    label: 'Sleep System Bundle',
    requiredCategories: ['Mattress', 'Adjustable Base'],
    bonusAmount: 75,
  },
];

// ── Detection Logic ────────────────────────────────────────

/**
 * Detect complete bundles from a list of sale items.
 *
 * For each bundle definition the function checks whether the sale
 * contains at least one item from every required category. The
 * `count` is the minimum total quantity across the required
 * categories, and the `items` array contains every SaleItem that
 * contributes to the bundle.
 */
export function detectBundles(
  items: SaleItem[],
  definitions: BundleDefinition[],
): DetectedBundle[] {
  const detected: DetectedBundle[] = [];

  for (const definition of definitions) {
    // Group items by required category
    const categoryItems: Map<string, SaleItem[]> = new Map();

    for (const cat of definition.requiredCategories) {
      const matching = items.filter((item) => item.category === cat);
      if (matching.length === 0) {
        // Missing a required category — bundle incomplete
        categoryItems.clear();
        break;
      }
      categoryItems.set(cat, matching);
    }

    if (categoryItems.size === 0) continue;

    // Count = min total quantity across required categories
    const quantityPerCategory = definition.requiredCategories.map((cat) => {
      const catItems = categoryItems.get(cat) ?? [];
      return catItems.reduce((sum, item) => sum + item.quantity, 0);
    });

    const count = Math.min(...quantityPerCategory);
    if (count <= 0) continue;

    // Collect all contributing items
    const bundleItems: SaleItem[] = [];
    for (const cat of definition.requiredCategories) {
      const catItems = categoryItems.get(cat) ?? [];
      bundleItems.push(...catItems);
    }

    detected.push({
      definition,
      items: bundleItems,
      count,
    });
  }

  return detected;
}
