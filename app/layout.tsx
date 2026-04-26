import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PropEdge | NBA Props + EV Analytics',
  description: 'SaaS dashboard for NBA player props, odds comparison, EV, and bet tracking.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
          <Link href="/" style={{ fontWeight: 700 }}>PropEdge</Link>
          <nav style={{ display: 'flex', gap: '.9rem' }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/account">Account</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
