import { Header } from "@/components/plantLibrary/Header";
import { PlantLibraryCard } from "@/components/plantLibrary/PlantLibraryCard";
import { PlantSearch } from "@/components/plantLibrary/PlantSearch";
import { MOCK_PLANT_SPECIES } from "@/data/mockPlantSpecies";
import { useState } from "react";
import { usePlantSpeciesSearch } from "@/hooks/usePlantSpeciesSearch";

export const PlantLibraryPage = () => {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredSpecies = MOCK_PLANT_SPECIES.filter((species) =>
    species.name.toLowerCase().includes(query),
  );

  usePlantSpeciesSearch(search);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Header />
      <PlantSearch search={search} setSearch={setSearch} />

      <p className="mb-4 text-sm text-muted-foreground" role="status">
        {filteredSpecies.length} plants found
      </p>
      {filteredSpecies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSpecies.map((species) => (
            <PlantLibraryCard key={species.id} species={species} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No plants match your search. Try another plant name.
        </p>
      )}
    </div>
  );
};
