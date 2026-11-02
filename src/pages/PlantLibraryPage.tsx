import { Header } from "@/components/plantLibrary/Header";
import { PlantLibraryCard } from "@/components/plantLibrary/PlantLibraryCard";
import { PlantSearch } from "@/components/plantLibrary/PlantSearch";
import { useState } from "react";
import { usePlantSpeciesSearch } from "@/hooks/usePlantSpeciesSearch";

export const PlantLibraryPage = () => {
  const [search, setSearch] = useState("");

  const { plantList, loading, error } = usePlantSpeciesSearch(search);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Header />
      <PlantSearch search={search} setSearch={setSearch} />

      {loading ? (
        <p className="text-muted-foreground">Loading plants...</p>
      ) : error ? (
        <p className="text-destructive">
          Error occurred while fetching plants.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground" role="status">
            {plantList.length} plants found
          </p>

          {plantList.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {plantList.map((species) => (
                <PlantLibraryCard key={species.id} plantListItem={species} />
              ))}
            </div>
          ) : (
            <p>No plants found.</p>
          )}
        </>
      )}
    </div>
  );
};
