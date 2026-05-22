import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Shorten Anything — Fast, Clean URL Shortener",
    template: "%s | Shorten Anything",
  },
  description:
    "A fast, minimal URL shortener. Create short links with custom aliases, expiration dates, and click analytics.",
  keywords: ["url shortener", "short link", "link shortener", "custom alias"],
  authors: [{ name: "Shorten Anything" }],
  creator: "Shorten Anything",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Shorten Anything",
    title: "Shorten Anything — Fast, Clean URL Shortener",
    description:
      "Create short links with custom aliases, expiration dates, and click analytics.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Shorten Anything — URL Shortener",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shorten Anything — Fast, Clean URL Shortener",
    description:
      "Create short links with custom aliases, expiration dates, and click analytics.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
