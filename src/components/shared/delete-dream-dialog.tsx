import { useState } from "react";

import { useMutation } from "convex/react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import LoadingButton from "./loading-button";

type DeleteDreamDialogProps = {
  dreamId: string;
};

export default function DeleteDreamDialog(props: DeleteDreamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteDream = useMutation(api.mutations.dreams.deleteDream);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteDream({
        id: props.dreamId as Id<"dreams">,
      });
      toast.success("Dream deleted successfully!");
      setIsOpen(false);
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
