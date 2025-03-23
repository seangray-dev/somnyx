import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useMutation } from "convex/react";
import { Trash2Icon, UndoIcon } from "lucide-react";
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
import { Id } from "@/convex/_generated/dataModel";

interface DeleteDreamDialogProps {
  dreamId: string;
}

export function DeleteDreamDialog({ dreamId }: DeleteDreamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteDream = useMutation(api.mutations.dreams.deleteDream);
  const cancelScheduledDeletion = useMutation(
    api.mutations.dreams.cancelScheduledDeletion
  );
  const isDreamPage = usePathname() === "/dreams";
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const taskId = await deleteDream({
        id: dreamId as Id<"dreams">,
      });

      let isCancelled = false;

      const toastId = toast.loading("Dream will be deleted in 10 seconds", {
        duration: 10 * 1000,
        action: (
          <Button
            onClick={() => {
              isCancelled = true;
              cancelScheduledDeletion({ taskId });
              toast.success("Cancelled deletion");
              toast.dismiss(toastId);
            }}
            variant="ghost"
            className="ml-auto flex items-center gap-2 text-xs"
            size="sm"
          >
            <UndoIcon size={16} />
            <span>Undo</span>
          </Button>
        ),
      });

      let secondsLeft = 10;
      const countdownInterval = setInterval(() => {
        if (isCancelled) {
          clearInterval(countdownInterval);
        } else {
          secondsLeft -= 1;
          toast.loading(`Dream will be deleted in ${secondsLeft} seconds`, {
            id: toastId,
          });

          if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
          }
        }
      }, 1000);

      setTimeout(() => {
        if (!isCancelled) {
          toast.success("Dream deleted successfully!");
          toast.dismiss(toastId);
        }
      }, 10 * 1000);

      setIsOpen(false);
      if (isDreamPage) router.push("/dashboard");
    } catch (err) {
      setIsOpen(true);
      toast.error("Uh oh! Something went wrong.", {
        description: "We couldn't delete your dream. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="flex w-full items-center gap-2 rounded px-2 py-1 text-sm text-destructive transition-all duration-150 hover:bg-destructive hover:text-destructive-foreground">
        <Trash2Icon size={16} />
        <span>Delete</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            Are you sure you want to delete this dream?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            dream and all its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          <LoadingButton
            isLoading={isLoading}
            onClick={() => handleDelete()}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
