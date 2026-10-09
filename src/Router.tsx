import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { HomePage } from "./pages/HomePage";
import { MyPlantsPage } from "./pages/MyPlantsPage";
import { PlantDetailsPage } from "./pages/PlantDetailsPage";
import { PlantLibraryPage } from "./pages/PlantLibraryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/my-plants", element: <MyPlantsPage /> },
      { path: "/plant-details", element: <PlantDetailsPage /> },
      { path: "/plant-library", element: <PlantLibraryPage /> },
    ],
  },
]);
