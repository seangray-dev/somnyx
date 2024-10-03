import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddNewDreamForm } from "./add-new-dream-form";

export function AddDreamButton() {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Dream</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new dream</DialogTitle>
          <DialogDescription>
            Please provide details about your dream.
          </DialogDescription>
        </DialogHeader>
        <AddNewDreamForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
