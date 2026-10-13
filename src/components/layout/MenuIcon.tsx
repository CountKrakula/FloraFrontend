import { cn } from "cn";

export const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  const lineClass =
    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-in-out motion-reduce:transition-none";

  return (
    <span aria-hidden="true" className="relative block h-5 w-5">
      <span
        className={cn(lineClass, isOpen ? "top-[9px] rotate-45" : "top-[3px]")}
      />
      <span
        className={cn(lineClass, "top-[9px]", isOpen && "scale-x-0 opacity-0")}
      />
      <span
        className={cn(
          lineClass,
          isOpen ? "top-[9px] -rotate-45" : "top-[15px]",
        )}
      />
    </span>
  );
};
