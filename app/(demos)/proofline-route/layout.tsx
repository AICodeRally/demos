import type { Metadata } from 'next';
import '@/styles/ext/proofline-route.css';

export const metadata: Metadata = {
  title: 'PROOFLINE Route Commission — Lone Star Spirits',
  description: 'Real-time route commission demo: 8-stop Dallas delivery with AI upsell suggestions and commission what-if calculations.',
};

export default function ProoflineRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
