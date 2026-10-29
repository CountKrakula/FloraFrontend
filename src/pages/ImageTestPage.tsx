import SubmitImage from "@/components/images/submitImage";

export default function ImageTestPage(plant: { Id: number; name: string; plantImages?: { isProfilePicture: boolean }[] }) {
    <SubmitImage
      plant={plant}
      images={plant.plantImages ?? []}
      selectedIndex={plant.Id}
    />;
}