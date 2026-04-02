/**
 * Scaffold a new demo with a layout-aware starter.
 *
 * Usage:
 *   pnpm scaffold:demo <slug> [--layout sidebar|topnav|wizard|focus]
 *     [--acts <n>] [--client "Client Name"] [--product "PRODUCT"]
 *     [--industry "Industry"] [--tagline "Tagline"] [--dry-run] [--yes]
 */
import * as fs from 'fs';
import * as path from 'path';

const DEMOS_ROOT = path.resolve(__dirname, '../app/(demos)');

type LayoutKind = 'sidebar' | 'topnav' | 'wizard' | 'focus';

interface Args {
  slug: string;
  layout: LayoutKind;
  acts: number;
  client: string;
  product: string;
  industry: string;
  tagline: string;
  dryRun: boolean;
  yes: boolean;
}

interface ActDef {
  index: number;
  id: string;
  label: string;
  icon: string;
  href: string;
}

function parseArgs(argv: string[]): Args {
  const args = argv.slice(2);
  const positional = args.filter((a) => !a.startsWith('--'));
  const slug = positional[0] ?? '';

  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    if (idx === -1) return undefined;
    return args[idx + 1];
  };

  const layoutRaw = (get('--layout') ?? 'sidebar') as LayoutKind;
  const allowed: LayoutKind[] = ['sidebar', 'topnav', 'wizard', 'focus'];
  if (!allowed.includes(layoutRaw)) {
    throw new Error(`Invalid --layout '${layoutRaw}'. Use one of: ${allowed.join(', ')}`);
  }

  const actsRaw = get('--acts') ?? '1';
  const acts = Number(actsRaw);
  if (!Number.isInteger(acts) || acts < 1 || acts > 12) {
    throw new Error(`Invalid --acts '${actsRaw}'. Use an integer between 1 and 12.`);
  }
  if (layoutRaw === 'focus' && acts > 1) {
    throw new Error(`layout 'focus' supports a single surface. Use --acts 1 (or pick sidebar/topnav/wizard).`);
  }

  const safeSlug = sanitizeSlug(slug);
  const title = slugToTitle(safeSlug);

  return {
    slug: safeSlug,
    layout: layoutRaw,
    acts,
    client: get('--client') ?? `${title} Holdings`,
    product: get('--product') ?? title.toUpperCase(),
    industry: get('--industry') ?? 'Business Software',
    tagline: get('--tagline') ?? `${title} interactive demo`,
    dryRun: args.includes('--dry-run'),
    yes: args.includes('--yes'),
  };
}

function sanitizeSlug(input: string): string {
  const value = input.trim().toLowerCase();
  if (!value) throw new Error('Missing required <slug>. Example: pnpm scaffold:demo skyline --layout focus');
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid slug '${input}'. Use lowercase letters, numbers, and hyphens only.`);
  }
  return value;
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ensureMissing(targetDir: string) {
  if (fs.existsSync(targetDir)) {
    throw new Error(`Target already exists: ${targetDir}`);
  }
}

function write(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function buildActs(slug: string, count: number, layout: LayoutKind): ActDef[] {
  return Array.from({ length: count }).map((_, idx) => {
    const index = idx + 1;
    const id = layout === 'wizard' ? `step-${index}` : `act-${index}`;
    const label = `Act ${index}`;
    const href = `/${slug}/${id}`;
    return {
      index,
      id,
      label,
      icon: 'LayoutDashboard',
      href,
    };
  });
}

function layoutTemplate(slug: string): string {
  return `'use client';

import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function ${slugToComponent(slug)}Layout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
`;
}

function rootPageTemplate(args: Args): string {
  return `export default function ${slugToComponent(args.slug)}Page() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-xl border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-6">
        <h1 className="text-2xl font-semibold text-[var(--sem-text-primary)]">${args.product}</h1>
        <p className="mt-2 text-sm text-[var(--sem-text-muted)]">${args.tagline}</p>
      </div>
    </div>
  );
}
`;
}

function actPageTemplate(args: Args, act: ActDef): string {
  return `export default function ${slugToComponent(args.slug)}${slugToComponent(act.id)}Page() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-xl border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--sem-text-muted)]">${act.label}</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--sem-text-primary)]">${args.product} — ${act.label} Starter</h1>
        <p className="mt-2 text-sm text-[var(--sem-text-muted)]">Replace this scaffold content with your ${act.label.toLowerCase()} workflow.</p>
      </div>
    </div>
  );
}
`;
}

function configTemplate(args: Args, acts: ActDef[]): string {
  const baseHeader = `import { defineDemo } from '@/components/shell';
import { Rocket } from 'lucide-react';

