import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function ThemeSection() {
  return (
    <div className="flex items-center justify-between rounded border bg-secondary/10 p-4">
      <div className="font-medium">Theme:</div>
      <ThemeToggle />
    </div>
  );
}
