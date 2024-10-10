import Link from "next/link";

import { EllipsisIcon, OrbitIcon, Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/config/app";
import copyToClipboard from "@/utils/copy-to-clipboard";

import DeleteDreamDialog from "../shared/delete-dream-dialog";

export default function DreamCardActions({
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
        <DropdownMenuItem asChild>
          <Link
            href={{ pathname: `/dreams/${_id}` }}
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <OrbitIcon size={16} />
            <span>Analysis</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!isPublic}
          className="flex items-center gap-2"
          onClick={() => copyToClipboard(`${baseUrl}/dreams/${_id}`)}
        >
          <Share2Icon size={16} />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDreamDialog dreamId={_id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
