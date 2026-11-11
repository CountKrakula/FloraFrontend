import { useState, useEffect, useRef } from "react";
import PageContent from "./Submit-plant-image.json";
import { createImage, updateImage } from "@/hooks/useImage";
import InputCheckbox from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ImageDTO } from "@/types/image";

const SHOW_PROFILE_PICTURE_CHECKBOX = false;

type Props = {
  plant: { PlantId: number; name: string };
  images: ImageDTO[];
  selectedIndex: number;
  canCreate: boolean;
  onSaved: () => Promise<void>;
}
export const SubmitImage = ({
  plant,
  images,
  selectedIndex,
  canCreate,
  onSaved,
}: Props) => {
  const [content] = useState(PageContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState({
    url: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isProfilePicture, setIsProfilePicture] = useState(false);
  const [status, setStatus] = useState("Idle");
  const hasProfileImage = images?.some((img) => img.isProfilePicture) ?? false;
  const [errors, setErrors] = useState<string[]>([]);
  const selectedImage = images[selectedIndex];

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (uploadedImage.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage({ url: URL.createObjectURL(file) });
    setSelectedFileName(file.name);
    if (!canCreate) return;
    if (selectedImage) {
      await saveImage("edit");
    } else if (images.length === 0) {
      await saveImage("create");
    }
  }

  async function saveImage(action: "create" | "edit") {
    setErrors([]);
    setStatus("Idle");

    if (action === "edit" && !selectedImage) {
      setErrors(["Choose a picture to edit"]);
      setStatus("Failed");
      return;
    }

    try {
      setStatus("Loading");
      const file = fileInputRef.current?.files?.[0];

      if (!file) {
        setErrors(["Choose a file first"]);
        setStatus("Failed");
        return;
      }
      if (action === "create") {
        await createImage(file, plant.PlantId, isProfilePicture);
      } else {
        await updateImage(file, plant.PlantId, selectedImage.imageId);
      }

      await onSaved();
      setUploadedImage({ url: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFileName("");
      setStatus(action === "create" ? "Created" : "Updated");
    } catch (error) {
      console.error(`Error ${action === "create" ? "creating" : "updating"} image:`, error);
      setStatus("Failed");
      setErrors([`Could not ${action === "create" ? "upload" : "update"} the image. Please try again later.`]);
    }
  }

  useEffect(() => {
    const url = uploadedImage.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [uploadedImage.url]);

  return (
    <section>
      <div className="upload-form flex flex-col items-start gap-3">
        <div className="flex flex-col items-start gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canCreate || status === "Loading"}
          >
            {content["select-button"]}
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="sr-only"
            tabIndex={-1}
          />
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {selectedFileName || "No file selected"}
          </span>
        </div>
        {SHOW_PROFILE_PICTURE_CHECKBOX && (
          <div className="profile-picture-checkbox">
            <InputCheckbox
              id={`profile-picture-${selectedIndex}`}
              name="isProfilePicture"
              label={content["profile-image-checkbox"]}
              checked={isProfilePicture}
              disabled={hasProfileImage}
              onChange={(e) => setIsProfilePicture(e.target.checked)}
            />
          </div>
        )}
        <div className="flex-row">
          {images.length === 0 && status === "Failed" && (
            <Button
              type="button"
              onClick={() => saveImage("create")}
              disabled={!canCreate}
              variant="outline"
              size="sm"
            >
              Create
            </Button>
          )}
          {selectedImage && status === "Failed" && (
            <Button
              type="button"
              onClick={() => saveImage("edit")}
              disabled={!canCreate}
              variant="outline"
              size="sm"
            >
              Retry edit
            </Button>
          )}
        </div>
      </div>
      <div>
        {status === "Failed" &&
          `The image could not be uploaded! ${errors.join(", ")}`}
        {status === "Loading" && "Uploading images..."}
        {(status === "Created" || status === "Updated") && (
          <p>
            {status === "Created" ? "The image has been added" : "The image has been updated"}{" "}
            for {plant.name}!
          </p>
        )}
      </div>
    </section>
  );
}
