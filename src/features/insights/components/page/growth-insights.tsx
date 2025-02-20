import { PersonalGrowth } from "../../types";
import GrowthActionableSteps from "./growth-actionable-steps";
import GrowthChallengesIdentified from "./growth-challenges-identified";
import GrowthKeyInsights from "./growth-key-insights";
import GrowthOpportunities from "./growth-opportunities";

export default function GrowthInsights({
  personalGrowth,
}: {
  personalGrowth: PersonalGrowth;
}) {
  const {
    actionableSteps,
    challengesIdentified,
    growthOpportunities,
    keyInsights,
  } = personalGrowth;

  return (
    <section className="flex flex-col gap-4">
      <GrowthActionableSteps actionableSteps={actionableSteps} />
      <GrowthChallengesIdentified challengesIdentified={challengesIdentified} />
      <GrowthOpportunities growthOpportunities={growthOpportunities} />
      <GrowthKeyInsights keyInsights={keyInsights} />
    </section>
  );
}
