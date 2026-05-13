import Link from "next/link";
import type { ReactNode } from "react";

export type LandingFaqItem = {
  question: string;
  schemaAnswer: string;
  answer: ReactNode;
};

export const landingFaqItems: LandingFaqItem[] = [
  {
    question: "Is it really free to start?",
    schemaAnswer:
      "Yes! You can record and save all your dreams for free. We give you welcome credits to try your first AI interpretation and see how it helps you.",
    answer:
      "Yes! You can record and save all your dreams for free. We give you welcome credits to try your first AI interpretation and see how it helps you.",
  },
  {
    question: "How does the dream interpretation work?",
    schemaAnswer:
      "Our AI learns your unique dream patterns and personal symbols over time. Unlike generic dream dictionaries, your interpretations are tailored to your life and experiences.",
    answer:
      "Our AI learns your unique dream patterns and personal symbols over time. Unlike generic dream dictionaries, your interpretations are tailored to your life and experiences.",
  },
  {
    question: "What are credits and how do they work?",
    schemaAnswer:
      "Credits let you unlock AI interpretations for specific dreams that feel important. You can buy credits whenever you need them, and use them to understand individual dreams or get monthly insight reports.",
    answer:
      "Credits let you unlock AI interpretations for specific dreams that feel important. You can buy credits whenever you need them, and use them to understand individual dreams or get monthly insight reports.",
  },
  {
    question: "Will my dreams be private?",
    schemaAnswer:
      "Your dreams are always private by default. Dreams marked as public may be shown in the Dreamscape community feed. You have full control over which dreams you share—only those you specifically mark as public will be visible to others.",
    answer: (
      <>
        Your dreams are always private by default. Dreams marked as public may
        be shown in the{" "}
        <Link href="/dreamscape" className="text-foreground hover:underline">
          Dreamscape
        </Link>{" "}
        community feed. You have full control over which dreams you share -
        only those you specifically mark as public will be visible to others.
      </>
    ),
  },
  {
    question: "What if I forget to record my dream right away?",
    schemaAnswer:
      "While recording dreams fresh in the morning works best, you can add dreams to your journal anytime. Our prompts help jog your memory to capture as many details as possible.",
    answer:
      "While recording dreams fresh in the morning works best, you can add dreams to your journal anytime. Our prompts help jog your memory to capture as many details as possible.",
  },
  {
    question: "Can I see patterns across all my dreams?",
    schemaAnswer:
      "Yes! At the end of each month, you can use credits to get a comprehensive analysis showing patterns and connections across that month's dreams.",
    answer:
      "Yes! At the end of each month, you can use credits to get a comprehensive analysis showing patterns and connections across that month's dreams.",
  },
];
