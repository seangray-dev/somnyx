import React from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoaderProps = {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
};

export const Loader = ({
  loading,
  children,
  noPadding,
  className,
}: LoaderProps) => {
  return loading ? (
    <div className={cn(className || "flex w-full justify-center py-5")}>
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  ) : (
    children
  );
};
