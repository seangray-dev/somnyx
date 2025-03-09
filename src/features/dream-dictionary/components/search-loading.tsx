import { Loader2 } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="text-muted-foreground">Searching...</p>
    </div>
  );
}
