import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthOpportunities({
  growthOpportunities,
}: {
  growthOpportunities: {
    area: string;
    evidence: string[];
    recommendations: string[];
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {growthOpportunities.map((opportunity) => (
            <li key={opportunity.area}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{opportunity.area}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-medium">Evidence:</span>
                    <ul className="list-inside list-disc text-muted-foreground">
                      {opportunity.evidence.map((evidence) => (
                        <li key={evidence}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Recommendations:</span>
                    <ul className="list-inside list-disc text-muted-foreground">
                      {opportunity.recommendations.map((recommendation) => (
                        <li key={recommendation}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
