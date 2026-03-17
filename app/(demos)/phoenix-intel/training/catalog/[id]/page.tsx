import { COURSES } from '@/data/phoenix-intel/training-data';
import CourseDetailClient from './client';

export function generateStaticParams() {
  return COURSES.map((course) => ({ id: course.id }));
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CourseDetailClient params={params} />;
}
