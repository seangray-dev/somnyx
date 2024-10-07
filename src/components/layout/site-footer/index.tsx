import Link from "next/link";

import Logo from "@/components/shared/logo";

import {
  companyLinks,
  contactLinks,
  legalLinks,
  resourcesLinks,
} from "./footer-links";

export default function SiteFooter() {
  return (
    <footer className="border-t pb-28 pt-10 sm:py-10">
      <div className="container flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Logo />
        <div className="flex flex-wrap justify-between gap-8 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <h3 className="font-semibold text-foreground">Company</h3>
            {companyLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-foreground">Resources</h3>
            {resourcesLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-foreground">Legal</h3>
            {legalLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-foreground">Contact</h3>
            {contactLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
