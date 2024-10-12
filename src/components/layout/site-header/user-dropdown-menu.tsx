import Link from "next/link";

import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

import UserAvatar from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/client-auth";

export default function UserDropdownMenu() {
  const { session } = useSession();
  const user = session?.user;
  const fullName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress;

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Journal", href: "/journal" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          <div>
            <p>{fullName}</p>
            <p>{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => (
          <DropdownMenuItem key={link.label} asChild>
            <Link
              className="flex w-full cursor-pointer items-center gap-2 text-sm"
              href={{ pathname: link.href }}
            >
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <div className="flex items-center gap-2">
              <LogOutIcon size={16} />
              <span>Sign Out</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
