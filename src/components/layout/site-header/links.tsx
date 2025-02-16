import {
  BookOpenIcon,
  CogIcon,
  HelpCircleIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
} from "lucide-react";

export const links = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon size={16} />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={16} />,
  },
  { label: "Journal", href: "/journal", icon: <LibraryBigIcon size={16} /> },
  {
    label: "Dictionary",
    href: "/dream-dictionary",
    icon: <BookOpenIcon size={16} />,
  },
  { label: "Settings", href: "/settings", icon: <CogIcon size={16} /> },
  { label: "Support", href: "/support", icon: <HelpCircleIcon size={16} /> },
];
