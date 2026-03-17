'use client';

import * as LucideIcons from 'lucide-react';

const iconCache = new Map<string, LucideIcons.LucideIcon>();

export function resolveIcon(name: string): LucideIcons.LucideIcon {
  if (iconCache.has(name)) return iconCache.get(name)!;
  const icon = (LucideIcons as Record<string, unknown>)[name] as LucideIcons.LucideIcon | undefined;
  const resolved = icon ?? LucideIcons.Circle;
  iconCache.set(name, resolved);
  return resolved;
}

export function Icon({ name, ...props }: { name: string } & LucideIcons.LucideProps) {
  const Comp = resolveIcon(name);
  return <Comp {...props} />;
}
