import Link from "next/link";
import { usePathname } from "next/navigation";

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

import DeleteDreamDialog from "@/components/shared/delete-dream-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import copyToClipboard from "@/utils/copy-to-clipboard";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function DreamCardActions({
  _id,
  isPublic,
}: {
  _id: string;
  isPublic?: boolean;
}) {
  const { isSignedIn, session } = useSession();
  const userId = session?.user?.id;
  const pathname = usePathname();
  const isAnalysisPage = pathname === `/dreams/${_id}`;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
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
        <DropdownMenuItem disabled className="space-x-2">
          <div>
            <PencilIcon size={16} />
          </div>
          <span>Edit</span>
          <Badge variant={"secondary"} className="text-xs">
            Coming Soon
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDreamDialog dreamId={_id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
