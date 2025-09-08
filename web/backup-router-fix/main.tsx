import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Keep these imports if they already exist in your project. If the files don't exist,
// they are harmless (we include no-op files in this patch to satisfy the imports).
import "./styles/app.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
