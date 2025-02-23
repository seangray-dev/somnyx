import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "recent" | "random";

interface SortSelectorProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export function SortSelector({ value, onValueChange }: SortSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Most Recent</SelectItem>
        <SelectItem value="random">Random</SelectItem>
      </SelectContent>
    </Select>
  );
}
