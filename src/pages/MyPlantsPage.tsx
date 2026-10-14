import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Plant } from "@/types/plant";
import { PlantCard } from "@/components/plants/PlantCard";
import { EmptyState } from "@/components/plants/EmptyState";
import { MOCK_PLANTS } from "@/data/mockPlants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export const MyPlantsPage: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);

        /* 
          När er backend API-endpoint är färdigt, ersätt setTimeout med detta:
          const response = await fetch('/api/plants');
          const data = await response.json();
          setPlants(data);
        */

        // Tillfällig simulering med mock-data:
        setTimeout(() => {
          setPlants(MOCK_PLANTS); // Byt till [] för att testa Empty State
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching plants:", error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleAddPlant = () => {
    navigate("/add-plant");
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
    </div>
  );
};

export default MyPlantsPage;