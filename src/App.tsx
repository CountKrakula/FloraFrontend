import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Router } from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { UserCareTasksProvider } from "./providers/UserCareTasksProvider";

function App() {
  return (
    <AuthProvider>
      <UserCareTasksProvider>
        <RouterProvider router={Router} />
      </UserCareTasksProvider>
    </AuthProvider>
  );
}

export default App;
