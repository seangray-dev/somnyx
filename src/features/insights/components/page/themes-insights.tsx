import { ThemesInsights } from "../../types";
import ThemesSymbolism from "./themes-symbolism";
import ThemesThematicAnalysis from "./themes-thematic-anlysis";

export default function ThemesInsightsTab({
  themesInsights,
}: {
  themesInsights: ThemesInsights;
}) {
  const { symbolism, thematicAnalysis } = themesInsights;

  return (
    <section className="flex flex-col gap-4">
      <ThemesThematicAnalysis thematicAnalysis={thematicAnalysis} />
      <ThemesSymbolism symbolism={symbolism} />
    </section>
  );
}
