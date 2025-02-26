"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { BookIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const MAX_CHARS = 2000;

export default function DreamInterpreter() {
  const [dream, setDream] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [interpretationId, setInterpretationId] =
    useState<Id<"freeInterpretations"> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();

  const charCount = dream.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Convex mutations and queries
  const saveFreeInterpretation = useMutation(
    api.mutations.interpretations.saveFreeInterpretation
  );
  const interpretation = useQuery(
    api.queries.interpretations.getFreeInterpretation,
    interpretationId ? { interpretationId } : "skip"
  );

  const handleAnalysis = useCallback(async () => {
    if (!dream.trim() || isAnalyzing || isOverLimit) return;

    setIsAnalyzing(true);
    try {
      console.log("[Dream Analysis] Starting analysis process");
      const ipResponse = await fetch("/api/get-ip");
      if (!ipResponse.ok) {
        throw new Error("Failed to get IP address");
      }

      const { ip } = await ipResponse.json();
      const id = await saveFreeInterpretation({
        dreamText: dream,
        ipAddress: ip,
        sessionId,
      });

      setInterpretationId(id);
      setDream("");
    } catch (error) {
      console.error("[Dream Analysis] Error:", error);
      toast.error("Failed to analyze your dream. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [dream, isAnalyzing, saveFreeInterpretation, sessionId, isOverLimit]);

  useEffect(() => {
    return () => {
      setIsAnalyzing(false);
      setInterpretationId(null);
    };
  }, []);

  useEffect(() => {
    if (interpretation === null && interpretationId) {
      toast.error("This interpretation has expired", {
        description: "Free interpretations are available for 24 hours",
      });
      setInterpretationId(null);
    }
  }, [interpretation, interpretationId]);

  const isButtonDisabled = !dream.trim() || isAnalyzing || isOverLimit;

  return (
    <div className="flex flex-col gap-8">
      {/* Input Section */}
      <div className="space-y-2">
        <Textarea
          id={textareaId}
          ref={textareaRef}
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I found myself walking through a forest at night..."
          className="min-h-[150px] resize-none"
          disabled={isAnalyzing}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>* Try to include emotions, and significant details</span>
          <span className={cn(isOverLimit && "text-destructive")}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAnalysis}
            disabled={isButtonDisabled}
            className="relative"
          >
            {isAnalyzing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Dream...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Interpret Dream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Section */}
      {interpretation && (
        <Card className="p-6">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="emotions">Emotions</TabsTrigger>
              <TabsTrigger value="symbols">Symbols</TabsTrigger>
              <TabsTrigger value="message">Message</TabsTrigger>
              <TabsTrigger value="action">Action</TabsTrigger>
            </TabsList>

            {!interpretation.analysis ? (
              // Skeleton loading state
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="summary" className="space-y-4">
                  <h3 className="text-lg font-semibold">Dream Overview</h3>
                  <p className="leading-7">
                    {interpretation?.analysis?.summary}
                  </p>
                </TabsContent>

                <TabsContent value="emotions" className="space-y-4">
                  <h3 className="text-lg font-semibold">Emotional Analysis</h3>
                  <p className="leading-7">
                    {interpretation?.analysis?.emotionalBreakdown}
                  </p>
                </TabsContent>

                <TabsContent value="symbols" className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Symbolic Interpretation
                  </h3>
                  <p className="leading-7">
                    {interpretation?.analysis?.symbolicInterpretation}
                  </p>
                </TabsContent>

                <TabsContent value="message" className="space-y-4">
                  <h3 className="text-lg font-semibold">Core Message</h3>
                  <p className="leading-7">
                    {interpretation?.analysis?.underlyingMessage}
                  </p>
                </TabsContent>

                <TabsContent value="action" className="space-y-4">
                  <h3 className="text-lg font-semibold">Actionable Insights</h3>
                  <p className="leading-7">
                    {interpretation?.analysis?.actionableTakeaway}
                  </p>
                </TabsContent>
              </>
            )}
          </Tabs>

          {/* Updated CTA */}
          <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 p-6 dark:from-purple-950 dark:to-indigo-950">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="mx-auto rounded-full bg-primary/10 p-2">
                <BookIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold">
                    Start Your Dream Journal
                  </h4>
                  <p className="text-balance text-muted-foreground">
                    Create a free account to save your dreams and track patterns
                    over time. Use credits to get AI analysis whenever you want
                    deeper insights.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <Link href={{ pathname: "/signup" }}>
                      <span>✓ Free Dream Journal</span>
                    </Link>
                    <Link href={{ pathname: "/signup" }}>
                      <span>✓ Monthly Insights</span>
                    </Link>
                    <Link href="/dream-dictionary">
                      <span>✓ Dream Dictionary</span>
                    </Link>
                    <Link href="/dreamscape">
                      <span>✓ Dreamscape Community</span>
                    </Link>
                  </div>
                  <Button
                    variant="default"
                    className="mt-2"
                    onClick={() => (window.location.href = "/signup")}
                  >
                    Start Free Journal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
