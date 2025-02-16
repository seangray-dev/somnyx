import type { Metadata, Viewport } from "next";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { SEO, applicationName, baseUrl } from "@/config/app";
import { lora, openSans } from "@/fonts";
import { ContextProvider } from "@/providers/context-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "../styles/globals.css";
import PWA from "./pwa";

export const metadata: Metadata = {
  title: {
    default: SEO.default.title,
    template: "%s | Somnyx",
  },
  description: SEO.default.description,
  keywords: SEO.default.keywords,
  metadataBase: new URL(baseUrl),
  // authors: [{ name: "Somnyx" }],
  // creator: "Somnyx",
  // publisher: "Somnyx",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: applicationName,
    title: {
      default: SEO.default.title,
      template: "%s | Somnyx",
    },
    description: SEO.default.description,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: SEO.default.title,
      template: "%s | Somnyx",
    },
    description: SEO.default.description,
    // creator: "@somnyx",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContextProvider>
      <html lang="en" className={`${lora.variable} ${openSans.variable}`}>
        <body className="flex min-h-screen flex-col antialiased">
          <ThemeProvider attribute="class" defaultTheme="system">
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
            <Toaster richColors position="top-center" duration={5000} />
          </ThemeProvider>
          <PWA />
        </body>
      </html>
    </ContextProvider>
  );
}
