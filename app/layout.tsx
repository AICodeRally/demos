import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

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
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="antialiased" style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
