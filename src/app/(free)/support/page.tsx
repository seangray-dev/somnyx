"use client";

import { BugIcon, MessageSquareIcon } from "lucide-react";

import FAQSection from "@/components/shared/faq-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeedbackDialog } from "@/features/feedback";

export default function SupportPage() {
  return (
    <div>
      <div className="container py-12 md:py-20">
        {/* Hero Section */}
        <header className="mx-auto max-w-[80ch] space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Support
          </h1>
          <p className="text-balance text-lg text-muted-foreground">
            We&apos;re here to help! Choose an option below to get the support
            you need.
          </p>
        </header>

        {/* Support Options */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Feedback Card */}
          <Card className="flex flex-col items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <MessageSquareIcon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Share Feedback</h2>
            <p className="text-pretty text-center text-muted-foreground">
              We value your thoughts and suggestions on how we can improve your
              experience.
            </p>
            <FeedbackDialog
              type="feedback"
              trigger={
                <Button variant="outline" className="mt-2">
                  Give Feedback
                </Button>
              }
            />
          </Card>

          {/* Report Issue Card */}
          <Card className="flex flex-col items-center gap-4 p-6">
            <div className="rounded-full bg-destructive/10 p-3">
              <BugIcon className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Report an Issue</h2>
            <p className="text-pretty text-center text-muted-foreground">
              Encountered a problem? Let us know and we&apos;ll help you resolve
              it.
            </p>
            <FeedbackDialog
              type="issue"
              trigger={
                <Button variant="outline" className="mt-2">
                  Report Issue
                </Button>
              }
            />
          </Card>
        </div>
      </div>
      <FAQSection />
    </div>
  );
}
