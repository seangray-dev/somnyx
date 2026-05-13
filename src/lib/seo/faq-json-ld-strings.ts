import { freeInterpretationFaqItems } from "@/data/faqs/free-interpretation";
import { landingFaqItems } from "@/data/faqs/landing";

import { buildFAQPageJsonLd } from "./faq-json-ld";

export const landingFaqJsonLdString = JSON.stringify(
  buildFAQPageJsonLd(
    landingFaqItems.map((item) => ({
      question: item.question,
      answer: item.schemaAnswer,
    }))
  )
);

export const freeInterpretationFaqJsonLdString = JSON.stringify(
  buildFAQPageJsonLd(
    freeInterpretationFaqItems.map((item) => ({
      question: item.question,
      answer: item.schemaAnswer,
    }))
  )
);
