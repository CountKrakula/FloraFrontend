import { useState, useEffect } from "react";
import PageContent from "./Submit-plant-image.json";
import { createImage } from "@/hooks/useImage";
import InputCheckbox from "@/components/ui/checkbox";

type Props = {
  plant: { PlantId: number; name: string };
  images: { isProfilePicture: boolean }[];
  selectedIndex: number;
}
export const SubmitImage = ({ plant, images,  selectedIndex, }: Props) => {
  const [content] = useState(PageContent);
  const [uploadedImage, setUploadedImage] = useState({
    url: "",
  });
  const [isProfilePicture, setIsProfilePicture] = useState(false);
  const [status, setStatus] = useState("Idle");
  const hasProfileImage = images?.some((img) => img.isProfilePicture) ?? false;
  const [errors, setErrors] = useState<string[]>([]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (uploadedImage.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage({ url: URL.createObjectURL(file) });
  }

  async function submitImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setStatus("Idle");

    if (!plant) {
      setErrors(["Välj en växt först"]);
      setStatus("Failed");
      return;
    }

    try {
      setStatus("Loading");
      const file =
        event.currentTarget.querySelector<HTMLInputElement>(
          'input[type="file"]',
        )?.files?.[0];

      if (!file) {
        setErrors(["Välj en fil först"]);
        setStatus("Failed");
        return;
      }
      await createImage(file, plant.PlantId, isProfilePicture);

      //   if (response.status === 401) {
      //     LogoutAndRedirect("Din session har gått ut av säkerhetsskäl. Logga in igen för att fortsätta.", "expired");
      //     return;
      //   }

      const responseData = await createImage(file, plant.PlantId, isProfilePicture);
      setUploadedImage({ url: "" });
      setStatus("Success");
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatus("Failed");
      setErrors(["Ett oväntat fel uppstod. Försök igen senare."]);
    }
  }

  useEffect(() => {
    const url = uploadedImage.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [uploadedImage.url]);

  return (
    <section className="container">
      <h3>{content["main-title"]}</h3>
      {/* <p>{content["description1"].replaceAll("{plant.name}", plant.name)}</p>
      <p>{content["description2"].replaceAll("{plant.name}", plant.name)}</p>
      {Object.entries(content["cards"] ?? {}).map(([key, card]) => (
        <div key={key}>
          <ContentCard className="info-card">
            {" "}
            {card.description.replaceAll("{plant.name}", plant.name)}{" "}
          </ContentCard>
        </div>
      ))} */}
      <form onSubmit={submitImage} className="upload-form flex-col">
        <label className="upload-button">
          {content["select-button"]}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="upload-button__hidden"
          />
        </label>
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
        <button type="submit">{content["upload-button"]}</button>
      </form>
      <div>
        {status === "Failed" &&
          `Bilden har inte laddats upp! ${errors.join(", ")}`}
        {status === "Loading" && "Laddar bilder..."}
        {status === "Success" && plant && (
          <p>Bilden har lagts till för {plant.name}!</p>
        )}
      </div>
    </section>
  );
}
