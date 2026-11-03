import { Leaf } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { usePlantSpeciesDetail } from "@/hooks/usePlantSpeciesDetail";

type PlantSpeciesDialogProps = {
  plantId: number;
};

export const PlantSpeciesDialog = ({ plantId }: PlantSpeciesDialogProps) => {
  const { plantDetails, loading, error } = usePlantSpeciesDetail(plantId);
  if (loading || error || !plantDetails) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plant details</DialogTitle>
          <DialogDescription>
            Plant information and care requirements
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <p role="status" className="text-muted-foreground">
            Loading plant details...
          </p>
        ) : error ? (
          <p role="alert" className="text-destructive">
            Could not load plant details.
          </p>
        ) : (
          <p className="text-muted-foreground">No plant details found.</p>
        )}
      </DialogContent>
    );
  }

  const scientificName = plantDetails.scientific_name?.join(", ");
  const name = plantDetails.common_name || scientificName || "Unknown plant";
  const wateringInterval = [
    plantDetails.watering_general_benchmark?.value,
    plantDetails.watering_general_benchmark?.unit,
  ]
    .filter(Boolean)
    .join(" ");

  const careRows = [
    { label: "Watering", value: plantDetails.watering },
    { label: "Watering interval", value: wateringInterval },
    { label: "Sunlight", value: plantDetails.sunlight?.join(", ") },
    { label: "Care level", value: plantDetails.care_level },
    {
      label: "Suitable indoors",
      value:
        plantDetails.indoor == null ? null : plantDetails.indoor ? "Yes" : "No",
    },
    {
      label: "Poisonous to pets",
      value:
        plantDetails.poisonous_to_pets == null
          ? null
          : plantDetails.poisonous_to_pets
            ? "Yes"
            : "No",
    },
  ];

  return (
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      <DialogHeader className="pr-8">
        <DialogTitle className="text-2xl font-semibold leading-tight">
          {name}
        </DialogTitle>
        <DialogDescription className={scientificName ? "italic" : undefined}>
          {scientificName || "Plant information and care requirements"}
        </DialogDescription>
      </DialogHeader>

      <div className="flex h-52 items-center justify-center overflow-hidden rounded-lg bg-muted sm:h-60">
        {plantDetails.default_image?.regular_url ? (
          <img
            src={plantDetails.default_image.regular_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Leaf className="h-16 w-16 text-primary" aria-hidden="true" />
        )}
      </div>

      {plantDetails.description && (
        <section className="space-y-2">
          <h3 className="font-semibold">About this plant</h3>
          <p className="whitespace-pre-line wrap-break-word text-sm leading-relaxed text-muted-foreground">
            {plantDetails.description}
          </p>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="font-semibold">Care information</h3>
        <dl className="rounded-lg border bg-muted/30 px-4">
          {careRows.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-2 gap-4 border-b py-3 text-sm last:border-b-0"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 wrap-break-word text-right font-medium">
                {value || "Not available"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </DialogContent>
  );
};
