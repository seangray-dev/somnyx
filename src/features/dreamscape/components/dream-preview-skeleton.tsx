import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DreamPreviewSkeleton() {
  return (
    <Card className="space-y-4 overflow-hidden pt-0">
      <Skeleton className="h-[320px] rounded-b-none" />
      <CardHeader className="pt-2">
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <div>
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
