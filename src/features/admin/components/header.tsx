"use client";

import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: { pathname: "/admin" } },
  { name: "Users", href: { pathname: "/admin/users" } },
  { name: "Content", href: { pathname: "/admin/content" } },
  { name: "System", href: { pathname: "/admin/system" } },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="pb-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
    </header>
  );
}
