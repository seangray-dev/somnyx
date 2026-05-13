import Link from "next/link";
import type { ReactNode } from "react";

export type FreeInterpretationFaqItem = {
  question: string;
  schemaAnswer: string;
  answer: ReactNode;
};

export const freeInterpretationFaqItems: FreeInterpretationFaqItem[] = [
  {
    question:
      "What's the difference between the free interpretation and the full dream journal app?",
    schemaAnswer:
      "The free tool provides basic dream interpretation. With credits, you unlock AI-powered dream analysis (100 credits) and deep insights (300 credits), plus features like detailed pattern tracking and personalized symbol analysis. Our starter pack includes 300 free credits to explore these features.",
    answer:
      "The free tool provides basic dream interpretation. With credits, you unlock AI-powered dream analysis (100 credits) and deep insights (300 credits), plus features like detailed pattern tracking and personalized symbol analysis. Our starter pack includes 300 free credits to explore these features.",
  },
  {
    question:
      "Do I need to create an account to use the free dream interpreter?",
    schemaAnswer:
      "No. You can use our free dream interpretation tool without signing up or entering any personal information—it's completely free and anonymous.",
    answer:
      "No. You can use our free dream interpretation tool without signing up or entering any personal information—it's completely free and anonymous.",
  },
  {
    question: "How do credits and dream analysis work?",
    schemaAnswer:
      "Each dream analysis costs 100 credits for a standard interpretation, or 300 credits for a deep insight with more detailed analysis. You can start with our free 300 credits trial, then purchase more credits when needed, with packages ranging from 700 to 5000 credits.",
    answer:
      "Each dream analysis costs 100 credits for a standard interpretation, or 300 credits for a deep insight with more detailed analysis. You can start with our free 300 credits trial, then purchase more credits when needed, with packages ranging from 700 to 5000 credits.",
  },
  {
    question: "Will my dreams be private?",
    schemaAnswer:
      "Yes, all dreams are private by default and visible only to you. You have the option to share specific dreams publicly in our Dreamscape community or via direct links, but this is completely optional and under your control.",
    answer: (
      <>
        Yes, all dreams are private by default and visible only to you. You
        have the option to share specific dreams publicly in our{" "}
        <Link href="/dreamscape" className="text-foreground hover:underline">
          Dreamscape
        </Link>{" "}
        community or via direct links, but this is completely optional and
        under your control.
      </>
    ),
  },
  {
    question: "What features are included with credits?",
    schemaAnswer:
      "Credits unlock AI-Powered Dream Titles & Themes, Detailed Dream Analysis, and Deep Monthly Insights. All users get unlimited dream journaling for free, while AI features are available through our credit packages.",
    answer:
      "Credits unlock AI-Powered Dream Titles & Themes, Detailed Dream Analysis, and Deep Monthly Insights. All users get unlimited dream journaling for free, while AI features are available through our credit packages.",
  },
  {
    question: "How much do credit packages cost?",
    schemaAnswer:
      "Somnyx is free to use for basic journaling. Our credit packages start at $2.99 for 700 credits, $9.99 for 3000 credits (23% OFF), or $14.99 for 5000 credits (32% OFF). See the Pricing section on somnyx.app for current packages.",
    answer: (
      <>
        Somnyx is free to use for basic journaling. Our credit packages start at
        $2.99 for 700 credits, $9.99 for 3000 credits (23% OFF), or $14.99 for
        5000 credits (32% OFF). View our{" "}
        <Link href="/#pricing" className="text-foreground hover:underline">
          pricing page
        </Link>{" "}
        to explore credit packages.
      </>
    ),
  },
];
