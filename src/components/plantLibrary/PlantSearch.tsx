import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const PlantSearch = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  return (
    <div className="mb-8 max-w-md space-y-2">
      <div className="group relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground "
          aria-hidden="true"
        />
        <Input
          id="plant-library-search"
          type="search"
          className="h-11 rounded-xl pl-10 pr-3 transition-colors hover:border-primary/50"
          placeholder="Search plants..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
    </div>
  );
};
