import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthKeyInsights({
  keyInsights,
}: {
  keyInsights: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid list-outside list-disc gap-4 px-5 text-muted-foreground md:grid-cols-2">
          {keyInsights.map((insight) => (
            <li className="list-item" key={insight}>
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
