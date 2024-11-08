import InsightsPage from "@/features/insights/components/page";

export default async function Insights({
  params,
}: {
  params: { monthYear: string };
}) {
  return <InsightsPage monthYear={params.monthYear} />;
}
