import { Skeleton } from "@/components/ui/skeleton";

import useGetDreamsInCurrentMonthCount from "../api/use-get-dreams-in-current-month-count";

export default function DreamsInCurrentMonthCount() {
  const { isLoading, data } = useGetDreamsInCurrentMonthCount();

  return (
    <div className="flex items-center justify-between gap-2 text-sm sm:flex-col sm:justify-center">
      <div>Dreams Logged This Month</div>
      {isLoading ? (
        <Skeleton className="h-[20px] w-[50px] rounded-full bg-muted-foreground" />
      ) : (
        <div>{data === 0 ? "No dreams yet" : data}</div>
      )}
    </div>
  );
}
