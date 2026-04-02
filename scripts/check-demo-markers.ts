import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = [
  path.join(ROOT, 'app/(demos)'),
  path.join(ROOT, 'data'),
];
const ALLOWLIST_PATH = path.join(ROOT, 'docs/standards/demo-standard-allowlist.json');

interface MarkerAllow {
  path: string;
  contains: string;
}

interface Allowlist {
  markerAllowlist: MarkerAllow[];
}

interface Violation {
  file: string;
  line: number;
  token: string;
  text: string;
}

function readAllowlist(): Allowlist {
  const raw = fs.readFileSync(ALLOWLIST_PATH, 'utf8');
  return JSON.parse(raw) as Allowlist;
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkFiles(fp, acc);
    } else if (ent.isFile() && /\.(ts|tsx)$/i.test(ent.name)) {
      acc.push(fp);
    }
  }
  return acc;
}

function isAllowed(relPath: string, lineText: string, allow: MarkerAllow[]): boolean {
  return allow.some((entry) => entry.path === relPath && lineText.includes(entry.contains));
}

function detectToken(line: string): string | null {
  if (/\b(TODO|FIXME|WIP)\b/i.test(line)) return 'todo';
  if (/\bTBD\b/i.test(line)) return 'tbd';

  const hasPlaceholderWord = /\bplaceholder(s)?\b/i.test(line);
  const isInputPlaceholder = /\bplaceholder\s*=\s*['"`]/i.test(line);
  const isPlaceholderUtilityClass = /placeholder:/i.test(line);
  if (hasPlaceholderWord && !isInputPlaceholder && !isPlaceholderUtilityClass) return 'placeholder';

  return null;
}

function main() {
  const allow = readAllowlist();
  const markerAllow = allow.markerAllowlist ?? [];

  const violations: Violation[] = [];
  for (const dir of TARGET_DIRS) {
    for (const file of walkFiles(dir)) {
      const rel = path.relative(ROOT, file).replace(/\\/g, '/');
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const token = detectToken(line);
        if (!token) continue;
        if (isAllowed(rel, line, markerAllow)) continue;

        violations.push({
          file: rel,
          line: i + 1,
          token,
          text: line.trim(),
        });
      }
    }
  }

  if (violations.length > 0) {
    console.error('Marker check failed:');
    for (const v of violations) {
      console.error(`  - ${v.file}:${v.line} [${v.token}] ${v.text}`);
    }
    process.exit(1);
  }

  console.log('✓ Demo marker check passed (no unallowlisted TODO/TBD/placeholder markers).');
}

main();
