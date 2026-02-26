import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Day Of — Support Console',
  description: 'Internal support console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
