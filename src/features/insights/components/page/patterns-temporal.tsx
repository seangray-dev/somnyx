import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TemporalPatterns } from "../../types";

export default function PatternsTemporal({
  temporalPatterns,
}: {
  temporalPatterns: TemporalPatterns;
}) {
  const { timeBasedPatterns, monthlyProgression, dateCorrelations } =
    temporalPatterns;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temporal Patterns</CardTitle>
        <CardDescription>{monthlyProgression}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time Based Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {timeBasedPatterns.map((pattern) => (
                <li
                  key={pattern.pattern}
                  className="border-b pb-2 last:border-b-0"
                >
                  <div>
                    <span className="font-medium">Pattern: </span>
                    <span className="text-muted-foreground">
                      {pattern.pattern}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Dreams: </span>
                    <span className="text-muted-foreground">
                      {pattern.frequency}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Significance: </span>
                    <span className="text-muted-foreground">
                      {pattern.significance}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date Correlations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dateCorrelations.map((correlation) => (
                <li
                  key={correlation.date}
                  className="border-b pb-2 last:border-b-0"
                >
                  <div>
                    <span className="font-medium">Date: </span>
                    <span className="text-muted-foreground">
                      {correlation.date}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Patterns: </span>
                    <span className="text-muted-foreground">
                      {correlation.patterns.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Significance: </span>
                    <span className="text-muted-foreground">
                      {correlation.significance}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
