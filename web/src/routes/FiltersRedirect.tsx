// src/routes/FiltersRedirect.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FiltersRedirect() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const p = new URLSearchParams(params);
    p.set("filters", "1");
    setParams(p, { replace: true });
    navigate("/", { replace: true });
  }, []);

  return null;
}
