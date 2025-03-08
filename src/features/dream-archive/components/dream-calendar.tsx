"use client";

import { useRef, useState } from "react";

import { format, startOfMonth } from "date-fns";

import { useDreamCalendar } from "../hooks/use-dream-calendar";
import { CalendarDay } from "./calendar-day";
import { DateSelector } from "./date-selector";

export function DreamCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { months, getHeatmapStyle } = useDreamCalendar();
  const monthRefs = useRef<Record<string, HTMLElement>>({});

  const handleDateChange = (date: Date) => {
    setSelectedDate(startOfMonth(date));
    const monthKey = format(date, "yyyy-MM");
    const monthElement = monthRefs.current[monthKey];

    if (monthElement) {
      monthElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-16 z-20 flex items-center justify-between border-b bg-background py-4">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="relative bg-background">
        <div className="h-[calc(100vh-120px)] space-y-8 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {months.map((month) => (
            <section
              key={month.date.toString()}
              ref={(el) => {
                if (el) {
                  monthRefs.current[format(month.date, "yyyy-MM")] = el;
                }
              }}
              className="pt-4"
            >
              <h2 className="mb-6 text-2xl font-semibold">
                {month.formattedTitle}
              </h2>

              <div className="grid grid-cols-7 gap-2">
                {month.days.map((day) => (
                  <CalendarDay
                    key={day.date.toString()}
                    dayOfWeek={day.dayOfWeek}
                    dayOfMonth={day.dayOfMonth}
                    formattedDate={day.formattedDate}
                    isToday={day.isToday}
                    isFutureDate={day.isFutureDate}
                    dreamCount={day.dreamCount}
                    heatmapStyle={getHeatmapStyle(day.dreamCount)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
