import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

type EmptyStateProps = {
  onAddPlant: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddPlant }) => {
  return (
    <Card className="my-8 border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center text-3xl mb-4">
          🌱
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">No plants registered yet</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Your plant collection is empty. Start adding your green friends to get an overview of their care!
        </p>
        <Button onClick={onAddPlant} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add plant
        </Button>
      </CardContent>
    </Card>
  );
};