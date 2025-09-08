// src/components/FiltersButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string };

export default function FiltersButton({ label = "Filtros", ...props }: Props){
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate("/filters")} {...props}>
      {label}
    </button>
  );
}
