import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DreamCardSkeleton() {
  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-8" />
      </CardHeader>

      <CardContent className="flex flex-grow flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16" />
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
}
