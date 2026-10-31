import { useState, useEffect } from "react";
import type {ImageDTO} from "@/types/image";
import { getImages, updateImage} from "@/hooks/useImage";

type Props = {
  plant: { plantId: number;}
  selectedIndex: number;
  onImageSelect: (image: ImageDTO) => void;
};

export const ImageInfoCard = ({ plant, selectedIndex, onImageSelect }: Props) => {
  const [images, setImages] = useState<ImageDTO[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageDTO | null>(null);

    useEffect(() => {
  getImages(plant.plantId)
    .then((fetchedImages: ImageDTO[]) => {
      setImages(fetchedImages);
      setSelectedImage(
        fetchedImages[selectedIndex] ?? fetchedImages[0] ?? null
      );
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });
}, [plant.plantId, selectedIndex]);

    const handleImageSelect = (image: ImageDTO) => {
        setSelectedImage(image);
        onImageSelect(image);
    }

    return (
        <div className="image-info-card">
            {images.map((image) => (
                <div
                    key={image.imageId }
                    className={`image-item ${selectedImage?.imageId === image.imageId ? "selected" : ""}`}
                    onClick={() => handleImageSelect(image)}
                >
                    <img src={image.url.startsWith("/") ? image.url : image.url} alt={`Image`} />
                    {image.isProfilePicture && <span className="profile-badge">Profile</span>}
                </div>
            ))}
        </div>
    );
}