import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

function resolveMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL;

  if (siteUrl) {
    try {
      return new URL(siteUrl);
    } catch {
      // Ignore and fallback below.
    }
  }

  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`);
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "TABLE NOVEL | ストーリーで巡る、心の地図",
  description: "地元の名店で生まれた思い出を、ショートストーリーで共有するサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="d6036cc9-ec62-4d35-a429-9dc7438c90c9"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
