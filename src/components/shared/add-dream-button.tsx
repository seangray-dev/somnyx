import { useState } from "react";

import { PencilIcon, SparklesIcon } from "lucide-react";

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
import { Doc } from "@/convex/_generated/dataModel";

type AddDreamButtonProps = {
  isTab?: boolean;
  editMode?: boolean;
  setIsDropdownOpen?: (isOpen: boolean) => void;
  initialData?: Doc<"dreams">;
  trigger?: React.ReactNode;
};

export function AddDreamButton(props: AddDreamButtonProps) {
  const { isTab, editMode, initialData, trigger, setIsDropdownOpen } = props;
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => setIsOpen(false);

  const renderTrigger = () => {
    if (trigger) return trigger;

    if (editMode) {
      return (
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <PencilIcon className="size-4" />
          <span>Edit Dream</span>
        </Button>
      );
    }

    if (isTab) {
      return (
        <button className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
          <SparklesIcon className="size-5" />
          <span>New Dream</span>
        </button>
      );
    }

    return (
      <Button className="flex items-center gap-2" size={"sm"}>
        <SparklesIcon className="size-4" />
        <span>New Dream</span>
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Dream" : "Capture Your Dream"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update your dream details below."
              : "Record your dream while it's fresh. Each detail helps unlock deeper insights into your subconscious."}
          </DialogDescription>
        </DialogHeader>
        <AddNewDreamForm
          setIsDropdownOpen={setIsDropdownOpen}
          closeDialog={closeDialog}
          minDate={new Date(2024, 7, 1)}
          editMode={editMode}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
