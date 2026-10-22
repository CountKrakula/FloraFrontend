import React from "react";
import { useNavigate } from "react-router-dom";
import type { Plant } from "@/types/plant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlantCardProps = {
  plant: Plant;
};

export const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const navigate = useNavigate();

  const profileImage = plant.plantImages?.find((img) => img.isProfilePicture)?.url;
  const firstImage = plant.plantImages?.[0]?.url;
  const displayImage =
    profileImage ||
    firstImage ||
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80";


  return (
    <Card
     onClick={() => navigate(`/plant-details/${plant.plantId}`)}
      className="group overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 border-border p-0 flex flex-col justify-between"
    >
      <div>
        <div className="h-48 w-full bg-muted overflow-hidden">
          <img
            src={displayImage}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {plant.name}
          </CardTitle>
        </CardHeader>
      </div>
    </Card>
  );
};