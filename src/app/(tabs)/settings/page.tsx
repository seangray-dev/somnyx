import { Metadata } from "next";

import Account from "@/components/settings/account";
import BillingHistory from "@/components/settings/billing-history";
import DeleteActions from "@/components/settings/delete-actions";
import NotificationsSection from "@/components/settings/notifications-section";
import ThemeSection from "@/components/settings/theme-section";
import { SEO } from "@/config/app";
import CookieSettingsSection from "@/features/cookie-consent/components/cookie-settings-section";
import EmailSection from "@/features/email-preferences/components/email-section";
import { NotificationTester } from "@/features/notifications/components/notification-tester";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Account />
      <h1 className="container text-2xl font-bold sm:text-3xl">Settings</h1>
      <div className="container space-y-6">
        <ThemeSection />
        <NotificationsSection />
        <EmailSection />
        <CookieSettingsSection />
        <BillingHistory />
        <DeleteActions />
        <NotificationTester />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.settings.title,
    description: SEO.pages.settings.description,
    openGraph: {
      title: SEO.pages.settings.title,
      description: SEO.pages.settings.description,
    },
    twitter: {
      title: SEO.pages.settings.title,
      description: SEO.pages.settings.description,
    },
  };
}
