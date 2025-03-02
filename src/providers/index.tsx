import { ThemeProvider } from "next-themes";

import { PostHogProvider } from "./posthog-provider";
import { ThemePagesProvider } from "./theme-pages-provider";
import { TimezoneProvider } from "./timezone-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <PostHogProvider>{children}</PostHogProvider>
      <TimezoneProvider />
      <ThemePagesProvider />
    </ThemeProvider>
  );
}
