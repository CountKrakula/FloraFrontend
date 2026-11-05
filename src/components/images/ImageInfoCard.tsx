import type { ImageDTO } from "@/types/image";
import { getImageUrl } from "@/hooks/useImage";

type Props = {
  images: ImageDTO[];
  selectedImageId: number | null;
  onImageSelect: (image: ImageDTO) => void;
};

export const ImageInfoCard = ({
  images,
  selectedImageId,
  onImageSelect,
}: Props) => {
  return (
    <div className="image-info-card">
      {images
        .filter((image) => image.imageId !== selectedImageId)
        .map((image) => (
          <div
            key={image.imageId}
            className="image-item"
            onClick={() => onImageSelect(image)}
          >
            <img src={getImageUrl(image.url)} alt="Plant" />
            {image.isProfilePicture && (
              <span className="profile-badge">Profile</span>
            )}
          </div>
        ))}
    </div>
  );
};