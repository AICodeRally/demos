import { SELLERS } from '@/data/proofline';
import RepDetailClient from './client';

export function generateStaticParams() {
  return SELLERS.map((seller) => ({ id: seller.id }));
}

export default function RepDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <RepDetailClient params={params} />;
}
