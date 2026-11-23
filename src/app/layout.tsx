import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bet9ja Tips | Get Sure Odds Daily",
  description: "Get 100% sure odds, winning tickets, and expert predictions for Bet9ja users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-deep text-text-primary">
        {children}
      </body>
    </html>
  );
}
