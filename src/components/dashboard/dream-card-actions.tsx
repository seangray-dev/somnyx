import Link from "next/link";

import { EllipsisIcon, OrbitIcon, Share2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import DeleteDreamDialog from "./delete-dream-dialog";

export default function DreamCardActions({ _id }: { _id: string }) {
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
        <DropdownMenuItem disabled className="flex items-center gap-2">
          <Share2Icon size={16} />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDreamDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
