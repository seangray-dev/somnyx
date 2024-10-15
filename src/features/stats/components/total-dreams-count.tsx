import { Skeleton } from "@/components/ui/skeleton";

import useGetTotalDreamsCount from "../api/use-get-total-dreams-count";

export default function TotalDreamsCount() {
  const { isLoading, data } = useGetTotalDreamsCount();

  return (
    <div className="flex items-center justify-between gap-2 text-sm sm:flex-col sm:justify-center">
      <div>Total Dreams Logged</div>
      {isLoading ? (
        <Skeleton className="h-[20px] w-[50px] rounded-full bg-muted-foreground" />
      ) : (
        <div>{data === 0 ? "No dreams yet" : data}</div>
      )}
    </div>
  );
}
