import { format, isLastDayOfMonth, subMonths } from "date-fns";

import InsightsCard from "./insights-card";
import InsightsForm from "./insights-form";

export default function Insights() {
  const today = new Date();

  const showCurrentMonth = isLastDayOfMonth(today);

  const totalMonths = 6;

  const monthsToDisplay = Array.from({ length: totalMonths }, (_, index) => {
    const monthsToSubtract = showCurrentMonth ? index : index + 1;
    return format(subMonths(new Date(today), monthsToSubtract), "MM-yyyy");
  });

  return (
    <div className="container flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-2xl">Insights</h2>
        <InsightsForm />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {monthsToDisplay.map((monthYear) => (
          <InsightsCard key={monthYear} monthYear={monthYear} />
        ))}
      </div>
    </div>
  );
}
