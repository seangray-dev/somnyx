import JournalEntries from "@/components/journal/entries";

export default function JournalPage() {
  return (
    <div className="container flex flex-1 flex-col gap-6">
      <JournalEntries />
    </div>
  );
}
