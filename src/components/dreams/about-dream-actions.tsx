import { useMutation } from "convex/react";
import {
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import copyToClipboard from "@/utils/copy-to-clipboard";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function AboutDreamActions({
  _id,
  isPublic,
}: {
  _id: string;
  isPublic?: boolean;
}) {
  const updateDream = useMutation(api.mutations.dreams.updateDream);
  const handleTogglePublic = async () => {
    try {
      await updateDream({ id: _id as Id<"dreams">, isPublic: !isPublic });
      toast.success("Dream is now " + (!isPublic ? "public" : "private"));
    } catch (err) {
      toast.error("Failed to make dream " + (!isPublic ? "public" : "private"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
          onClick={() => copyToClipboard(`http://localhost:3000/dreams/${_id}`)}
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
          <DeleteDreamDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
