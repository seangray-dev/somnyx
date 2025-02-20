import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { EmotionalTrigger } from "../../types";

export default function EmotionalTriggers({
  emotionalTrigger,
}: {
  emotionalTrigger: EmotionalTrigger[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotional Triggers</CardTitle>
        <CardDescription>
          Triggers that have been identified in your dreams.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {emotionalTrigger.map((trigger) => (
          <div key={trigger.trigger}>
            <div className="flex items-center gap-2">
              <div className="font-medium">{trigger.trigger}</div>
              <div className="text-sm text-muted-foreground">
                (Frequency: {trigger.frequency})
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Associated Emotions: {trigger.associatedEmotions.join(", ")}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
