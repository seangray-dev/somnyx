import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  OrbitIcon,
  PencilIcon,
  Share2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { AddDreamButton } from "@/components/shared/add-dream-button";
import DeleteDreamDialog from "@/components/shared/delete-dream-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import copyToClipboard from "@/utils/copy-to-clipboard";

export default function DreamCardActions({
  _id,
  isPublic,
  dream,
}: {
  _id: string;
  isPublic?: boolean;
  dream: Doc<"dreams">;
}) {
  const { isSignedIn, session } = useSession();
  const userId = session?.user?.id;
  const pathname = usePathname();
  const isAnalysisPage = pathname === `/dreams/${_id}`;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // @ts-ignore
  const hasAccessToDream = useQuery(api.queries.dreams.hasAccessToDream, {
    dreamId: _id as Id<"dreams">,
    userId: userId ?? "",
  });

  const updateDream = useMutation(api.mutations.dreams.updateDream);

  const handleTogglePublic = async () => {
    try {
      await updateDream({ id: _id as Id<"dreams">, isPublic: !isPublic });
      toast.success(`Dream is now ${!isPublic ? "public" : "private"}`);
    } catch (err) {
      toast.error(`Failed to make dream ${!isPublic ? "public" : "private"}`);
    }
  };

  if (!hasAccessToDream || !isSignedIn || !session) {
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
