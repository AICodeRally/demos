import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'PROOFLINE Route Commission — Lone Star Spirits',
  description: 'Real-time route commission demo: 8-stop Dallas delivery with AI upsell suggestions and commission what-if calculations.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PROOFLINE',
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function ProoflineRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
