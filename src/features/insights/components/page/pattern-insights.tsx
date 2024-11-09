import { PatternsInsights } from "../../types";
import PatternsRolePatterns from "./patterns-role-patterns";
import PatternsSettingAnalysis from "./patterns-setting-analysis";
import PatternsSocialDynamics from "./patterns-social-dynamics";

export default function PatternInsights({
  patternsInsights,
}: {
  patternsInsights: PatternsInsights;
}) {
  const { rolePatterns, settingAnalysis, socialDynamics } = patternsInsights;

  return (
    <section className="flex flex-col gap-4">
      <PatternsRolePatterns rolePatterns={rolePatterns} />
      <PatternsSettingAnalysis settingAnalysis={settingAnalysis} />
      <PatternsSocialDynamics socialDynamics={socialDynamics} />
    </section>
  );
}
