"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowRightIcon,
  BookIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const MAX_CHARS = 2000;
const STORAGE_KEY = "lastDreamText";

function formatTimeRemaining(ms: number) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function DreamInterpreter() {
  const [dream, setDream] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "";
    }
    return "";
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [interpretationId, setInterpretationId] =
    useState<Id<"freeInterpretations"> | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isAllowed: boolean;
    nextAllowedTimestamp: number | null;
  }>({ isAllowed: true, nextAllowedTimestamp: null });
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showRateLimit, setShowRateLimit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();

  const charCount = dream.length;
  const isOverLimit = charCount > MAX_CHARS;

  const saveFreeInterpretation = useMutation(
    // @ts-ignore
    api.mutations.interpretations.saveFreeInterpretation
  );
  const checkRateLimit = useMutation(
    // @ts-ignore
    api.mutations.interpretations.checkInterpretationRateLimit
  );
  const interpretation = useQuery(
    // @ts-ignore
    api.queries.interpretations.getFreeInterpretation,
    interpretationId ? { interpretationId } : "skip"
  );

  // Save dream text to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, dream);
    }
  }, [dream]);

  // Check rate limit on mount and after each analysis
  const checkRateLimitStatus = useCallback(async () => {
    try {
      const ipResponse = await fetch("/api/get-ip");
      if (!ipResponse.ok) {
        throw new Error("Failed to get IP address");
      }
      const { ip } = await ipResponse.json();
      const status = await checkRateLimit({ ipAddress: ip });
      setRateLimitInfo({
        isAllowed: status.isAllowed,
        nextAllowedTimestamp: status.nextAllowedTimestamp,
      });
    } catch (error) {
      console.error("[Rate Limit Check] Error:", error);
    }
  }, [checkRateLimit]);

  useEffect(() => {
    checkRateLimitStatus();
  }, [checkRateLimitStatus]);

  // Update countdown timer
  useEffect(() => {
    if (!rateLimitInfo.nextAllowedTimestamp) {
      setShowRateLimit(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, rateLimitInfo.nextAllowedTimestamp! - now);

      if (remaining === 0) {
        // Start exit animation
        setShowRateLimit(false);
        // Wait for animation to complete before checking status
        setTimeout(() => {
          checkRateLimitStatus();
        }, 500); // Match the animation duration
        return;
      }

      setTimeRemaining(formatTimeRemaining(remaining));
    };

    setShowRateLimit(true);
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rateLimitInfo.nextAllowedTimestamp]);

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
      await checkRateLimitStatus(); // Update rate limit status after analysis
    } catch (error: any) {
      console.error("[Dream Analysis] Error:", error);
      toast.error(
        error.message || "Failed to analyze your dream. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    dream,
    isAnalyzing,
    saveFreeInterpretation,
    sessionId,
    isOverLimit,
    checkRateLimitStatus,
  ]);

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

  const isButtonDisabled =
    !dream.trim() || isAnalyzing || isOverLimit || !rateLimitInfo.isAllowed;

  return (
    <div className="flex flex-col gap-8">
      {!rateLimitInfo.isAllowed && rateLimitInfo.nextAllowedTimestamp && (
        <Alert
          variant="default"
          className={cn(
            "flex flex-col gap-3 bg-muted transition-all dark:bg-transparent",
            showRateLimit
              ? "translate-y-0 opacity-100 duration-500 animate-in fade-in slide-in-from-top-4"
              : "-translate-y-4 opacity-0 duration-500 animate-out fade-out slide-out-to-top-4"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 flex-shrink-0" />
              <p className="font-medium">Daily Limit Reached</p>
            </div>
            <AlertDescription className="space-y-1 text-sm text-muted-foreground">
              <p className="text-balance">
                Your next free interpretation will be available in:
                <br />
                <span className="font-medium text-foreground">
                  {timeRemaining || "..."}
                </span>
              </p>
            </AlertDescription>
          </div>

          <div className="space-y-2">
            <p className="text-balance text-sm text-muted-foreground">
              Don&apos;t want to wait? Two ways to continue:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <ArrowRightIcon className="mt-1 size-3.5 flex-shrink-0 text-primary" />
                <div className="space-y-0.5">
                  <Link
                    href={{ pathname: "/sign-up" }}
                    className="block text-sm font-medium text-primary hover:text-primary/90"
                  >
                    Start your free dream journal
                  </Link>
                  <span className="block text-xs text-muted-foreground">
                    to save this dream for later
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRightIcon className="mt-1 size-3.5 flex-shrink-0 text-primary" />
                <div className="space-y-0.5">
                  <Link
                    href="/#pricing"
                    className="block text-sm font-medium text-primary hover:text-primary/90"
                  >
                    Get credits
                  </Link>
                  <span className="block text-xs text-muted-foreground">
                    for instant dream analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Input Section */}
      <div className="space-y-2">
        <Textarea
          id={textareaId}
          ref={textareaRef}
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I found myself walking through a forest at night..."
          className={cn(
            "min-h-[150px] resize-none",
            !rateLimitInfo.isAllowed && "opacity-70"
          )}
          disabled={isAnalyzing || !rateLimitInfo.isAllowed}
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
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Analyzing Dream...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 size-4" />
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
