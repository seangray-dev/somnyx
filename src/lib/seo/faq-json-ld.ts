import type { FAQPage, Question, WithContext } from "schema-dts";

export type FaqForSchema = {
  question: string;
  answer: string;
};

export function buildFAQPageJsonLd(
  entries: FaqForSchema[]
): WithContext<FAQPage> {
  const mainEntity: Question[] = entries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
