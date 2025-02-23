import {
  BookOpenIcon,
  CogIcon,
  Globe2Icon,
  HelpCircleIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  NotebookPenIcon,
  SparklesIcon,
} from "lucide-react";

type LinkVisibility = "public" | "private" | "both";

interface NavLink {
  label: string;
  href: string;
  icon: JSX.Element;
  visibility: LinkVisibility;
}

export const navigationLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon size={16} />,
    visibility: "both",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={16} />,
    visibility: "private",
  },
  {
    label: "Journal",
    href: "/journal",
    icon: <LibraryBigIcon size={16} />,
    visibility: "private",
  },
  {
    label: "Dreamscape",
    href: "/dreamscape",
    icon: <Globe2Icon size={16} />,
    visibility: "both",
  },
  {
    label: "Dictionary",
    href: "/dream-dictionary",
    icon: <BookOpenIcon size={16} />,
    visibility: "both",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: <NotebookPenIcon size={16} />,
    visibility: "both",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <CogIcon size={16} />,
    visibility: "private",
  },
  {
    label: "Interpret",
    href: "/interpret",
    icon: <SparklesIcon size={16} />,
    visibility: "public",
  },
  {
    label: "Support",
    href: "/support",
    icon: <HelpCircleIcon size={16} />,
    visibility: "public",
  },
];

// Helper functions to filter links
export const getPublicLinks = () =>
  navigationLinks.filter(
    (link) => link.visibility === "public" || link.visibility === "both"
  );

export const getPrivateLinks = () =>
  navigationLinks.filter(
    (link) => link.visibility === "private" || link.visibility === "both"
  );
