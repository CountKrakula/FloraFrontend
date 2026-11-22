import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

type PlantImagePlaceholderProps = {
  className?: string;
};

export const PlantImagePlaceholder = ({
  className,
}: PlantImagePlaceholderProps) => (
  <div
    role="img"
    aria-label="Flora logo"
    className={cn(
      "flex flex-col items-center justify-center gap-2 bg-muted text-primary",
      className,
    )}
  >
    <Leaf className="size-12" aria-hidden="true" />
    <span className="font-serif text-2xl font-bold italic tracking-wider">
      Flora
    </span>
  </div>
);
