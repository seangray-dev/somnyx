import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  OrbitIcon,
  PencilIcon,
  Share2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/config/app";
import { Id } from "@/convex/_generated/dataModel";
import copyToClipboard from "@/utils/copy-to-clipboard";

import { useDreamAccess } from "../../api/use-dream-access";
import { useUpdateDream } from "../../api/use-update-dream";
import { DreamCardActionsProps } from "../../types";
import AddDreamButton from "../dream-form/add-dream-button";
import { DeleteDreamDialog } from "./delete-dream-dialog";

export default function DreamCardActions({
  _id,
  isPublic,
  dream,
}: DreamCardActionsProps) {
  const pathname = usePathname();
  const isAnalysisPage = pathname === `/dreams/${_id}`;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { hasAccess, isSignedIn } = useDreamAccess(_id);
  const updateDream = useUpdateDream();

  const handleTogglePublic = async () => {
    await updateDream({ id: _id as Id<"dreams">, isPublic: !isPublic });
  };

  if (!hasAccess || !isSignedIn) {
    return null;
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <EllipsisIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!isAnalysisPage && (
          <Link href={{ pathname: `/dreams/${_id}` }}>
            <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer hover:underline">
              <OrbitIcon size={16} />
              <span>Analysis</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem
          className="space-x-2"
          onClick={() => handleTogglePublic()}
        >
          <div>
            {isPublic ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </div>
          <span>{isPublic ? "Make Private" : "Make Public"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!isPublic}
          className="flex items-center gap-2"
          onClick={() => copyToClipboard(`${baseUrl}/dreams/${_id}`)}
        >
          <Share2Icon size={16} />
          <span>Share</span>
        </DropdownMenuItem>
        {isAnalysisPage && (
          <AddDreamButton
            editMode
            initialData={dream}
            setIsDropdownOpen={(isOpen) => {
              if (isOpen) setIsDropdownOpen(false);
            }}
            trigger={
              <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <PencilIcon size={16} />
                <span>Edit Dream</span>
              </button>
            }
          />
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDreamDialog dreamId={_id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
