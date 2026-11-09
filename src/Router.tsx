import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { MyPlantsPage } from "./pages/MyPlantsPage";
import { PlantDetailsPage } from "./pages/PlantDetailsPage";
import { PlantLibraryPage } from "./pages/PlantLibraryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutUsPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        // Private pages: ProtectedRoute checks login first, then shows the matching page
        element: <ProtectedRoute />,
        children: [
          { path: "/my-plants", element: <MyPlantsPage /> },
          { path: "/plant-details/:id", element: <PlantDetailsPage /> },
          { path: "/plant-library", element: <PlantLibraryPage /> },
        ]
      }
    ],
  },
]);

