import type { RallySession, ForgeSpec } from './types';
import { computeWeightedScore } from './store';

export function deriveForgeSpec(session: RallySession, demoName: string): ForgeSpec {
  const { context, decisions, workboard } = session;

  // Build priorities from workboard, linking back to decisions
  function buildPriority(priority: 'P0' | 'P1' | 'P2') {
    return workboard.tasks
      .filter(t => t.priority === priority)
      .map(t => {
        const linked = t.linkedDecisionId
          ? decisions.items.find(d => d.id === t.linkedDecisionId)
          : undefined;
        return {
          title: t.title,
          rationale: t.rationale ?? linked?.text ?? '',
          linkedDecisions: linked ? [linked.text] : [],
        };
      });
  }

  return {
    version: '1.0',
    generated: new Date().toISOString(),
    demo: { slug: session.slug, name: demoName },

    identity: {
      projectName: context.identity.projectName,
      brandColor: context.identity.brandColor,
      tagline: context.identity.tagline,
    },

    team: context.org.map(m => ({
      name: m.name,
      title: m.title,
      company: m.company,
      role: m.role,
      weight: m.weight,
    })),

    personas: context.personas.map(p => ({
      name: p.name,
      role: p.role,
      painPoints: p.painPoints,
      goals: p.goals,
    })),

    priorities: {
      p0: buildPriority('P0'),
      p1: buildPriority('P1'),
      p2: buildPriority('P2'),
    },

    decisions: decisions.items.map(d => ({
      text: d.text,
      status: d.status,
      weightedScore: computeWeightedScore(d, context.org),
      voters: d.votes.map(v => {
        const member = context.org.find(m => m.id === v.memberId);
        return { name: member?.name ?? 'Unknown', vote: v.value };
      }),
    })),

    roadmap: context.roadmap.map(r => ({
      phase: r.phase,
      modules: r.modules,
      timeline: r.timeline,
    })),

    backlog: workboard.tasks.map(t => ({
      title: t.title,
      priority: t.priority,
      status: t.status,
    })),
  };
}

export function forgeSpecToMarkdown(spec: ForgeSpec): string {
  const lines: string[] = [
    `# ${spec.demo.name} — Forge Spec`,
    `> Generated: ${spec.generated}`,
    '',
    '## Identity',
    `- **Project:** ${spec.identity.projectName}`,
    spec.identity.tagline ? `- **Tagline:** ${spec.identity.tagline}` : '',
    spec.identity.brandColor ? `- **Brand Color:** ${spec.identity.brandColor}` : '',
    '',
    '## Team',
    ...spec.team.map(m => `- **${m.name}** — ${m.title}, ${m.company} (${m.role}, weight: ${m.weight})`),
    '',
    '## Personas',
    ...spec.personas.flatMap(p => [
      `### ${p.name} (${p.role})`,
      `**Pain Points:** ${p.painPoints.join(', ')}`,
      `**Goals:** ${p.goals.join(', ')}`,
      '',
    ]),
    '## Priorities',
    '',
    '### P0 — Must Have',
    ...spec.priorities.p0.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '### P1 — Should Have',
    ...spec.priorities.p1.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '### P2 — Nice to Have',
    ...spec.priorities.p2.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '## Decisions',
    ...spec.decisions.map(d => `- [${d.status}] (score: ${d.weightedScore}) ${d.text}`),
    '',
    '## Roadmap',
    ...spec.roadmap.map(r => `- **${r.phase}:** ${r.modules.join(', ')}${r.timeline ? ` (${r.timeline})` : ''}`),
  ];
  return lines.filter(l => l !== undefined).join('\n');
}
