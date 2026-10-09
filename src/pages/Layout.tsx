import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

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
