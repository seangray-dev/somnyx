import DashboardHeader from "@/components/layout/tabs/dashboard-header";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      {children}
    </div>
  );
}
