import { ReactNode } from "react";

interface DreamscapeHeaderProps {
  children: ReactNode;
}

export function DreamscapeHeader({ children }: DreamscapeHeaderProps) {
  return (
    <div className="flex items-center justify-between container">
      <h2 className="text-lg font-medium">Sort Dreams By</h2>
      {children}
    </div>
  );
}
