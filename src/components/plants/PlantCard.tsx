import React from "react";
import { Link } from "react-router-dom";
import type { PlantDto } from "@/types/plant";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type PlantCardProps = {
  plant: PlantDto;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80";

export const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  return (
    <Link
      to={`/plant-details/${plant.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full overflow-hidden border-border p-0 transition-[background-color,box-shadow,translate] duration-200 group-hover:bg-secondary group-hover:shadow-md group-hover:ring-primary/50 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none">
        <div className="h-48 w-full bg-muted overflow-hidden">
          <img
            src={DEFAULT_IMAGE}
            alt={plant.name}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
          />
        </div>

        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {plant.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{plant.location}</p>
        </CardHeader>
      </Card>
    </Link>
  );
};
