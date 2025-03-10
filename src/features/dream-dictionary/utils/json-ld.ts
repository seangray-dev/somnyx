import { Preloaded } from "convex/react";
import { Article, WithContext } from "schema-dts";

import { applicationName, baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";

export function generateJSONLD(
  preloadedThemePage: Preloaded<
    // @ts-ignore
    typeof api.queries.themePages.getThemePageByNamePublic
  >
) {
  const { _valueJSON } = preloadedThemePage;

  const {
    name,
    seo_description,
    updatedAt,
    _creationTime,
    content,
    seo_slug,
    summary,
    tips,
    commonScenarios,
    commonSymbols,
    psychologicalMeaning,
    culturalContext,
  } = _valueJSON as any;

  const {
    dailyLifeSignificance,
    description,
    emotional_experience_relationship,
    expert_perspectives,
    research_studies,
    types_variations,
  } = content;

  const fullArticleBody = [
    summary,
    "Common Symbols:",
    commonSymbols.join(", "),
    "Common Scenarios:",
    commonScenarios.join(", "),
    "Psychological Meaning:",
    psychologicalMeaning,
    "Cultural Context:",
    culturalContext,
    "Understanding ${name} dreams:",
    description,
    emotional_experience_relationship,
    types_variations,
    dailyLifeSignificance,
    "Impact & Research:",
    emotional_experience_relationship,
    research_studies,
    expert_perspectives,
    "Tips & Recommendations:",
    tips,
  ].join(", ");

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name} Dream Meaning`,
    // @ts-ignore
    description: seo_description,
    author: {
      "@type": "Organization",
      name: applicationName,
    },
    publisher: {
      "@type": "Organization",
      name: applicationName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    articleBody: fullArticleBody,
    hasPart: [
      {
        "@type": "WebPageElement",
        name: "Summary",
        text: summary,
      },
      {
        "@type": "WebPageElement",
        name: "Common Symbols",
        text: commonSymbols.join(". "),
      },
      {
        "@type": "WebPageElement",
        name: "Common Scenarios",
        text: commonScenarios.join(". "),
      },
      {
        "@type": "WebPageElement",
        name: "Psychological Meaning",
        text: psychologicalMeaning,
      },
      {
        "@type": "WebPageElement",
        name: "Cultural Context",
        text: culturalContext,
      },
      {
        "@type": "WebPageElement",
        name: "Description",
        text: content.description,
      },
      {
        "@type": "WebPageElement",
        name: "Impact & Research",
        text: [
          content.emotional_experience_relationship,
          content.research_studies,
          content.expert_perspectives,
        ].join("\n\n"),
      },
      {
        "@type": "WebPageElement",
        name: "Tips & Recommendations",
        text: tips,
      },
    ],
    keywords: `${name} dream meaning, ${name} in dreams, ${name} dream interpretation, what does ${name} mean in dreams`,
    datePublished: new Date(_creationTime).toISOString(),
    dateModified: new Date(updatedAt).toISOString(),
    articleSection: [
      "Common Symbols",
      "Common Scenarios",
      "Psychological Meaning",
      "Cultural Context",
      `Understanding ${name} dreams`,
      "Impact & Research",
      "Tips & Research",
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/dream-dictionary/${seo_slug}`,
    },
  };

  return jsonLd;
}
