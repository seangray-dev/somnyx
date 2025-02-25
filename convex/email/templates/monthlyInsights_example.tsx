import * as React from "react";

import { Hr } from "@react-email/components";

import { BASE_URL } from "../util";
import BaseEmailTemplate, {
  DefaultFooter,
  EmailButton,
  EmailHeading,
  EmailSection,
  EmailText,
} from "./baseTemplate";

interface MonthlyInsightsEmailProps {
  name?: string;
  month: string;
  monthNumber: string;
  year: number;
  stats: {
    totalDreams: number;
    streakDays: number;
  };
}

// Example usage for preview
const exampleData: MonthlyInsightsEmailProps = {
  name: "Sarah",
  month: "March",
  monthNumber: "03",
  year: 2024,
  stats: {
    totalDreams: 15,
    streakDays: 7,
  },
};

export const getPlainText = ({
  name,
  month,
  monthNumber,
  year,
  stats,
}: MonthlyInsightsEmailProps) => `Your ${month} ${year} Dream Insights Are Ready!

Hey${name ? ` ${name}` : ""}!

Your monthly dream insights for ${month} ${year} are ready to explore.

Monthly Overview:
- You recorded ${stats.totalDreams} dreams
- Your longest dream journaling streak: ${stats.streakDays} days

View your full insights:
${BASE_URL}/insights/${monthNumber}-${year}

Sweet dreams,
The Somnyx Team

Need help? Visit support (${BASE_URL}/support) or contact us (${BASE_URL}/contact)
Manage email preferences: ${BASE_URL}/settings`;

export default function MonthlyInsightsEmail({
  name = exampleData.name,
  month = exampleData.month,
  year = exampleData.year,
  stats = exampleData.stats,
  monthNumber = exampleData.monthNumber,
}: MonthlyInsightsEmailProps) {
  return (
    <BaseEmailTemplate
      previewText={`Your ${month} ${year} dream insights are ready to explore!`}
      footerContent={<DefaultFooter />}
    >
      <EmailHeading>Your Monthly Dream Journey</EmailHeading>

      <EmailText className="text-center">
        Hey{name ? ` ${name}` : ""}! Your dream insights for {month} {year} are
        ready to explore. Here's a quick overview of your dream journey:
      </EmailText>

      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />

      <EmailSection>
        <div className="space-y-4 rounded-lg bg-gray-50 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.totalDreams}</div>
            <div className="text-sm text-gray-600">Dreams Recorded</div>
          </div>

          {stats.streakDays > 0 && (
            <div className="text-center mt-4">
              <div className="text-xl font-semibold">
                {stats.streakDays} day{stats.streakDays !== 1 ? "s" : ""}
              </div>
              <div className="text-sm text-gray-600">
                Longest Journaling Streak
              </div>
            </div>
          )}
        </div>
      </EmailSection>

      <div className="mt-6 text-center">
        <EmailButton href={`${BASE_URL}/insights/${monthNumber}-${year}`}>
          View Full Insights →
        </EmailButton>
      </div>

      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />
    </BaseEmailTemplate>
  );
}
