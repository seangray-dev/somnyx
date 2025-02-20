import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ThematicAnalysis } from "../../types";

export default function ThemesThematicAnalysis({
  thematicAnalysis,
}: {
  thematicAnalysis: ThematicAnalysis;
}) {
  const { majorThemes, themeProgression, recurrentPatterns } = thematicAnalysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thematic Analysis</CardTitle>
        <CardDescription>{themeProgression}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {majorThemes.map((theme) => (
            <li key={theme.theme}>
              <Card>
                <CardHeader>
                  <CardTitle>{theme.theme}</CardTitle>
                  <CardDescription>Dreams: {theme.frequency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">Related Emotions: </span>
                    <span className="text-muted-foreground">
                      {theme.relatedEmotions.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Related Symbols: </span>
                    <span className="text-muted-foreground">
                      {theme.relatedSymbols.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Interpretation: </span>
                    <span className="text-muted-foreground">
                      {theme.interpretation}
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
