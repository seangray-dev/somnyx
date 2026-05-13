import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { landingFaqItems } from "@/data/faqs/landing";

export default function FAQSection() {
  return (
    <section id="faq" className="container py-28">
      <div className="flex flex-col items-center gap-10 md:gap-20">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h5 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl">
            Frequently Asked Questions
          </h5>
          <p className="text-balance text-muted-foreground">
            Here are some common questions we&apos;ve answered to make your
            dream journaling experience smooth and informed.
          </p>
        </div>
        <div className="w-full">
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-5 md:grid md:grid-cols-2"
          >
            {landingFaqItems.map((faq) => (
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
