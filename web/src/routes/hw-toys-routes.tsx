// src/routes/hw-toys-routes.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// lazy para dividir bundles
const AddGame = lazy(()=>import("../pages/Add"));               // já criado no patch anterior
const AddHardware = lazy(()=>import("../pages/AddHardware"));
const DetailHardware = lazy(()=>import("../pages/DetailHardware"));
const AddToy = lazy(()=>import("../pages/AddToy"));
const DetailToy = lazy(()=>import("../pages/DetailToy"));

export const hwToysRoutes: RouteObject[] = [
  // jogos (alias adicional, se já existir /add mantém-se)
  { path: "/games/add", element: <AddGame /> },

  // hardware
  { path: "/hardware/add", element: <AddHardware /> },
  { path: "/hardware/:id", element: <DetailHardware /> },

  // toys-to-life
  { path: "/toys/add", element: <AddToy /> },
  { path: "/toys/:id", element: <DetailToy /> },
];

// helper opcional para estender arrays de rotas já existentes
export function extendRoutes(existing: RouteObject[]): RouteObject[]{
  return [...existing, ...hwToysRoutes];
}
