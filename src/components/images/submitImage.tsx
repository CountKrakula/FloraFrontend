import { useState, useEffect } from "react";
import PageContent from "./submit-image.json";

export default function SubmitImage({ plant, images, selectedIndex }) {
  const [content] = useState(PageContent);
  const [uploadedImage, setUploadedImage] = useState({
    url: "",
    plantId: "",
  });
  const [isProfilePicture, setIsProfilePicture] = useState(false);
  const [status, setStatus] = useState("Idle");
  const hasProfileImage = images?.some((img) => img.isProfilePicture) ?? false;
  const [errors, setErrors] = useState([]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedImage((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);

      return {
        url: URL.createObjectURL(file),
        plantId: plant?.Id ?? plant?.id ?? "",
      };
    });
  }

  async function submitImage(event) {
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
      const file = event.target.querySelector('input[type="file"]')?.files?.[0];

      if (!file) {
        setErrors(["Välj en fil först"]);
        setStatus("Failed");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("plantId", plant?.Id ?? plant?.id ?? "");
      formData.append("isProfilePicture", isProfilePicture);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        },
      );

      //   if (response.status === 401) {
      //     LogoutAndRedirect("Din session har gått ut av säkerhetsskäl. Logga in igen för att fortsätta.", "expired");
      //     return;
      //   }

      const responseData = await response.json();
      if (!response.ok) {
        const errorMessages = responseData.isList
          ? (responseData.messages ?? ["Ett fel uppstod"])
          : [responseData.message ?? "Ett fel uppstod"];
        setErrors(errorMessages);
        setStatus("Failed");
        return;
      }
      setUploadedImage({ url: "", plantId: "" });
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
      <p>{content["description1"].replaceAll("{plant.name}", plant.name)}</p>
      <p>{content["description2"].replaceAll("{plant.name}", plant.name)}</p>
      {Object.entries(content["cards"] ?? {}).map(([key, card]) => (
        <div key={key}>
          <ContentCard className="info-card">
            {" "}
            {card.description.replaceAll("{plant.name}", plant.name)}{" "}
          </ContentCard>
        </div>
      ))}
      <form onSubmit={submitImage} className="upload-form flex-col">
        {/* This is not a proper button and cannot use the primary */}
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
        <label className="profile-picture-checkbox">
          <InputCheckbox
          label={content["profile-image-checkbox"]}
            type="checkbox"
            checked={isProfilePicture}
            disabled={hasProfileImage}
            onChange={(e) => setIsProfilePicture(e.target.checked)}
          />
        </label>
        <PrimaryButton text={content["upload-button"]} type="submit" />
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
