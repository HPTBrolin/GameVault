// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Library from "./pages/Library";
import Add from "./pages/Add";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import GameDetail from "./pages/GameDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Library /> },
      { path: "add", element: <Add /> },
      { path: "calendar", element: <Calendar /> },
      { path: "settings", element: <Settings /> },
      { path: "game/:id", element: <GameDetail /> },
    ],
  },
]);

export default router;
