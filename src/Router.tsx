import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { HomePage } from "./pages/HomePage";
import { MyPlantsPage } from "./pages/MyPlantsPage";
import { PlantDetailsPage } from "./pages/PlantDetailsPage";
import { PlantLibraryPage } from "./pages/PlantLibraryPage";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/login",
        element: <div>Lägg till login komponent här istället</div>,
      },
      { path: "/my-plants", element: <MyPlantsPage /> },
      { path: "/plant-details", element: <PlantDetailsPage /> },
      { path: "/plant-library", element: <PlantLibraryPage /> },
    ],
  },
]);
