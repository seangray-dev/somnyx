export type LinkVisibility = "public" | "private" | "both";

export interface NavLink {
  label: string;
  href: string;
  icon: JSX.Element;
  visibility: LinkVisibility;
}

export interface HeaderRoute {
  path: string;
  type: "static" | "app";
}
