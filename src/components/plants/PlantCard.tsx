import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlantDto } from "@/types/plant";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantImagePlaceholder } from "./PlantImagePlaceholder";
import { ImageInfoCard } from "@/components/images/ImageInfoCard";
import { getImageUrl, getImages } from "@/hooks/useImage";
import type { ImageDTO } from "@/types/image";

type PlantCardProps = {
  plant: PlantDto;
};

export const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageDTO[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [imagesError, setImagesError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    getImages(plant.id)
      .then((fetchedImages) => {
        if (!isCurrent) return;
        setImages(fetchedImages);
        setSelectedImageId(
          fetchedImages.find((image) => image.isProfilePicture)?.imageId ??
            fetchedImages[0]?.imageId ??
            null,
        );
      })
      .catch((error: unknown) => {
        console.error(`Error fetching images for plant ${plant.id}:`, error);
        if (isCurrent) setImagesError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [plant.id]);

  const selectedImage = images.find(
    (image) => image.imageId === selectedImageId,
  );

  return (
    <Card
      onClick={() => navigate(`/plant-details/${plant.id}`)}
      className="group overflow-hidden cursor-pointer border-border p-0 flex flex-col justify-between transition-[background-color,box-shadow,translate] duration-200 hover:bg-secondary hover:shadow-md motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
    >
      <div>
        <div className="h-48 w-full bg-muted overflow-hidden">
          {selectedImage ? (
            <img
              src={getImageUrl(selectedImage.url)}
              alt={plant.name}
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <PlantImagePlaceholder className="h-full w-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105" />
          )}
        </div>
        {images.length > 0 && selectedImage && (
          <ImageInfoCard
            images={images}
            selectedImageId={selectedImage.imageId}
            onImageSelect={(image) => setSelectedImageId(image.imageId)}
          />
        )}
        {imagesError && (
          <p className="px-4 pt-2 text-sm text-destructive" role="alert">
            Could not load plant images.
          </p>
        )}

        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {plant.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{plant.location}</p>
        </CardHeader>
      </div>
    </Card>
  );
};
