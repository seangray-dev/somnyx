import Logo from "@/components/shared/logo";

import HeaderActions from "./header-actions";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-t-4 border-t-primary bg-background/90 py-3 backdrop-blur">
      <nav className="container flex items-center justify-between">
        <Logo />
        <HeaderActions />
      </nav>
    </header>
  );
}
