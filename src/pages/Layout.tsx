import { Link, Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export const Layout = () => (
  <div className="app-container flex min-h-screen flex-col">
    <Navbar />
    <main className="app-main flex-1">
      <Outlet />
    </main>
    <footer className="mt-auto border-t border-border bg-background px-4 py-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Flora. All rights reserved.</p>
        <Link
          to="/about"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          About Flora
        </Link>
      </div>
    </footer>
  </div>
);
