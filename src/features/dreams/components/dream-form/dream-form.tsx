"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isBefore } from "date-fns";
import { SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingButton from "@/components/shared/loading-button";
import { Form } from "@/components/ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { CREDIT_COSTS } from "@/convex/util";
import { createDreamEvent } from "@/features/_analytics/events/dreams";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";
import useUserCredits from "@/features/credits/api/use-user-credits";

import { useAddDream } from "../../api/use-add-dream";
import { useUpdateDream } from "../../api/use-update-dream";
import { Dream } from "../../types";
import { DateSection } from "./date-section";
import { DetailsSection } from "./details-section";
import { DreamTypeSection } from "./dream-type-section";
import { EmotionsSection } from "./emotions-section";
import { MetadataSection } from "./metadata-section";
import { RoleSection } from "./role-section";

const FormSchema = z.object({
  date: z
    .date({ required_error: "Please select a date" })
    .refine((date) => !isBefore(date, new Date(2024, 7, 1)), {
      message: "Dreams can only be logged from August 2024 onwards.",
    }),
  isRecurring: z.boolean().default(false),
  isLucid: z.boolean().default(false),
  emotions: z
    .array(z.custom<Id<"emotions">>())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one emotion.",
    }),
  role: z.custom<Id<"roles">>(),
  people: z.array(z.string()).optional(),
  places: z.array(z.string()).optional(),
  things: z.array(z.string()).optional(),
  details: z
    .string({ required_error: "Details cannot be empty" })
    .min(50, {
      message: "Details must be at least 50 characters long.",
    })
    .max(2000, {
      message: "Details must not exceed 2000 characters.",
    }),
  withAnalysis: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

interface DreamFormProps {
  editMode?: boolean;
  initialData?: Dream;
  closeDialog: () => void;
  minDate: Date;
  setIsDropdownOpen?: (isOpen: boolean) => void;
}

export function DreamForm({
  editMode,
  initialData,
  closeDialog,
  minDate,
  setIsDropdownOpen,
}: DreamFormProps) {
  const { data: userCredits } = useUserCredits();
  const { addDream } = useAddDream();
  const updateDream = useUpdateDream();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { track } = useAnalytics();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: editMode && initialData ? new Date(initialData.date) : new Date(),
      isRecurring: editMode && initialData ? initialData.isRecurring : false,
      isLucid: editMode && initialData ? initialData.isLucid : false,
      emotions: editMode && initialData ? initialData.emotions : [],
      role: editMode && initialData ? initialData?.role : undefined,
      people: editMode && initialData ? initialData.people : [],
      places: editMode && initialData ? initialData.places : [],
      things: editMode && initialData ? initialData.things : [],
      details: editMode && initialData ? initialData.details : "",
      withAnalysis: false,
    },
  });

  const canAddDreamWithAnalysis = userCredits! >= CREDIT_COSTS.ANALYSIS;

  async function onSubmit(data: FormValues) {
    const isAnalyzing = data.withAnalysis;
    try {
      if (isAnalyzing) {
        setIsAnalyzing(true);
      } else {
        setIsSaving(true);
      }

      if (editMode && initialData) {
        const success = await updateDream({
          id: initialData._id,
          date: initialData.date,
          isRecurring: data.isRecurring,
          isLucid: data.isLucid,
          emotions: data.emotions,
          role: data.role,
          people: data.people,
          places: data.places,
          things: data.things,
          details: data.details,
        });

        if (success) {
          closeDialog();
          form.reset();
          setIsDropdownOpen?.(false);
        }
      } else {
        const success = await addDream(data);
        if (success) {
          const event = data.withAnalysis
            ? createDreamEvent("ANALYZED", {
                dreamLength: data.details.length,
                isLucid: data.isLucid,
                isRecurring: data.isRecurring,
                emotionCount: data.emotions.length,
              })
            : createDreamEvent("SAVED", {
                dreamLength: data.details.length,
                isLucid: data.isLucid,
                isRecurring: data.isRecurring,
                emotionCount: data.emotions.length,
              });
          await track(event);
          closeDialog();
          form.reset();
        }
      }
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <DetailsSection form={form} editMode={editMode} />
        <DateSection form={form} minDate={minDate} editMode={editMode} />
        <DreamTypeSection form={form} editMode={editMode} />
        <EmotionsSection form={form} editMode={editMode} />
        <RoleSection form={form} editMode={editMode} />
        <MetadataSection form={form} editMode={editMode} />

        <div className="flex flex-col gap-2 pt-4">
          {!editMode && (
            <>
              <LoadingButton
                disabled={!canAddDreamWithAnalysis}
                isLoading={isAnalyzing}
                className="w-full"
                onClick={() => {
                  form.setValue("withAnalysis", true);
                }}
              >
                <SparklesIcon size={16} className="mr-2" />
                Analyze Dream ({CREDIT_COSTS.ANALYSIS} Credits)
              </LoadingButton>
              <p className="text-center text-xs text-muted-foreground">
                AI-powered analysis helps you understand the deeper meaning of
                your dreams
              </p>
              {!canAddDreamWithAnalysis && (
                <p className="text-center text-sm text-muted-foreground">
                  Save your dream now and unlock AI analysis later when you have
                  enough credits
                </p>
              )}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
            </>
          )}
          <LoadingButton
            variant={editMode ? "default" : "secondary"}
            isLoading={isSaving}
            className="w-full"
            onClick={() => {
              form.setValue("withAnalysis", false);
            }}
          >
            {editMode ? "Save Changes" : "Save Dream"}
          </LoadingButton>
          {!editMode && (
            <p className="text-center text-xs text-muted-foreground">
              Your dream will be safely stored and ready for analysis whenever
              you choose
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
