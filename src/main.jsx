import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PacientesProvider } from "./context/ExpedientesContext.jsx"; // cuidado aquí
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PacientesProvider>
      <App />
    </PacientesProvider>
  </React.StrictMode>
);
