import { format, parse } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Summary({
  summary,
  monthYear,
}: {
  summary: string;
  monthYear: string;
}) {
  const formatMonthYear = (dateString: string) => {
    const date = parse(dateString, "MM-yyyy", new Date());
    return format(date, "MMMM yyyy");
  };

  const formattedMonthYear = formatMonthYear(monthYear);

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>{formattedMonthYear}</CardDescription>
        </CardHeader>
        <CardContent>{summary}</CardContent>
      </Card>
    </section>
  );
}
