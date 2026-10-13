import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export const Layout = () => (
  <>
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  </>
);
