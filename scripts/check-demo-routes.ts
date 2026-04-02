import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const DEMOS_DIR = path.join(ROOT, 'app/(demos)');
const ALLOWLIST_PATH = path.join(ROOT, 'docs/standards/demo-standard-allowlist.json');

interface Allowlist {
  deepLinkRoutes: string[];
}

function readAllowlist(): Allowlist {
  const raw = fs.readFileSync(ALLOWLIST_PATH, 'utf8');
  return JSON.parse(raw) as Allowlist;
}

function walkPages(dir: string, acc: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkPages(fp, acc);
    } else if (ent.isFile() && ent.name === 'page.tsx') {
      acc.push(fp);
    }
  }
  return acc;
}

function extractHrefs(configText: string): string[] {
  return [...configText.matchAll(/href:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

function main() {
  const allow = readAllowlist();
  const allowedDeep = new Set(allow.deepLinkRoutes ?? []);

  const demoDirs = fs
    .readdirSync(DEMOS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const demo of demoDirs) {
    const demoRoot = path.join(DEMOS_DIR, demo);
    const cfgPath = path.join(demoRoot, 'demo.config.ts');
    if (!fs.existsSync(cfgPath)) continue;

    const cfgText = fs.readFileSync(cfgPath, 'utf8');
    const hrefs = extractHrefs(cfgText);
    const hrefSet = new Set(hrefs);
    const isNavlessDemo = hrefs.length === 0;

    const routes = walkPages(demoRoot).map((fp) => {
      const rel = path.relative(DEMOS_DIR, fp).replace(/\\/g, '/');
      return `/${rel.replace(/\/page\.tsx$/, '')}`;
    });

    if (isNavlessDemo) {
      warnings.push(`${demo}: no nav hrefs configured (valid for focus/wizard style demos)`);
      continue;
    }

    const missing = hrefs.filter((h) => !routes.includes(h));
    if (missing.length > 0) {
      errors.push(`${demo}: missing routes for nav hrefs -> ${[...new Set(missing)].join(', ')}`);
    }

    const orphan = routes.filter((r) => {
      if (hrefSet.has(r)) return false;
      if (r === `/${demo}`) return false;
      if (allowedDeep.has(r)) return false;
      // Allow parent container routes when child routes are in nav.
      if (hrefs.some((h) => h.startsWith(`${r}/`))) return false;
      return true;
    });
    if (orphan.length > 0) {
      errors.push(`${demo}: unallowlisted orphan routes -> ${orphan.join(', ')}`);
    }
  }

  if (warnings.length > 0) {
    console.log('Route check warnings:');
    for (const w of warnings) console.log(`  - ${w}`);
  }

  if (errors.length > 0) {
    console.error('Route check failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log('✓ Demo route check passed (nav hrefs resolve, orphan routes allowlisted).');
}

main();
