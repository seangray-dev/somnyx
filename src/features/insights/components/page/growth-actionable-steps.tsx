import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthActionableSteps({
  actionableSteps,
}: {
  actionableSteps: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actionable Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid list-disc gap-4 px-5 text-muted-foreground sm:grid-cols-2">
          {actionableSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
