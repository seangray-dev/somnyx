import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SettingAnalysis } from "../../types";

export default function PatternsSettingAnalysis({
  settingAnalysis,
}: {
  settingAnalysis: SettingAnalysis;
}) {
  const { commonLocations, environmentalPatterns, settingTransitions } =
    settingAnalysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setting Analysis</CardTitle>
        <CardDescription className="grid gap-4 pt-2 md:grid-cols-2">
          <div>
            <span className="font-medium text-card-foreground">
              Environmental Patterns:{" "}
            </span>
            <span className="text-muted-foreground">
              {environmentalPatterns}
            </span>
          </div>
          <div>
            <span className="font-medium text-card-foreground">
              Setting Transitions:{" "}
            </span>
            <span className="text-muted-foreground">{settingTransitions}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {commonLocations.map((location) => (
            <li key={location.place}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{location.place}</CardTitle>
                  <CardDescription>
                    Dreams: {location.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">Assocaited Emotions: </span>
                    <span className="text-muted-foreground">
                      {location.associatedEmotions.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Symbolism: </span>
                    <span className="text-muted-foreground">
                      {location.symbolism}
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
