import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Viewport settings for mobile responsiveness and theme color
export const viewport: Viewport = {
  themeColor: "#1E2124",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Industrial Standard SEO & Social Metadata
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: "Bet9ja Tips | Get Sure Odds Daily",
    template: "%s | Bet9ja Tips",
  },
  description: "Get 100% sure odds, winning tickets, and expert predictions for Bet9ja users. Unlock daily coupon codes and start winning.",
  keywords: ["Bet9ja", "Betting Tips", "Sure Odds", "Coupon Codes", "Bet9ja Booking Code", "Nigeria Betting", "Sports Betting", "Winning Tickets"],
  authors: [{ name: "Bet9ja Tips" }],
  creator: "Bet9ja Tips",
  publisher: "Bet9ja Tips",
  
  // Base URL for resolving absolute image paths
  metadataBase: new URL("https://bet9jatips.vercel.app"),

  // 3. Icons (Favicon & Apple Touch)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ICO",
    apple: "/apple-touch-icon.PNG",
  },

  // 4. Open Graph (Facebook, WhatsApp, LinkedIn, Telegram)
  openGraph: {
    title: "Bet9ja Tips | Get Sure Odds Daily",
    description: "Unlock today's verified Bet9ja coupon codes. 100% sure odds and winning tickets.",
    url: "https://bet9jatips.vercel.app",
    siteName: "Bet9ja Tips",
    images: [
      {
        url: "/og-image.JPG", // Make sure this is in your public folder
        width: 1200,
        height: 630,
        alt: "Bet9ja Tips - Get Sure Odds Daily",
        type: "image/jpeg",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  // 5. Twitter Cards (X)
  twitter: {
    card: "summary_large_image",
    title: "Bet9ja Tips | Get Sure Odds Daily",
    description: "Unlock today's verified Bet9ja coupon codes and start winning.",
    images: ["/og-image.JPG"],
    creator: "@yourtwitterhandle", // Update this if you have a Twitter account
  },

  // 6. Robots (Allow search engines to index)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-bg-deep text-text-primary min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
