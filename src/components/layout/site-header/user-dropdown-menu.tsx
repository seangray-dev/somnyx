import Link from "next/link";

import { SignOutButton } from "@clerk/nextjs";
import {
  BookOpenIcon,
  CogIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";

import UserAvatar from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useUserCredits from "@/features/credits/api/use-user-credits";
import { useSession } from "@/lib/client-auth";

export default function UserDropdownMenu() {
  const { session } = useSession();
  const user = session?.user;
  const fullName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress;
  const { data: credits, isLoading } = useUserCredits();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboardIcon size={16} />,
    },
    { label: "Journal", href: "/journal", icon: <BookOpenIcon size={16} /> },
    { label: "Settings", href: "/settings", icon: <CogIcon size={16} /> },
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
          <div className="flex items-center gap-2 pt-2">
            <HandCoinsIcon size={16} />
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span>{credits} Credits</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => (
          <DropdownMenuItem key={link.label} asChild>
            <Link
              className="flex w-full cursor-pointer items-center gap-2 text-sm"
              href={{ pathname: link.href }}
            >
              {link.icon}
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
