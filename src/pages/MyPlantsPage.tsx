import React, { useEffect, useState } from "react";
import type { Plant } from "@/types/plant";
import { PlantCard } from "@/components/plants/PlantCard";
import { EmptyState } from "@/components/plants/EmptyState";
import { MOCK_PLANTS } from "@/data/mockPlants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MyPlantsPage: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State för att styra om modalen är öppen eller stängd
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form state
  const [plantName, setPlantName] = useState<string>("");
  const [speciesName, setSpeciesName] = useState<string>("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);

        setTimeout(() => {
          setPlants(MOCK_PLANTS);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching plants:", error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Öppnar modalen vid klick
  const handleAddPlant = () => {
    setIsAddModalOpen(true);
  };

  // Hanterar formulärinskickning
  const handleSubmitPlant = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plantName.trim()) return;

    const newPlant: Plant = {
      plantId: Date.now().toString(),
      name: plantName,
      plantSpecies: {
        name: speciesName || "Unknown species",
      },
      plantImages: [],
    };

    // Lägg till den nya växten i listhanteringen
    setPlants((prev) => [newPlant, ...prev]);

    // Återställ formulär och stäng modalen
    setPlantName("");
    setSpeciesName("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Plants</h1>
          <p className="text-muted-foreground mt-1">
            An overview of all your registered house plants
          </p>
        </div>

        {plants.length > 0 && !loading && (
          <Button onClick={handleAddPlant} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add plant
          </Button>
        )}
      </div>

      {/* Main Content */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.plantId} plant={plant} />
          ))}
        </div>
      )}

      {/* Clean & Minimalist Add Plant Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-xl font-semibold mb-2">
            Add a new plant
          </DialogTitle>

          <form onSubmit={handleSubmitPlant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plantName">Plant Name</Label>
              <Input
                id="plantName"
                placeholder="e.g. Monstera"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciesName">Species (optional)</Label>
              <Input
                id="speciesName"
                placeholder="e.g. Monstera Deliciosa"
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save plant</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPlantsPage;