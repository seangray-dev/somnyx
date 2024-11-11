import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RolePatterns } from "../../types";

export default function PatternsRolePatterns({
  rolePatterns,
}: {
  rolePatterns: RolePatterns;
}) {
  const { primaryRoles, roleInsights } = rolePatterns;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Patterns</CardTitle>
        <CardDescription>{roleInsights}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 sm:grid-cols-2">
          {primaryRoles.map((role) => (
            <li key={role.role}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{role.role}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">Associated Emotions: </span>
                    <span className="text-muted-foreground">
                      {role.associatedEmotions.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Frequency: </span>
                    <span className="text-muted-foreground">
                      {role.frequency}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Significant Patterns: </span>
                    <span className="text-muted-foreground">
                      {role.significantPatterns}
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
