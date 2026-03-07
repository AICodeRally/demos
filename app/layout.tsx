import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AICR Demo Platform',
  description: 'Unified product demos from AI Code Rally',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
