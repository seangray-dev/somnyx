import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthChallengesIdentified({
  challengesIdentified,
}: {
  challengesIdentified: {
    challenge: string;
    relatedPatterns: string[];
    suggestedActions: string[];
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenges Identified</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid place-items-stretch gap-4 md:grid-cols-2">
          {challengesIdentified.map((challenge) => (
            <li key={challenge.challenge}>
              <Card className="h-full">
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">
                    {challenge.challenge}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-medium">Related Patterns: </span>
                    <span className="text-muted-foreground">
                      {challenge.relatedPatterns.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Suggested Actions: </span>
                    <span className="text-muted-foreground">
                      {challenge.suggestedActions.join(", ")}
                    </span>
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
