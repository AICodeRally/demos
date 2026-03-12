import manifest from '../../../../data/services-manifest.json';
import { ServiceDetailClient } from './ServiceDetailClient';

export function generateStaticParams() {
  return manifest.services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}
