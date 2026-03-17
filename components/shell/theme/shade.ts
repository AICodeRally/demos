import type { ShadeScale } from './types';

/** Parse hex (#RGB or #RRGGBB) to [r, g, b] 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Convert RGB to HSL (h: 0-360, s: 0-100, l: 0-100) */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

/** Convert HSL back to hex */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const LIGHTNESS_MAP: Record<keyof ShadeScale, number> = {
  50: 97, 100: 94, 200: 86, 300: 77, 400: 66,
  500: 50, 600: 41, 700: 33, 800: 24, 900: 17, 950: 10,
};

/**
 * Generate a full shade scale from a single hex color.
 * Preserves the hue and saturation, varies lightness.
 */
export function generateShades(hex: string): ShadeScale {
  const [h, s] = rgbToHsl(...hexToRgb(hex));
  const shades = {} as ShadeScale;
  for (const [step, lightness] of Object.entries(LIGHTNESS_MAP)) {
    (shades as unknown as Record<string, string>)[step] = hslToHex(h, s, lightness);
  }
  return shades;
}
