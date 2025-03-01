import { useState } from "react";

import { SparklesIcon } from "lucide-react";

import { AddNewDreamForm } from "@/components/shared/add-new-dream-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AddDreamButtonProps = {
  isTab?: boolean;
};

export function AddDreamButton(props: AddDreamButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isTab = props.isTab;

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isTab ? (
          <button className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
            <SparklesIcon className="size-5" />
            <span>New Dream</span>
          </button>
        ) : (
          <Button className="flex items-center gap-2" size={"sm"}>
            <SparklesIcon className="size-4" />
            <span>New Dream</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Capture Your Dream</DialogTitle>
          <DialogDescription>
            Record your dream while it's fresh. Each detail helps unlock deeper
            insights into your subconscious.
          </DialogDescription>
        </DialogHeader>
        <AddNewDreamForm
          closeDialog={closeDialog}
          minDate={new Date(2024, 7, 1)}
        />
      </DialogContent>
    </Dialog>
  );
}
