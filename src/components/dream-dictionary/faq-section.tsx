import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { freeInterpretationFaqItems } from "@/data/faqs/free-interpretation";

export default function DreamMeaningFaqSection() {
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
            {freeInterpretationFaqItems.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="text-pretty rounded-xl border bg-gradient-to-tr from-transparent via-transparent to-secondary/50 p-8 text-left"
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
