import { Doc, Id } from "@/convex/_generated/dataModel";

export type Dream = Doc<"dreams">;

export interface DreamFormData {
  date: Date;
  isRecurring: boolean;
  isLucid: boolean;
  emotions: Id<"emotions">[];
  role: Id<"roles">;
  people?: string[];
  places?: string[];
  things?: string[];
  details: string;
  withAnalysis: boolean;
}

export interface DreamCardActionsProps {
  _id: string;
  isPublic?: boolean;
  dream?: Dream;
}

export interface AddDreamButtonProps {
  isTab?: boolean;
  editMode?: boolean;
  setIsDropdownOpen?: (isOpen: boolean) => void;
  initialData?: Dream;
  trigger?: React.ReactNode;
}
