import { DemoNav } from '@/components/swic/summit-sleep/DemoNav';

export default function SummitSleepLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoNav />
      {children}
    </>
  );
}
