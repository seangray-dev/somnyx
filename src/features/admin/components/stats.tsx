"use client";

import { useQuery } from "convex/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

export default function AdminStats() {
  // @ts-ignore
  const totalUsers = useQuery(api.users.getTotalUsers);
  const totalThemePages = useQuery(api.queries.themePages.getAllThemePages);

  const stats = [
    {
      name: "Total Users",
      value: totalUsers ?? "...",
      loading: totalUsers === undefined,
    },
    {
      name: "Theme Pages",
      value: totalThemePages ?? "...",
      loading: totalThemePages === undefined,
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold">Overview</h2>
      <div className="pt-4 grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-center w-full">
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold text-center">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
