import Tabs from "@/components/layout/tabs";
import DashboardHeader from "@/components/layout/tabs/dashboard-header";
import Stats from "@/features/stats/components";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <Stats />
      <div className="flex flex-1 flex-col pb-28 pt-6">{children}</div>
      <Tabs />
    </div>
  );
}
