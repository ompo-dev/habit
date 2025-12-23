import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { BottomNavigation } from "@/components/organisms/bottom-navigation";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Builder - Construa Hábitos Sólidos",
  description:
    "Transforme pequenas tarefas diárias em hábitos sólidos com tracking visual e gamificação",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  // Otimizações de performance
  other: {
    "dns-prefetch": "on",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366F1",
  // Meta tags adicionais para iOS PWA
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Preconnect para melhorar performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Meta tags para PWA no iOS - Essenciais para instalação */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Habits" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Apple Touch Icons - iOS requer ícone de 180x180px */}
        <link
          rel="apple-touch-icon"
          href="/apple-icon-180.png"
          sizes="180x180"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
      </head>
      <body className={`font-sans antialiased min-h-screen`}>
        <NuqsAdapter>
          {children}
          <Suspense fallback={null}>
            <BottomNavigation />
          </Suspense>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
