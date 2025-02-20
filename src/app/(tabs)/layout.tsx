import { Metadata } from "next";

import Tabs from "@/components/layout/tabs";
import DashboardHeader from "@/components/layout/tabs/dashboard-header";
import Stats from "@/features/stats/components";
import InstallPrompt from "@/features/notifications/components/install-prompt";

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: false, // Protect authenticated routes from indexing
      follow: false,
      nocache: true,
    },
    // Additional security headers for authenticated routes
    other: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  };
}

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <InstallPrompt />
      <DashboardHeader />
      <Stats />
      <div className="flex flex-1 flex-col pb-28 pt-8">{children}</div>
      <Tabs />
    </div>
  );
}
