import { useState, useEffect, useRef } from "react";
import PageContent from "./Submit-plant-image.json";
import { createImage, updateImage } from "@/hooks/useImage";
import InputCheckbox from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ImageDTO } from "@/types/image";

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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (uploadedImage.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage({ url: URL.createObjectURL(file) });
    setSelectedFileName(file.name);
  }

  async function submitImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveImage("create");
  }

  async function editImage() {
    await saveImage("edit");
  }

  async function saveImage(action: "create" | "edit") {
    setErrors([]);
    setStatus("Idle");

    if (action === "edit" && !selectedImage) {
      setErrors(["Välj en bild att redigera först"]);
      setStatus("Failed");
      return;
    }

    try {
      setStatus("Loading");
      const file = fileInputRef.current?.files?.[0];

      if (!file) {
        setErrors(["Välj en fil först"]);
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
      setErrors([`Kunde inte ${action === "create" ? "ladda upp" : "uppdatera"} bilden. Försök igen senare.`]);
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
      <form onSubmit={submitImage} className="upload-form flex flex-col items-start gap-3">
        <div className="flex flex-col items-start gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
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
            {selectedFileName || "Ingen fil är vald"}
          </span>
        </div>
        {uploadedImage.url && (
          <img
            src={uploadedImage.url}
            alt="Förhandsgranskning av bilden du valde"
            className="submitted-image"
          />
        )}
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
        <div className="flex-row">
          {images.length === 0 && (
            <Button
              type="submit"
              disabled={status === "Loading" || !canCreate}
              variant="outline"
              size="sm"
            >
              Create
            </Button>
          )}
          {selectedImage && (
            <Button
              type="button"
              onClick={editImage}
              disabled={status === "Loading"}
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
          )}
        </div>
      </form>
      <div>
        {status === "Failed" &&
          `Bilden har inte laddats upp! ${errors.join(", ")}`}
        {status === "Loading" && "Laddar bilder..."}
        {(status === "Created" || status === "Updated") && (
          <p>
            {status === "Created" ? "Bilden har lagts till" : "Bilden har uppdaterats"}{" "}
            för {plant.name}!
          </p>
        )}
      </div>
    </section>
  );
}
