import {
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  Share2Icon,
} from "lucide-react";

import DeleteDreamDialog from "@/components/shared/delete-dream-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import copyToClipboard from "@/utils/copy-to-clipboard";

import { Button } from "../ui/button";

export default function AboutDreamActions({
  _id,
  isPublic,
}: {
  _id: string;
  isPublic?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="space-x-2">
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
        <DropdownMenuItem className="space-x-2">
          <div>
            <PencilIcon size={16} />
          </div>
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDreamDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
