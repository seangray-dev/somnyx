import { Metadata } from "next";

import { SEO } from "@/config/app";
import InsightsPage from "@/features/insights/components/page";

export default async function Insights({
  params,
}: {
  params: { monthYear: string };
}) {
  return <InsightsPage monthYear={params.monthYear} />;
}

export async function generateMetadata({
  params,
}: {
  params: { monthYear: string };
}): Promise<Metadata> {
  const month = params.monthYear.split("-")[0];
  const year = params.monthYear.split("-")[1];
  const monthName = new Date(
    parseInt(year),
    parseInt(month) - 1,
    1
  ).toLocaleString("default", {
    month: "long",
  });

  return {
    title: `${SEO.pages.insights.title} - ${monthName} ${year}`,
    description: SEO.pages.insights.description,
    openGraph: {
      title: `${SEO.pages.insights.title} - ${monthName} ${year}`,
      description: SEO.pages.insights.description,
    },
    twitter: {
      title: `${SEO.pages.insights.title} - ${monthName} ${year}`,
      description: SEO.pages.insights.description,
    },
  };
}
