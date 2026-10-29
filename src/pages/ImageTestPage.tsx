import SubmitImage from "@/components/images/SubmitPlantImage";

export default function ImageTestPage(plant: { PlantId: number; name: string; plantImages?: { isProfilePicture: boolean }[] }) {
    <SubmitImage
      plant={plant}
      images={plant.plantImages ?? []}
      selectedIndex={plant.PlantId}
    />;
}