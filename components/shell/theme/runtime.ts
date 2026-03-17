/**
 * Runtime override API — patch individual CSS vars at runtime without a full re-resolve.
 */

/**
 * Sets one or more CSS custom properties on :root.
 * Keys should be provided WITHOUT the leading `--` (e.g., `{ 'sem-bg-primary': '#000' }`).
 */
export function setTokens(overrides: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(overrides)) {
    root.style.setProperty(`--${key}`, value);
  }
}

/**
 * Removes all runtime token overrides from :root.
 * Only clears vars in the --palette-*, --sem-*, and --comp-* namespaces.
 * Does NOT remove --prizym-* backward compat aliases (those are set by applyCssVars).
 */
export function resetTokens(): void {
  const root = document.documentElement;
  const style = root.style;
  const toRemove: string[] = [];
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    if (
      prop.startsWith('--palette-') ||
      prop.startsWith('--sem-') ||
      prop.startsWith('--comp-')
    ) {
      toRemove.push(prop);
    }
  }
  for (const prop of toRemove) {
    root.style.removeProperty(prop);
  }
}
