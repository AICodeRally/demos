import { notFound } from 'next/navigation';
import { DocumentsLibrary } from './DocumentsLibrary';

const VALID_TYPES = ['comp-plans', 'policies', 'procedures', 'controls', 'templates'] as const;

export function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export const dynamicParams = false;

export default async function DocumentsByTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!(VALID_TYPES as readonly string[]).includes(type)) return notFound();
  return <DocumentsLibrary typeSlug={type} />;
}
