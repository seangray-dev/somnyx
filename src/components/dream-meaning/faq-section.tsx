import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DreamMeaningFaqSection() {
  const faqs = [
    {
      question:
        "What's the difference between the free interpretation and the full dream journal app?",
      answer:
        "The free tool provides basic dream interpretation. With credits, you unlock AI-powered dream analysis (100 credits) and deep insights (300 credits), plus features like detailed pattern tracking and personalized symbol analysis. Our starter pack includes 300 free credits to explore these features.",
    },
    {
      question:
        "Do I need to create an account to use the free dream interpreter?",
      answer:
        "No. You can use our free dream interpretation tool without signing up or entering any personal information—it's completely free and anonymous.",
    },
    {
      question: "How do credits and dream analysis work?",
      answer:
        "Each dream analysis costs 100 credits for a standard interpretation, or 300 credits for a deep insight with more detailed analysis. You can start with our free 300 credits trial, then purchase more credits when needed, with packages ranging from 700 to 5000 credits.",
    },
    {
      question: "Is my dream content kept private?",
      answer:
        "Yes. This is a privacy-first tool. Your dream interpretation is processed securely and we provide unlimited dream journaling to all users. Your dream content remains private and protected.",
    },
    {
      question: "What features are included with credits?",
      answer:
        "Credits unlock AI-Powered Dream Titles & Themes, Detailed Dream Analysis, and Deep Monthly Insights. All users get unlimited dream journaling for free, while AI features are available through our credit packages.",
    },
    {
      question: "How much do credit packages cost?",
      answer: [
        "Somnyx is free to use for basic journaling. Our credit packages start at $2.99 for 700 credits, $9.99 for 3000 credits (23% OFF), or $14.99 for 5000 credits (32% OFF). View our ",
        <Link
          key="pricing-link"
          href="/#pricing"
          className="text-foreground hover:underline"
        >
          pricing page
        </Link>,
        " to explore credit packages.",
      ],
    },
  ];

  return (
    <section id="faq" className="border-t py-28">
      <div className="container flex flex-col items-center gap-10 md:gap-20">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-balance text-muted-foreground">
            Answers to common questions about our free dream interpretation
            tool.
          </p>
        </div>
        <div className="w-full">
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-5 md:grid md:grid-cols-2"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="rounded-xl border bg-gradient-to-tr from-transparent via-transparent to-secondary/50 p-8 text-left"
              >
                <AccordionTrigger className="text-left font-sans font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[80ch] text-pretty border-t pt-4 text-muted-foreground lg:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
