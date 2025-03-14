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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/config/app";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { useDreamAccess } from "../../api/use-dream-access";
import { useUpdateDream } from "../../api/use-update-dream";
import AddDreamButton from "../dream-form/add-dream-button";
import { DeleteDreamDialog } from "./delete-dream-dialog";
import ShareLinks from "./share-links";

export default function DreamCardActions({ dream }: { dream: Doc<"dreams"> }) {
  const pathname = usePathname();
  const isAnalysisPage = pathname === `/dreams/${dream?.date}/${dream?.slug}`;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { hasAccess, isSignedIn } = useDreamAccess(dream?._id as string);
  const updateDream = useUpdateDream();
  const isPublic = dream?.isPublic;

  const handleTogglePublic = async () => {
    await updateDream({
      id: dream?._id as Id<"dreams">,
      isPublic: !isPublic,
    });
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
          <Link href={{ pathname: `/dreams/${dream?.date}/${dream?.slug}` }}>
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={!isPublic}
            className={cn(
              "flex items-center gap-2",
              !isPublic && "cursor-not-allowed opacity-50"
            )}
          >
            <Share2Icon size={16} />
            <span>Share</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <ShareLinks
                url={`${baseUrl}/dreams/${dream?.date}/${dream?.slug}`}
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
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
          <DeleteDreamDialog dreamId={dream?._id as string} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
