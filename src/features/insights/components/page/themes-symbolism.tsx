import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Symbolism } from "../../types";

export default function ThemesSymbolism({
  symbolism,
}: {
  symbolism: Symbolism;
}) {
  const { recurringSymbols, symbolPatterns, uniqueSymbols } = symbolism;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symbolism</CardTitle>
        <CardDescription>{symbolPatterns}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {recurringSymbols.map((symbol) => (
            <li key={symbol.symbol}>
              <Card>
                <CardHeader>
                  <CardTitle>{symbol.symbol}</CardTitle>
                  <CardDescription>Dreams: {symbol.frequency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">Associated Emotions: </span>
                    <span className="text-muted-foreground">
                      {symbol.associatedEmotions.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Contexts: </span>
                    <span className="text-muted-foreground">
                      {symbol.contexts.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Interpretation: </span>
                    <span className="text-muted-foreground">
                      {symbol.interpretation}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>Unique Symbols: {uniqueSymbols.join(", ")}</CardFooter>
    </Card>
  );
}
