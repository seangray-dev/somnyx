import Tabs from "@/components/layout/tabs";
import DashboardHeader from "@/components/layout/tabs/dashboard-header";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 pb-28 pt-6">{children}</div>
      <Tabs />
    </div>
  );
}
