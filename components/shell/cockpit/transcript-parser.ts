import type { CaptureItem, CaptureTag } from './types';

const TAG_PATTERNS: [RegExp, CaptureTag][] = [
  [/\b(problem|issue|broken|frustrat|pain|struggle|difficult|fail)/i, 'pain-point'],
  [/\b(decided|agreed|go with|we'll use|chosen|settled on)/i, 'decision'],
  [/\b(should|need to|must|let's|action item|todo|follow.?up)/i, 'action-item'],
  [/\?\s*$/, 'question'],
];

function detectTags(text: string): CaptureTag[] {
  const tags = new Set<CaptureTag>();
  for (const [pattern, tag] of TAG_PATTERNS) {
    if (pattern.test(text)) tags.add(tag);
  }
  if (tags.size === 0) tags.add('insight');
  return Array.from(tags);
}

export function parseTranscript(rawText: string): CaptureItem[] {
  // Split on double newlines or speaker turn patterns like "Speaker Name:"
  const blocks = rawText
    .split(/\n{2,}|\n(?=[A-Z][a-z]+ [A-Z][a-z]+:)/)
    .map(b => b.trim())
    .filter(b => b.length > 10); // skip tiny fragments

  const now = new Date().toISOString();

  return blocks.map((block) => {
    // Extract speaker if line starts with "Name:"
    let author: string | undefined;
    let text = block;
    const speakerMatch = block.match(/^([A-Z][a-z]+ [A-Z][a-z]+):\s*/);
    if (speakerMatch) {
      author = speakerMatch[1];
      text = block.slice(speakerMatch[0].length);
    }

    return {
      id: crypto.randomUUID(),
      text: text.trim(),
      author,
      tags: detectTags(text),
      timestamp: now,
      source: 'transcript-parse' as const,
    };
  });
}
