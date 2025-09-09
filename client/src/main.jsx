import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ExpedientesProvider } from "@/context/ExpedientesContext.jsx";
import { ThemeProvider } from "@/theme/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ExpedientesProvider>
        <App />
      </ExpedientesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
