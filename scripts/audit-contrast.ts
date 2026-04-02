/**
 * Audit all theme presets for WCAG contrast compliance.
 * Run: npx tsx scripts/audit-contrast.ts
 * Flags: --json for structured output, --help for usage
 */
import { PRESETS } from '../components/shell/theme/presets';
import { validateSemanticContrast, validateComponentContrast } from '../components/shell/theme/contrast';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: npx tsx scripts/audit-contrast.ts [--json]');
  console.log('  Audits all theme presets for WCAG 2.1 AA contrast compliance.');
  console.log('  --json   Output structured JSON');
  process.exit(0);
}
const jsonMode = args.includes('--json');

interface PresetResult {
  preset: string;
  mode: string;
  failures: { pair: string; ratio: number; required: number }[];
  totalChecks: number;
}

const results: PresetResult[] = [];
let totalFailures = 0;

for (const [name, preset] of Object.entries(PRESETS)) {
  for (const mode of ['dark', 'light'] as const) {
    const sem = preset.semantic[mode];
    const comp = preset.component[mode];

    const semChecks = validateSemanticContrast(sem);
    const compChecks = validateComponentContrast(comp, { textPrimary: sem.textPrimary });
    const allChecks = [...semChecks, ...compChecks];
    const failures = allChecks.filter(c => !c.pass);

    results.push({
      preset: name,
      mode,
      failures: failures.map(f => ({ pair: f.pair, ratio: f.ratio, required: f.required })),
      totalChecks: allChecks.length,
    });

    totalFailures += failures.length;
  }
}

if (jsonMode) {
  console.log(JSON.stringify({ results, totalFailures }, null, 2));
  process.exit(totalFailures > 0 ? 1 : 0);
}

// Human-readable output
for (const r of results) {
  const status = r.failures.length === 0 ? '✅' : '❌';
  console.log(`\n${status} ${r.preset} (${r.mode}) — ${r.failures.length}/${r.totalChecks} failures`);
  for (const f of r.failures) {
    console.log(`   ❌ ${f.pair}: ${f.ratio}:1 (need ${f.required}:1)`);
  }
}

console.log(`\n${totalFailures === 0 ? '✅ All presets pass' : `❌ ${totalFailures} total failures`}`);
process.exit(totalFailures > 0 ? 1 : 0);
