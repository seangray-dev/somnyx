import { ThemeProvider } from "next-themes";

import AnalyticsProvider from "@/features/_analytics/providers/analytics-provider";

import { ThemePagesProvider } from "./theme-pages-provider";
import { TimezoneProvider } from "./timezone-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AnalyticsProvider>{children}</AnalyticsProvider>
      <TimezoneProvider />
      <ThemePagesProvider />
    </ThemeProvider>
  );
}
