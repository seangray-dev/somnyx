import type { Metadata, Viewport } from "next";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { lora, openSans } from "@/fonts";
import { ContextProvider } from "@/providers/context-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "../styles/globals.css";
import PWA from "./pwa";

export const metadata: Metadata = {
  title: "Somnyx",
  description: "Somnyx is a platform for exploring and analyzing dreams.",
};

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on Safari mobile
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
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
