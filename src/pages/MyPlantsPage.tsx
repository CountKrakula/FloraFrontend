import React, { useEffect, useState } from "react";
import type { PlantDto } from "@/types/plant";
import { PlantCard } from "@/components/plants/PlantCard";
import { EmptyState } from "@/components/plants/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

import { getPlants } from "@/service/plantService";
import { AddPlantDialog } from "@/components/plants/AddPlantDialog";

export const MyPlantsPage: React.FC = () => {
  const [plants, setPlants] = useState<PlantDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Hämtar användarens växter från backend när sidan eller aktuellt sidnummer ändras
  useEffect(() => {
    getPlants(currentPage, 8)
      .then((data) => {
        setPlants(data.items ?? []);
        setTotalPages(data.totalPages);
      })
      .catch(() => setError("Could not load your plants. Are you logged in?"))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handleAddPlant = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Plants
          </h1>
          <p className="text-muted-foreground mt-1">
            An overview of all your registered house plants
          </p>
        </div>

        {plants.length > 0 && !loading && (
          <Button
            onClick={handleAddPlant}
            className="gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add plant
          </Button>
        )}
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : plants.length === 0 ? (
        <EmptyState onAddPlant={handleAddPlant} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => {
                  setLoading(true);
                  return setCurrentPage((prev) => prev - 1);
                }}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setLoading(true);
                  return setCurrentPage((prev) => prev + 1);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal som enbart samlar in CreatePlantDto */}
      <AddPlantDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlant={(created) => {
          setPlants((prev) => [created, ...prev]);
        }}
      />
    </div>
  );
};

export default MyPlantsPage;
