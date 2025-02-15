"use client";

import { useCallback, useState } from "react";

import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import LoadingButton from "@/components/shared/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

import { useFeedbackForm } from "../hooks/use-feedback-form";

interface FeedbackDialogProps {
  type: "feedback" | "issue";
  trigger: React.ReactNode;
  className?: string;
}

export default function FeedbackDialog({
  type,
  trigger,
  className,
}: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useFeedbackForm(type);
  // @ts-ignore
  const submit = useMutation(api.mutations.feedback.submit);

  const onSubmit = useCallback(
    async (values: any) => {
      try {
        await submit(values);
        form.reset();
        setIsOpen(false);
        toast.success(
          type === "feedback"
            ? "Thank you for your feedback!"
            : "Issue reported successfully!"
        );
      } catch (error) {
        toast.error("Failed to submit. Please try again.");
      }
    },
    [form, submit, type]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>
            {type === "feedback" ? "Share Feedback" : "Report an Issue"}
          </DialogTitle>
          <DialogDescription>
            {type === "feedback"
              ? "We value your thoughts and suggestions on how we can improve."
              : "Help us understand the issue you're experiencing."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        type === "feedback"
                          ? "Share your thoughts..."
                          : "Describe the issue you're experiencing..."
                      }
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "issue" && (
              <div className="space-y-4">
                <h4 className="font-sans font-medium">Device Information</h4>
                <div className="space-y-4 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name="deviceInfo.deviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Desktop, Mobile, Tablet"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deviceInfo.browser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Browser</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Chrome, Safari, Firefox"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deviceInfo.os"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating System</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., iOS 15, Windows 11, macOS Sonoma"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <LoadingButton
                type="submit"
                disabled={form.formState.isSubmitting}
                isLoading={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
