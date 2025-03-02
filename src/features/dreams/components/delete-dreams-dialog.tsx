"use client";

import { useState } from "react";

import { useMutation } from "convex/react";
import { toast } from "sonner";

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

export default function DeleteDreamsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteAllUserDreams = useMutation(
    // @ts-ignore
    api.mutations.dreams.deleteAllUserDreams
  );

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteAllUserDreams();
      setIsOpen(false);
      toast.success("All dreams deleted successfully");
    } catch (err) {
      toast.error("Uh oh! Something went wrong.", {
        description: "We couldn't delete your dreams. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Dreams</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all of
            your dreams and it&apos;s associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            className="min-w-20"
            variant={"destructive"}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
