import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DreamPreviewSkeleton() {
  return (
    <Card className="space-y-4 overflow-hidden pt-0">
      <Skeleton className="h-[500px] rounded-b-none" />
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/4" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}
