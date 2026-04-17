import { redirect } from 'next/navigation';

export default function DemoPage() {
  redirect('/swic/simulator?client=tablet');
}
