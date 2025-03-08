import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  dayOfWeek: string;
  dayOfMonth: string;
  formattedDate: string;
  isToday: boolean;
  isFutureDate: boolean;
  dreamCount: number;
  heatmapStyle: string;
}

export function CalendarDay({
  dayOfWeek,
  dayOfMonth,
  formattedDate,
  isToday,
  isFutureDate,
  dreamCount,
  heatmapStyle,
}: CalendarDayProps) {
  const ButtonContent = (
    <>
      <span className="text-xs text-muted-foreground">{dayOfWeek}</span>
      <span className="text-xl font-medium">{dayOfMonth}</span>
    </>
  );

  if (isFutureDate) {
    return (
      <Button
        variant="outline"
        disabled
        className="h-auto flex-col items-center justify-center space-y-2 hover:cursor-not-allowed"
      >
        {ButtonContent}
      </Button>
    );
  }

  if (!dreamCount) {
    return (
      <Button
        variant="outline"
        disabled
        className="h-auto flex-col items-center justify-center space-y-2 opacity-50"
      >
        {ButtonContent}
      </Button>
    );
  }

  return (
    <Button
      variant={isToday ? "default" : "outline"}
      asChild
      className={cn(
        "group h-auto flex-col items-center justify-center space-y-2 hover:bg-accent",
        heatmapStyle
      )}
    >
      <Link href={`/dreams/${formattedDate}`}>{ButtonContent}</Link>
    </Button>
  );
}