export default defineDemo({
  slug: '${args.slug}',
${args.layout !== 'sidebar' ? `  layout: '${args.layout}',\n` : ''}  client: {
    name: '${escapeQuote(args.client)}',
    tagline: '${escapeQuote(args.tagline)}',
    region: 'National',
    logo: Rocket,
  },
  product: {
    name: '${escapeQuote(args.product)}',
    badge: 'Interactive Demo',
  },
  theme: 'clean-light',
  colors: {
    primary: '#1E3A5F',
    accent: '#2563EB',
  },
`;

  const topnavFields = `  suite: {
    name: '${escapeQuote(args.product)} Suite',
    tagline: 'Revenue OS',
  },
  module: {
    code: '${moduleCode(args.product)}',
    name: '${escapeQuote(args.product)}',
    description: '${escapeQuote(args.tagline)}',
  },
  gradient: {
    start: '#2563EB',
    mid: '#7C3AED',
    end: '#06B6D4',
  },
`;

  const wizardFields = `  wizard: {
    steps: [
${acts.map((a) => `      { id: '${a.id}', label: '${a.label}', icon: '${a.icon}' },`).join('\n')}
    ],
    startInGuided: true,
    showStepNumbers: true,
  },
`;

  const navSections = acts.map((a) => `    {
      section: '${a.label}',
      items: [
        { label: '${a.label} Overview', href: '${a.href}', icon: '${a.icon}' },
      ],
    },`).join('\n');

  const navSidebarTopnav = `  nav: [
${navSections}
  ],
`;

  const navFocusWizard = `  nav: [],
`;

  const footerMeta = `  footer: {
    copyright: '© 2026 ${escapeQuote(args.client)}',
    poweredBy: 'AICR',
  },
  meta: {
    industry: '${escapeQuote(args.industry)}',
    tagline: '${escapeQuote(args.tagline)}',
    color: '#2563EB',
  },
});
`;

  const navBlock = args.layout === 'sidebar' || args.layout === 'topnav' ? navSidebarTopnav : navFocusWizard;

  return [
    baseHeader,
    args.layout === 'topnav' ? topnavFields : '',
    args.layout === 'wizard' ? wizardFields : '',
    navBlock,
    footerMeta,
  ].join('');
}

function readmeTemplate(args: Args): string {
  return `# ${args.product}\n\n- Slug: \`${args.slug}\`\n- Layout: \`${args.layout}\`\n- Acts: ${args.acts}\n- Industry: ${args.industry}\n\nScaffold generated by \`scripts/scaffold-demo.ts\`.\n`;
}

function moduleCode(product: string): string {
  const letters = product.replace(/[^A-Za-z]/g, '').toUpperCase();
  return (letters.slice(0, 3) || 'MOD').padEnd(3, 'X');
}

function slugToComponent(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeQuote(value: string): string {
  return value.replace(/'/g, "\\'");
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`scaffold-demo\n\nUsage:\n  pnpm scaffold:demo <slug> [--layout sidebar|topnav|wizard|focus]\n    [--acts <n>] [--client \"Client Name\"] [--product \"PRODUCT\"]\n    [--industry \"Industry\"] [--tagline \"Tagline\"] [--dry-run] [--yes]\n\nNotes:\n  - --acts defaults to 1\n  - --acts supports 1..12\n  - layout=focus supports only --acts 1\n  - --dry-run prints planned files without writing`);
    process.exit(0);
  }

  const args = parseArgs(process.argv);
  const targetDir = path.join(DEMOS_ROOT, args.slug);

  ensureMissing(targetDir);

  const acts = buildActs(args.slug, args.acts, args.layout);
  const plannedFiles = [
    path.join(targetDir, 'layout.tsx'),
    path.join(targetDir, 'page.tsx'),
    path.join(targetDir, 'demo.config.ts'),
    path.join(targetDir, 'README.md'),
    ...acts.map((act) => path.join(targetDir, act.id, 'page.tsx')),
  ];

  if (args.dryRun) {
    console.log(`✓ Dry run: would scaffold demo '${args.slug}' (${args.layout}, acts=${args.acts})`);
    for (const file of plannedFiles) {
      console.log(`  - ${path.relative(process.cwd(), file)}`);
    }
    process.exit(0);
  }

  write(path.join(targetDir, 'layout.tsx'), layoutTemplate(args.slug));
  write(path.join(targetDir, 'page.tsx'), rootPageTemplate(args));

  for (const act of acts) {
    write(path.join(targetDir, act.id, 'page.tsx'), actPageTemplate(args, act));
  }

  write(path.join(targetDir, 'demo.config.ts'), configTemplate(args, acts));
  write(path.join(targetDir, 'README.md'), readmeTemplate(args));

  console.log(`✓ Scaffolded demo '${args.slug}' (${args.layout}, acts=${args.acts}) at ${path.relative(process.cwd(), targetDir)}`);
  console.log('Next steps:');
  console.log(`  1. pnpm generate:registry`);
  console.log(`  2. pnpm typecheck`);
  console.log(`  3. pnpm verify`);
}

main();
