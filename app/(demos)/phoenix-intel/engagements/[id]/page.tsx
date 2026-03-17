import { ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import EngagementDetailClient from './client';

export function generateStaticParams() {
  return ENGAGEMENTS.map((eng) => ({ id: eng.id }));
}

export default function EngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <EngagementDetailClient params={params} />;
}
