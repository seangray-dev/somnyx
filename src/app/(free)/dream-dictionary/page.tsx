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
