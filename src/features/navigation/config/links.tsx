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

import { NavLink } from "../types";

/**
 * Navigation Links Configuration
 *
 * Visibility types:
 * - "public": Only shown to logged out users
 * - "private": Only shown to logged in users
 * - "both": Shown to all users
 */
export const navigationLinks: NavLink[] = [
  // Core navigation
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon size={16} />,
    visibility: "both",
  },

  // Authenticated user features
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
    label: "Settings",
    href: "/settings",
    icon: <CogIcon size={16} />,
    visibility: "private",
  },

  // Public features
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
    label: "Dream Interpretation",
    href: "/free-dream-interpretation",
    icon: <SparklesIcon size={16} />,
    visibility: "public",
  },

  // Support & Help
  {
    label: "Support",
    href: "/support",
    icon: <HelpCircleIcon size={16} />,
    visibility: "both",
  },
];

/**
 * Helper function to get links visible to logged out users
 * Returns links with visibility "public" or "both"
 */
export const getPublicLinks = () =>
  navigationLinks.filter(
    (link) => link.visibility === "public" || link.visibility === "both"
  );

/**
 * Helper function to get links visible to logged in users
 * Returns links with visibility "private" or "both"
 */
export const getPrivateLinks = () =>
  navigationLinks.filter(
    (link) => link.visibility === "private" || link.visibility === "both"
  );
