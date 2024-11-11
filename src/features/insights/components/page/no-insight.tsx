import Image from "next/image";

import { format, parse } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import LoadingButton from "@/components/shared/loading-button";
import { CREDIT_COSTS } from "@/convex/util";

import { useGenerateInsight } from "../../api/use-generate-insight";

export default function NoInsight({ monthYear }: { monthYear: string }) {
  const { generate, isGenerating } = useGenerateInsight();
  // const hasSufficientCredits = useHasSufficientCredits();

  async function handleGenerateInsight() {
    try {
      await generate(monthYear);
      toast.success("Insight is being generated...", {
        description: "Hang tight while we generate your insight.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating the insight.");
    }
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
          onClick={handleGenerateInsight}
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
