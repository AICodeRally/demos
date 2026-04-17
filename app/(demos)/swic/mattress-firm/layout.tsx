import { DemoNav } from '@/components/swic/mattress-firm/DemoNav';

export default function SummitSleepCoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoNav />
      {children}
    </>
  );
}
