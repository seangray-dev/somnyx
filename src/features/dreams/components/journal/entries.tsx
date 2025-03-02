"use client";

import { useState } from "react";

import { usePaginatedQuery, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { DreamCard } from "@/features/dreams/components/dream-card";
import { NoDreams } from "@/features/dreams/components/no-dreams";
import { useSession } from "@/lib/client-auth";

export default function JournalEntries() {
  const { session } = useSession();
  const [timePeriod, setTimePeriod] = useState("all_time");
  const [order, setOrder] = useState("desc");
  const emotions = useQuery(api.queries.getAllEmotions);
  const roles = useQuery(api.queries.getAllRoles);
  const userId = session?.user?.id;
  const {
    results: dreams,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.dreams.journalEntries,
    { userId: userId || "", order: order as "asc" | "desc", timePeriod },
    { initialNumItems: 6 }
  );

  const timePeriods = [
    {
      label: "Last week",
      value: "last_week",
    },
    {
      label: "Last month",
      value: "last_month",
    },
    {
      label: "Last 3 months",
      value: "last_3_months",
    },
    {
      label: "Last 6 months",
      value: "last_6_months",
    },
    {
      label: "Last year",
      value: "last_year",
    },
    {
      label: "All time",
      value: "all_time",
    },
  ];

  if (dreams.length === 0) {
    return <NoDreams />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl">Journal</h1>
        {/* <div className="flex flex-col gap-2">
          <Label className="sr-only" htmlFor="order">
            Order
          </Label>
          <Select onValueChange={(value) => setOrder(value)}>
            <SelectTrigger id="order">
              <SelectValue defaultValue={order} placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"asc"}>
                <span>Ascending</span>
              </SelectItem>
              <SelectItem value={"desc"} defaultChecked>
                <span>Descending</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Filters */}
      {/* <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="time-period">Time Period</Label>
          <Select onValueChange={(value) => setTimePeriod(value)}>
            <SelectTrigger id="time-period">
              <SelectValue
                placeholder="Last month"
                defaultValue={"last_month"}
              />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((timePeriod) => (
                <SelectItem key={timePeriod.label} value={timePeriod.value}>
                  {timePeriod.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="emotion">Emotion</Label>
          <Select>
            <SelectTrigger id="emotion">
              <SelectValue placeholder="Emotion" />
            </SelectTrigger>
            <SelectContent>
              {emotions?.map((emotion) => (
                <SelectItem key={emotion._id} value={emotion._id}>
                  {emotion.emoji} {emotion.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Role</Label>
          <Select>
            <SelectTrigger id="role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((role) => (
                <SelectItem key={role._id} value={role._id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="theme">Theme</Label>
          <Select>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {themes?.map((theme) => (
                <SelectItem key={theme._id} value={theme._id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}
      {/* Entries */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dreams.map((dream) => (
          <DreamCard key={dream._id} {...dream} />
        ))}
      </div>
      <Button onClick={() => loadMore(6)} disabled={status !== "CanLoadMore"}>
        Load More
      </Button>
    </div>
  );
}
