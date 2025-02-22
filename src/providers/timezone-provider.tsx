"use client";

import { useTimezone } from "@/features/notifications/hooks/use-timezone";

export function TimezoneProvider() {
  useTimezone();
  return null;
}
