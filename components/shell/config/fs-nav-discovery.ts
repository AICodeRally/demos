import * as fs from 'fs';
import * as path from 'path';
import type { NavSection } from './types';

const ICON_MAP: Record<string, string> = {
  dashboard: 'LayoutDashboard',
  overview: 'Building2',
  settings: 'Settings',
  team: 'Users',
  users: 'Users',
  chart: 'BarChart3',
  analytics: 'BarChart3',
  calendar: 'Calendar',
  map: 'Map',
  target: 'Target',
};

function resolveIcon(dirName: string): string {
  const lower = dirName.toLowerCase();
  for (const [keyword, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return 'Circle';
}

function stripNumericPrefix(name: string): string {
  return name.replace(/^\d+-/, '');
}

function toLabel(dirName: string): string {
  return stripNumericPrefix(dirName)
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isValidSegment(segment: string): boolean {
  // Only allow alphanumeric, hyphens, underscores, and numeric prefixes
  // Explicitly reject .. and path separators
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
    return false;
  }
  return /^[\d\-_a-zA-Z()]+$/.test(segment);
}

export function discoverNav(slug: string): NavSection[] {
  // Validate slug before using it in path operations
  if (!isValidSegment(slug)) return [];

  const baseDir = process.cwd();
  // ruleid: path-traversal-guard - slug validated via isValidSegment()
  // nosemgrep: CWE-22
  const demosDir = path.normalize(path.join(baseDir, 'app', '(demos)', slug));

  // Ensure resolved path stays within base directory
  const normalizedBase = path.normalize(baseDir);
  if (!demosDir.startsWith(normalizedBase)) return [];

  if (!fs.existsSync(demosDir)) return [];

  const sections: NavSection[] = [];
  let topDirs: string[] = [];

  try {
    topDirs = fs.readdirSync(demosDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch {
    return [];
  }

  for (const sectionDir of topDirs) {
    // Validate directory names before using in paths
    if (!isValidSegment(sectionDir)) continue;

    // nosemgrep: CWE-22 - sectionDir validated via isValidSegment()
    const sectionPath = path.normalize(path.join(demosDir, sectionDir));
    if (!sectionPath.startsWith(demosDir)) continue;

    const items: NavSection['items'] = [];
    // nosemgrep: CWE-22 - sectionPath is validated, 'page.tsx' is constant
    const pageFile = path.normalize(path.join(sectionPath, 'page.tsx'));

    if (pageFile.startsWith(sectionPath) && fs.existsSync(pageFile)) {
      items.push({
        label: toLabel(sectionDir),
        href: `/${slug}/${sectionDir}`,
        icon: resolveIcon(sectionDir),
      });
    }

    let subDirs: string[] = [];
    try {
      subDirs = fs.readdirSync(sectionPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();
    } catch {
      subDirs = [];
    }

    for (const itemDir of subDirs) {
      // Validate subdirectory names before using in paths
      if (!isValidSegment(itemDir)) continue;

      // nosemgrep: CWE-22 - itemDir validated via isValidSegment()
      const itemPath = path.normalize(path.join(sectionPath, itemDir));
      if (!itemPath.startsWith(sectionPath)) continue;

      // nosemgrep: CWE-22 - itemPath is validated, 'page.tsx' is constant
      const itemPageFile = path.normalize(path.join(itemPath, 'page.tsx'));
      if (itemPageFile.startsWith(itemPath) && fs.existsSync(itemPageFile)) {
        items.push({
          label: toLabel(itemDir),
          href: `/${slug}/${sectionDir}/${itemDir}`,
          icon: resolveIcon(itemDir),
        });
      }
    }

    if (items.length > 0) {
      sections.push({ section: toLabel(sectionDir), items });
    }
  }

  return sections;
}
