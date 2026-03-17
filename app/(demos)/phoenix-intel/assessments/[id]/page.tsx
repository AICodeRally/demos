import { ASSESSMENT_RESULTS } from '@/data/phoenix-intel/assessment-data';
import AssessmentDetailClient from './client';

export function generateStaticParams() {
  return ASSESSMENT_RESULTS.map((result) => ({ id: result.id }));
}

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AssessmentDetailClient params={params} />;
}
