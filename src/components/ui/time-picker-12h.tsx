"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { TimePeriodSelect } from "@/components/ui/period-select";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Period } from "@/utils/time-picker-utils";

interface TimePicker12HProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function TimePicker12H({
  date,
  setDate,
  disabled = false,
}: TimePicker12HProps) {
  const [period, setPeriod] = React.useState<Period>(() => {
    if (!date) return "AM";
    return date.getHours() >= 12 ? "PM" : "AM";
  });

  // Keep period in sync with date changes
  React.useEffect(() => {
    if (date) {
      const newPeriod = date.getHours() >= 12 ? "PM" : "AM";
      if (newPeriod !== period) {
        setPeriod(newPeriod);
      }
    }
  }, [date, period]);

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  // const secondRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
          disabled={disabled}
        />
      </div>
      {/* <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          id="seconds12"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div> */}
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <TimePeriodSelect
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={setDate}
          ref={periodRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
