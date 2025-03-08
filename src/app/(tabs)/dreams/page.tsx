import { DreamCalendar } from "@/features/dream-archive/components/dream-calendar";
import Header from "@/features/dream-archive/components/header";

export default function DreamArchivePage() {
  return (
    <div className="container">
      <Header />
      <DreamCalendar />
    </div>
  );
}
