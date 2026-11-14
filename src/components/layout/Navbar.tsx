import { useEffect, useState } from "react";
import {
  House,
  Info,
  Leaf,
  LibraryBig,
  LogIn,
  Moon,
  Sun,
  UserPlus,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
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

const publicLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/about", label: "About us", icon: Info },
  { to: "/login", label: "Log in", icon: LogIn },
  { to: "/register", label: "Sign up", icon: UserPlus },
];

const authenticatedLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/my-plants", label: "My plants", icon: Leaf },
  { to: "/plant-library", label: "Plant library", icon: LibraryBig },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.localStorage.getItem("flora-theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("flora-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <header className="app-nav relative flex items-center justify-between p-4">
      <NavLink to="/" aria-label="Flora startsida" className="text-primary">
        <Leaf className="size-9 sm:size-10" aria-hidden="true" />
      </NavLink>

      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-bold italic tracking-wider text-primary sm:text-3xl md:text-4xl">
        Flora
      </span>

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
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              aria-pressed={isDarkMode}
              onClick={() => setIsDarkMode((current) => !current)}
            >
              {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              {isDarkMode ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </Button>
            {isAuthenticated ? <LogoutButton /> : null}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
};
