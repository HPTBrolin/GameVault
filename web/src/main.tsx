import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

import Library from "./pages/Library";
import Add from "./pages/Add";
import Settings from "./pages/Settings";
import GameDetail from "./pages/GameDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Library /> },
      { path: "add", element: <Add /> },
      { path: "settings", element: <Settings /> },
      { path: "game/:id", element: <GameDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
