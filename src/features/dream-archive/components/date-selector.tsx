import { useState } from "react";

import { getDaysInMonth, getYear } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const currentYear = getYear(new Date());
  const startYear = 2024;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const [tempYear, setTempYear] = useState<string | undefined>();
  const [tempMonth, setTempMonth] = useState<string | undefined>();
  const [tempDay, setTempDay] = useState<string | undefined>();

  const daysInMonth =
    tempYear && tempMonth
      ? getDaysInMonth(new Date(parseInt(tempYear), parseInt(tempMonth) - 1))
      : 0;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0");
    return { value: day, label: day };
  });

  const handleJumpTo = () => {
    if (!tempYear) return;

    const year = parseInt(tempYear);
    const month = tempMonth ? parseInt(tempMonth) - 1 : 0;
    const day = tempDay ? parseInt(tempDay) : 1;

    onDateChange(new Date(year, month, day));

    // Reset selections after jumping
    setTempYear(undefined);
    setTempMonth(undefined);
    setTempDay(undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={tempYear} onValueChange={setTempYear}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={tempMonth}
        onValueChange={setTempMonth}
        disabled={!tempYear}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tempDay} onValueChange={setTempDay} disabled={!tempMonth}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleJumpTo} disabled={!tempYear} variant="secondary">
        Jump to
      </Button>
    </div>
  );
}
