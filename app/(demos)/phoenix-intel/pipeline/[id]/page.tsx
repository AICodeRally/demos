import { DEALS } from '@/data/phoenix-intel/nonprofit-data';
import DealDetailClient from './client';

export function generateStaticParams() {
  return DEALS.map((deal) => ({ id: deal.id }));
}

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DealDetailClient params={params} />;
}
