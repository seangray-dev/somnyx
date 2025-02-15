"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";
import { RefreshCcwIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/shared/loader";
import LoadingButton from "@/components/shared/loading-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CREDIT_COSTS } from "@/convex/util";
import useDreamAnalysis from "@/features/analysis/api/use-dream-analysis";
import useUserCredits from "@/features/credits/api/use-user-credits";
import { useGetAnalysisImageUrl } from "@/hooks/use-convex-image";
import { cn } from "@/lib/utils";

type AnalysisProps = {
  dreamId: string;
};

const renderSection = (
  title: string,
  content: string | undefined,
  isLoading: boolean
) => (
  <div>
    <h4 className="text-xl font-bold">{title}</h4>
    {isLoading ? (
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    ) : content ? (
      <div className="text-muted-foreground">{content}</div>
    ) : (
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    )}
  </div>
);

const ImageSkeleton = () => (
  <div className="mx-auto max-w-lg pb-10">
    <div className="aspect-square size-[500px] w-full animate-pulse overflow-hidden rounded-sm bg-muted" />
  </div>
);

const AnalysisImage = ({ url }: { url: string }) => (
  <div className="mx-auto max-w-lg pb-10">
    <Image
      src={url}
      alt="Analysis"
      width={512}
      height={512}
      className="w-full rounded-sm object-cover"
      priority
    />
  </div>
);

const RegenerateImageSection = ({
  onRegenerate,
  isRegenerating,
  hasError,
}: {
  onRegenerate: () => void;
  isRegenerating: boolean;
  hasError: boolean;
}) => (
  <div className="mx-auto max-w-lg pb-10">
    <div className="aspect-square size-[384px] w-full animate-pulse overflow-hidden rounded-md bg-muted" />
    <div className="mt-4 flex flex-col items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="gap-2"
      >
        <RefreshCcwIcon
          size={16}
          className={cn(isRegenerating && "animate-spin")}
        />
        {isRegenerating ? "Regenerating..." : "Regenerate Image"}
      </Button>
      {hasError && (
        <p className="text-sm text-destructive">
          There was an issue generating the image. Please try again.
        </p>
      )}
    </div>
  </div>
);

export default function AnalysisCard({ dreamId }: AnalysisProps) {
  const {
    data: analysis,
    isLoading,
    noAnalysis,
  } = useDreamAnalysis({
    dreamId,
  });
  const [generateAnalyisLoading, setGenerateAnalyisLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: userCredits } = useUserCredits();
  const imageUrl = useGetAnalysisImageUrl(analysis?.imageStorageId);
  const user = useQuery(api.users.getMyUser);
  const hasSufficientCredits = userCredits! >= CREDIT_COSTS.ANALYSIS;
  const neededCredits = CREDIT_COSTS.ANALYSIS - userCredits!;
  const generateAnalyis = useMutation(api.mutations.generateAnalysis);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const regenerateImage = useAction(
    api.mutations.openai.regenerateAnalysisImage
  );

  const handleGenerateAnalysis = async () => {
    setGenerateAnalyisLoading(true);
    await generateAnalyis({
      dreamId: dreamId as Id<"dreams">,
      userId: user?.userId!,
    });
    setGenerateAnalyisLoading(false);
  };

  const handleRegenerateImage = async () => {
    try {
      setIsRegeneratingImage(true);
      setImageError(false);
      await regenerateImage({
        dreamId: dreamId as Id<"dreams">,
        analysisId: analysis?._id as Id<"analysis">,
      });
      toast.success("Image generation started");
    } catch (error) {
      setImageError(true);
      toast.error("Failed to regenerate image");
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 pt-4 text-muted-foreground">
          <Loader />
          <p className="text-center text-sm">Analyzing your dream...</p>
        </div>
      );
    }

    if (noAnalysis) {
      return (
        <div className="flex flex-col gap-8">
          <p className="text-muted-foreground">
            No analysis was generated for this dream yet.
          </p>
          {!hasSufficientCredits ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                href={"/#pricing"}
                className={buttonVariants({ variant: "default" })}
              >
                Purchase Credits
              </Link>
              <p className="text-sm">
                You need {neededCredits} more credits to analyze this dream.
              </p>
            </div>
          ) : (
            <LoadingButton
              disabled={generateAnalyisLoading}
              isLoading={generateAnalyisLoading}
              onClick={handleGenerateAnalysis}
            >
              <SparklesIcon size={16} className="mr-2" />
              Analyze Dream ({CREDIT_COSTS.ANALYSIS} Credits)
            </LoadingButton>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-[80ch] text-muted-foreground">
        {analysis?.summary}
      </div>
    );
  };

  const renderImageSection = () => {
    if (isLoading) {
      return <ImageSkeleton />;
    }

    if (imageUrl) {
      return <AnalysisImage url={imageUrl} />;
    }

    if (!imageUrl && !noAnalysis) {
      return (
        <RegenerateImageSection
          onRegenerate={handleRegenerateImage}
          isRegenerating={isRegeneratingImage}
          hasError={imageError}
        />
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        {renderImageSection()}
        <CardTitle className="mx-auto text-center text-3xl">Analysis</CardTitle>
        <CardDescription className="mx-auto text-balance text-center text-base">
          {renderContent()}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 text-pretty pt-4 md:grid-cols-2">
        {renderSection(
          "Emotional Breakdown",
          analysis?.emotionalBreakdown,
          isLoading
        )}
        {renderSection(
          "Symbolic Interpretation",
          analysis?.symbolicInterpretation,
          isLoading
        )}
        {renderSection(
          "Underlying Message",
          analysis?.underlyingMessage,
          isLoading
        )}
        {renderSection(
          "Actionable Takeaway",
          analysis?.actionableTakeaway,
          isLoading
        )}
      </CardContent>
    </Card>
  );
}
