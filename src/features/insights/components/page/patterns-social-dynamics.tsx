import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SocialDynamics } from "../../types";

export default function PatternsSocialDynamics({
  socialDynamics,
}: {
  socialDynamics: SocialDynamics;
}) {
  const { recurringCharacters, relationshipPatterns, socialThemes } =
    socialDynamics;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Dynamics</CardTitle>
        <CardDescription className="grid gap-4 pt-2 md:grid-cols-2">
          <div>
            <span className="font-medium text-card-foreground">
              Relationship Patterns:{" "}
            </span>
            <span className="text-muted-foreground">
              {relationshipPatterns}
            </span>
          </div>
          <div>
            <span className="font-medium text-card-foreground">
              Social Themes:{" "}
            </span>
            <span className="text-muted-foreground">
              {socialThemes.join(", ")}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {recurringCharacters.map((character) => (
            <li key={character.name}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{character.name}</CardTitle>
                  <CardDescription>
                    Dreams: {character.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">Associated Themes: </span>
                    <span className="text-muted-foreground">
                      {character.associatedEmotions.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Contexts: </span>
                    <span className="text-muted-foreground">
                      {character.contextsAppearing}
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
