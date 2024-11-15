import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "Is it really free to start?",
      answer:
        "Yes! You can record and save all your dreams for free. We give you welcome credits to try your first AI interpretation and see how it helps you.",
    },
    {
      question: "How does the dream interpretation work?",
      answer:
        "Our AI learns your unique dream patterns and personal symbols over time. Unlike generic dream dictionaries, your interpretations are tailored to your life and experiences.",
    },
    {
      question: "What are credits and how do they work?",
      answer:
        "Credits let you unlock AI interpretations for specific dreams that feel important. You can buy credits whenever you need them, and use them to understand individual dreams or get monthly insight reports.",
    },
    {
      question: "Will my dreams be private?",
      answer:
        "Absolutely. Your dreams are personal, and we keep them that way. Your journal is private and secure, visible only to you.",
    },
    {
      question: "What if I forget to record my dream right away?",
      answer:
        "While recording dreams fresh in the morning works best, you can add dreams to your journal anytime. Our prompts help jog your memory to capture as many details as possible.",
    },
    {
      question: "Can I see patterns across all my dreams?",
      answer:
        "Yes! At the end of each month, you can use credits to get a comprehensive analysis showing patterns and connections across that month's dreams.",
    },
  ];

  return (
    <section id="faq" className="container py-28">
      <div className="flex flex-col items-center gap-10 md:gap-20">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h5 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl">
            Frequently Asked Questions
          </h5>
          <p className="text-balance text-muted-foreground">
            Here are some common questions we've answered to make your dream
            journaling experience smooth and informed.
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
