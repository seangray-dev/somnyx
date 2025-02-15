"use client";

import { redirect } from "next/navigation";

import { useQuery } from "convex/react";

import AdminGenerateTheme from "@/features/admin/components/generate-theme";
import AdminHeader from "@/features/admin/components/header";
import AdminStats from "@/features/admin/components/stats";
import AdminThemePagesList from "@/features/admin/components/theme-pages-list";
import { api } from "@/convex/_generated/api";
import { useSession } from "@/lib/client-auth";

export default function AdminPage() {
  const { isLoaded } = useSession();
  const isAdmin = useQuery(api.users.isUserAdmin);


  if (!isLoaded || isAdmin === undefined) {
    return (
      <div className="container py-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="h-4 w-96 rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  if (!isAdmin && isLoaded) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <AdminHeader />
      <main className="space-y-12">
        <AdminStats />
        <section>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <div className="pt-4 grid gap-6">
            <AdminGenerateTheme />
            <AdminThemePagesList />
          </div>
        </section>
      </main>
    </div>
  );
}
