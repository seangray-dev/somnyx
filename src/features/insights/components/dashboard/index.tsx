"use client";

import { useState } from "react";

import { isLastDayOfMonth } from "date-fns";

import { Button } from "@/components/ui/button";

import useAvailableMonths from "../../api/use-available-months";
import CurrentMonthInsightsPrompt from "./current-month-insights-prompt";
import InsightsCard from "./insights-card";

const INITIAL_MONTHS = 6;
const MONTHS_PER_LOAD = 3;
const MAX_MONTHS = 24;

export default function Insights() {
  const [totalMonths, setTotalMonths] = useState(INITIAL_MONTHS);
  const today = new Date();
  const showCurrentMonth = isLastDayOfMonth(today);

  const { data: availableMonths, isLoading } = useAvailableMonths();

  const monthsToDisplay = availableMonths?.slice(0, totalMonths) ?? [];
  const hasMoreMonths = availableMonths
    ? totalMonths < Math.min(availableMonths.length, MAX_MONTHS)
    : false;

  const handleLoadMore = () => {
    setTotalMonths((prev) => Math.min(prev + MONTHS_PER_LOAD, MAX_MONTHS));
  };

  return (
    <div className="container flex-1 space-y-6">
      <h2 className="text-3xl font-bold">Insights</h2>
      {!showCurrentMonth && <CurrentMonthInsightsPrompt />}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {monthsToDisplay.map((monthYear) => (
          <InsightsCard key={monthYear} monthYear={monthYear} />
        ))}
      </div>
      {hasMoreMonths && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            Load more insights
          </Button>
        </div>
      )}
    </div>
  );
}
