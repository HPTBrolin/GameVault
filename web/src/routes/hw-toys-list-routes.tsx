// src/routes/hw-toys-list-routes.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const HardwareList = lazy(()=>import("../pages/HardwareList"));
const ToysList = lazy(()=>import("../pages/ToysList"));

export const hwToysListRoutes: RouteObject[] = [
  { path: "/hardware", element: <HardwareList /> },
  { path: "/toys", element: <ToysList /> },
];

export function extendRoutes(existing: RouteObject[]): RouteObject[]{
  return [...existing, ...hwToysListRoutes];
}
