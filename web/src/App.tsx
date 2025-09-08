
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./styles/app.css";

const Library = lazy(() => import("./pages/Library"));
const Add = lazy(() => import("./pages/Add"));
const Settings = lazy(() => import("./pages/Settings"));
const Calendar = lazy(() => import("./pages/Calendar"));
const GameDetail = lazy(() => import("./pages/GameDetail"));

const router = createBrowserRouter([
  { path: "/", element: <Library /> },
  { path: "/add", element: <Add /> },
  { path: "/settings", element: <Settings /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/game/:id", element: <GameDetail /> },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default function App(){
  return (
    <Suspense fallback={<div className="loading">A carregar…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
