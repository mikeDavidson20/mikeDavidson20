import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mike's Screener",
  description: "Stock and options screener with buy/sell signals and market news"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <h1>Mike&apos;s Screener</h1>
            <nav>
              <Link href="/">Screener</Link>
              <Link href="/news">Market News</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
