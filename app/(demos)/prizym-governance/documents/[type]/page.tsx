import { notFound } from 'next/navigation';
import { DocumentsLibrary, URL_TO_TYPE } from './DocumentsLibrary';

export function generateStaticParams() {
  return Object.keys(URL_TO_TYPE).map((type) => ({ type }));
}

export default async function DocumentsByTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!(type in URL_TO_TYPE)) return notFound();
  return <DocumentsLibrary typeSlug={type} />;
}
