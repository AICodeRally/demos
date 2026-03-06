import { HOMETOWNS } from '@/data/proofline';
import HometownDetailClient from './client';

export function generateStaticParams() {
  return HOMETOWNS.map((h) => ({ hometown: h.id }));
}

export default function HometownDetailPage({ params }: { params: Promise<{ hometown: string }> }) {
  return <HometownDetailClient params={params} />;
}
