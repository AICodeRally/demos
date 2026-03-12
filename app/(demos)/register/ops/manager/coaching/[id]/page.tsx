import { REPS } from '@/data/register/coaching-data';
import RepCoachingClient from './client';

export function generateStaticParams() {
  return REPS.map((rep) => ({ id: rep.id }));
}

export default function RepCoachingPage({ params }: { params: Promise<{ id: string }> }) {
  return <RepCoachingClient params={params} />;
}
