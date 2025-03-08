import { useQuery } from "convex/react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";

import { api } from "@/convex/_generated/api";

export const useDreamCalendar = () => {
  const today = startOfDay(new Date());

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      date,
      monthStart: startOfMonth(date),
      monthEnd: endOfMonth(date),
      formattedTitle: format(date, "MMMM yyyy"),
      year: format(date, "yyyy"),
      month: format(date, "MM"),
    };
  });

  const monthsWithDreams = months.map((month) => {
    const days = eachDayOfInterval({
      start: month.monthStart,
      end: month.monthEnd,
    });

    const dreamCounts =
      useQuery(api.queries.dreams.getDreamCountsByMonth, {
        year: month.year,
        month: month.month,
      }) || {};

    return {
      ...month,
      days: days.map((day) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        return {
          date: day,
          formattedDate,
          dayOfMonth: format(day, "d"),
          dayOfWeek: format(day, "EEE"),
          isToday: format(today, "yyyy-MM-dd") === formattedDate,
          isFutureDate: isAfter(day, today),
          dreamCount: dreamCounts[formattedDate] || 0,
        };
      }),
    };
  });

  const getHeatmapStyle = (count: number) => {
    if (!count) return "";
    const intensity = Math.min(count / 10, 1);
    return `bg-primary/${Math.round(intensity * 100)}`;
  };

  return {
    months: monthsWithDreams,
    getHeatmapStyle,
  };
};
