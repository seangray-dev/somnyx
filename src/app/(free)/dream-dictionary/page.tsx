import { Metadata } from "next";

import { baseUrl } from "@/config/app";
import Content from "@/features/dream-dictionary/components/content";
import HeaderSection from "@/features/dream-dictionary/components/header-section";
import SearchInput from "@/features/dream-dictionary/components/search-input";

export default function Page() {
  return (
    <div className="container flex flex-1 flex-col py-20">
      <HeaderSection />
      <SearchInput />
      <Content />
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: `${baseUrl}/dream-dictionary`, // Always point to main page
    },
    robots: {
      index: !searchParams.q, // only index main page, not search results
      follow: true,
    },
  };
}
