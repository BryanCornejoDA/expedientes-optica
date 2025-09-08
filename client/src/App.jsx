import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Expedientes from "@/pages/Expedientes";
import ExpedienteFormPage from "@/pages/ExpedienteNuevo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz a /expedientes */}
        <Route path="/" element={<Navigate to="/expedientes" replace />} />

        {/* Rutas de tu app */}
        <Route path="/expedientes" element={<Expedientes />} />
        <Route path="/expedientes/nuevo" element={<ExpedienteFormPage />} />
        <Route path="/expedientes/editar/:id" element={<ExpedienteFormPage />} />

        {/* 404 opcional */}
        <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
