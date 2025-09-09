import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { lazy } from "react";

const Library = lazy(() => import("@/pages/Library"));
const Add = lazy(() => import("@/pages/Add"));
const Settings = lazy(() => import("@/pages/Settings"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Calendar = lazy(() => import("@/pages/Calendar"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Library /> },
      { path: "add", element: <Add /> },
      { path: "settings", element: <Settings /> },
      { path: "calendar", element: <Calendar /> },
      { path: "game/:id", element: <GameDetail /> },
    ],
  },
]);

export default router;
