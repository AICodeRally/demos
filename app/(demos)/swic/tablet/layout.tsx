import { DemoNav } from '@/components/swic/tablet/DemoNav';

export default function SummitSleepCoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoNav />
      {children}
    </>
  );
}
