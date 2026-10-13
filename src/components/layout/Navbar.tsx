import { useState } from "react";
import { House, Leaf, LibraryBig, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { LogoutButton } from "../auth/LogoutButton";
import { MenuIcon } from "./MenuIcon";

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/my-plants", label: "My plants", icon: Leaf },
  { to: "/plant-library", label: "Plant library", icon: LibraryBig },
  { to: "/login", label: "Login", icon: LogIn },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-nav flex justify-end p-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-11 text-foreground"
            />
          }
        >
          <MenuIcon isOpen={isOpen} />
        </SheetTrigger>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="gap-0 rounded-l-2xl border-border motion-reduce:transition-none"
        >
          <SheetHeader className="flex-row items-center justify-between border-b border-border p-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 text-foreground"
                />
              }
            >
              <MenuIcon isOpen={isOpen} />
            </SheetClose>
          </SheetHeader>
          <nav className="min-h-0 flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    <Icon aria-hidden="true" className="size-5 shrink-0" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <SheetFooter className="border-t border-border p-4">
            <LogoutButton />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
