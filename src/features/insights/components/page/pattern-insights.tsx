import { PatternsInsights } from "../../types";
import PatternsRolePatterns from "./patterns-role-patterns";
import PatternsSettingAnalysis from "./patterns-setting-analysis";
import PatternsSocialDynamics from "./patterns-social-dynamics";
import PatternsTemporal from "./patterns-temporal";

export default function PatternInsights({
  patternsInsights,
}: {
  patternsInsights: PatternsInsights;
}) {
  const { rolePatterns, settingAnalysis, socialDynamics, temporalPatterns } =
    patternsInsights;

  return (
    <section className="flex flex-col gap-4">
      <PatternsRolePatterns rolePatterns={rolePatterns} />
      <PatternsSettingAnalysis settingAnalysis={settingAnalysis} />
      <PatternsSocialDynamics socialDynamics={socialDynamics} />
      <PatternsTemporal temporalPatterns={temporalPatterns} />
    </section>
  );
}
