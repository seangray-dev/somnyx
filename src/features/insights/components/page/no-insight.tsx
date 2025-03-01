import Image from "next/image";
import { useRouter } from "next/navigation";

import { format, parse } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import LoadingButton from "@/components/shared/loading-button";
import { CREDIT_COSTS } from "@/convex/util";
import useUserCredits from "@/features/credits/api/use-user-credits";

import { useGenerateInsight } from "../../api/use-generate-insight";

export default function NoInsight({ monthYear }: { monthYear: string }) {
  const { generate, isGenerating } = useGenerateInsight();
  const { data: credits } = useUserCredits();
  const hasSufficientCredits = credits && credits >= CREDIT_COSTS.INSIGHT;
  const router = useRouter();

  async function handleGenerateInsight() {
    if (!hasSufficientCredits) {
      toast.error("Insufficient credits", {
        description: "Please purchase more credits to generate insights.",
      });
      return;
    }

    try {
      await generate(monthYear);
      toast.success("Generating your insight!", {
        description: "This may take a minute...",
      });
    } catch (error: any) {
      console.error("Insight generation error:", error);

      // Handle specific error cases
      if (error.message?.includes("need more than one dream")) {
        toast.error("More dreams needed", {
          description:
            "You need at least two dreams in a month to generate insights.",
        });
      } else if (error.message?.includes("insufficient credits")) {
        toast.error("Insufficient credits", {
          description: "Please purchase more credits to generate insights.",
        });
      } else if (error.message?.includes("Failed to schedule")) {
        toast.error("Scheduling failed", {
          description:
            "Unable to schedule insight generation. Please try again.",
        });
      } else {
        toast.error("Failed to generate insight", {
          description:
            "Please try again later or contact support if the issue persists.",
        });
      }
    }
  }

  async function handleRedirectToPricing() {
    toast.error("Not enough credits", {
      description: (
        <p className="text-balance">
          Please purchase more credits to generate an insight.
        </p>
      ),
      action: {
        label: "Purchase",
        onClick: () => {
          router.push("/#pricing");
        },
      },
    });
  }

  const formattedMonthYear = format(
    parse(monthYear, "MM-yyyy", new Date()),
    "MMMM yyyy"
  );

  if (isGenerating) {
    return (
      <div className="container flex flex-1 items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2Icon size={32} className="animate-spin" />
          <div className="font-medium">Generating Your Monthly Insight</div>
          <div className="text-sm text-muted-foreground">
            This may take a minute...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-4 text-balance text-center">
      <Image
        src="/images/sleeping.svg"
        alt="No Insight"
        width={100}
        height={100}
      />
      <div>
        It looks like you don&apos;t have an insight for{" "}
        <span className="font-bold">{formattedMonthYear}</span> yet.
      </div>
      <div className="w-full">
        <LoadingButton
          size={"lg"}
          className="w-full capitalize sm:w-fit"
          isLoading={isGenerating}
          disabled={isGenerating}
          onClick={
            hasSufficientCredits
              ? handleGenerateInsight
              : handleRedirectToPricing
          }
        >
          <div>
            <span>
              Get your {formattedMonthYear} <br className="sm:hidden" /> dreams
              insight{" "}
            </span>
            <span>({CREDIT_COSTS.INSIGHT} credits)</span>
          </div>
        </LoadingButton>
      </div>
    </div>
  );
}
