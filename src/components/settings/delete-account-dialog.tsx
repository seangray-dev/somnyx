"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";

import { Checkbox } from "@/components//ui/checkbox";
import LoadingButton from "@/components/shared/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const feedbackOptions = [
  "No longer needed or relevant",
  "Privacy or data security concerns",
  "Issues or bugs with the product",
  "Found a better alternative",
  "Taking a temporary break",
];

export default function DeleteAccountDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const deleteAccount = useAction(api.mutations.deleteAccount);
  const deleteAllUserDreams = useMutation(
    api.mutations.dreams.deleteAllUserDreams
  );
  const collectFeedback = useMutation(
    api.mutations.collectDeleteAccountFeedback
  );
  const router = useRouter();

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : [...prev, reason]
    );
  };

  async function handleDelete() {
    setIsLoading(true);
    try {
      await collectFeedback({ reasons: selectedReasons, feedback });
      await deleteAllUserDreams();
      await deleteAccount();
      setIsOpen(false);
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (err) {
      toast.error("Uh oh! Something went wrong.", {
        description: "We couldn't delete your account. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and it&apos;s associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-6 text-sm font-medium">
          <div className="space-y-2">
            <div>Select the reasons for deleting your account:</div>
            <div className="space-y-2 font-normal">
              {feedbackOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={option}
                    checked={selectedReasons.includes(option)}
                    onCheckedChange={() => toggleReason(option)}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="resize-none"
            placeholder="Any additional feedback?"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            className="min-w-20"
            variant={"destructive"}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Delete Account
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
