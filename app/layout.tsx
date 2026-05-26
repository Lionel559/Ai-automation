import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AuthSessionProvider } from "@/components/auth/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  absoluteUrl,
  ogImagePath,
  siteDescription,
  siteKeywords,
  siteTitle,
  siteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | AIFLOW",
  },
  description: siteDescription,
  metadataBase: siteUrl,
  keywords: siteKeywords,
  authors: [{ name: "AIFLOW" }],
  creator: "AIFLOW",
  applicationName: "AIFLOW",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: absoluteUrl("/"),
    siteName: "AIFLOW",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: "AIFLOW AI automation platform for small businesses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <AuthSessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
