/**
 * WCAG 2.1 contrast ratio utilities.
 * Used at build time to validate theme presets meet minimum readability.
 */

/** Parse hex to [r, g, b] 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Relative luminance per WCAG 2.1 */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1:1 to 21:1) */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Minimum contrast ratios per WCAG 2.1 */
const WCAG_AA_NORMAL = 4.5; // normal text (< 18px or < 14px bold)
const WCAG_AA_LARGE = 3.0;  // large text (>= 18px or >= 14px bold)

export interface ContrastCheck {
  pair: string;
  fg: string;
  bg: string;
  ratio: number;
  required: number;
  pass: boolean;
}

/**
 * Validate all critical text/background pairs in a semantic token set.
 * Returns array of check results — any with pass=false is a violation.
 */
export function validateSemanticContrast(
  tokens: {
    bgPrimary: string;
    bgSecondary: string;
    bgContent: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  },
): ContrastCheck[] {
  const checks: ContrastCheck[] = [];

  const pairs: [string, string, string, number][] = [
    // [name, fg, bg, min-ratio]
    ['textPrimary on bgPrimary', tokens.textPrimary, tokens.bgPrimary, WCAG_AA_NORMAL],
    ['textPrimary on bgSecondary', tokens.textPrimary, tokens.bgSecondary, WCAG_AA_NORMAL],
    ['textPrimary on bgContent', tokens.textPrimary, tokens.bgContent, WCAG_AA_NORMAL],
    ['textPrimary on cardBg', tokens.textPrimary, tokens.cardBg, WCAG_AA_NORMAL],
    ['textSecondary on bgPrimary', tokens.textSecondary, tokens.bgPrimary, WCAG_AA_NORMAL],
    ['textSecondary on bgSecondary', tokens.textSecondary, tokens.bgSecondary, WCAG_AA_NORMAL],
    ['textSecondary on bgContent', tokens.textSecondary, tokens.bgContent, WCAG_AA_NORMAL],
    ['textSecondary on cardBg', tokens.textSecondary, tokens.cardBg, WCAG_AA_NORMAL],
    ['textMuted on bgPrimary', tokens.textMuted, tokens.bgPrimary, WCAG_AA_LARGE],
    ['textMuted on bgSecondary', tokens.textMuted, tokens.bgSecondary, WCAG_AA_LARGE],
    ['textMuted on cardBg', tokens.textMuted, tokens.cardBg, WCAG_AA_LARGE],
  ];

  for (const [pair, fg, bg, required] of pairs) {
    // Skip pairs with rgba/transparent values — can't compute
    if (fg.includes('rgba') || bg.includes('rgba')) continue;
    const ratio = contrastRatio(fg, bg);
    checks.push({ pair, fg, bg, ratio: Math.round(ratio * 100) / 100, required, pass: ratio >= required });
  }

  return checks;
}

/**
 * Validate component tokens (sidebar text on sidebar bg, etc.)
 */
export function validateComponentContrast(
  tokens: {
    sidebarBg: string;
    sidebarText: string;
    sidebarTextMuted: string;
    headerBg: string;
    navSectionLabel: string;
  },
  semanticTokens: {
    textPrimary: string;
  },
): ContrastCheck[] {
  const checks: ContrastCheck[] = [];

  const pairs: [string, string, string, number][] = [
    ['sidebarText on sidebarBg', tokens.sidebarText, tokens.sidebarBg, WCAG_AA_NORMAL],
    ['sidebarTextMuted on sidebarBg', tokens.sidebarTextMuted, tokens.sidebarBg, WCAG_AA_LARGE],
    ['navSectionLabel on sidebarBg', tokens.navSectionLabel, tokens.sidebarBg, WCAG_AA_LARGE],
    ['textPrimary on headerBg', semanticTokens.textPrimary, tokens.headerBg, WCAG_AA_NORMAL],
  ];

  for (const [pair, fg, bg, required] of pairs) {
    if (fg.includes('rgba') || bg.includes('rgba')) continue;
    const ratio = contrastRatio(fg, bg);
    checks.push({ pair, fg, bg, ratio: Math.round(ratio * 100) / 100, required, pass: ratio >= required });
  }

  return checks;
}
