import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Expedientes from "./pages/Expedientes";
import ExpedienteNuevo from "./pages/ExpedienteNuevo";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir la raíz a /expedientes */}
        <Route path="/" element={<Navigate to="/expedientes" />} />

        {/* Lista de expedientes */}
        <Route path="/expedientes" element={<Expedientes />} />

        {/* Crear nuevo expediente */}
        <Route path="/expedientes/nuevo" element={<ExpedienteNuevo />} />

        {/* Editar expediente */}
        <Route path="/expedientes/editar/:id" element={<ExpedienteNuevo />} />

        {/* Ruta fallback para 404 */}
        <Route path="*" element={<h1 className="text-center mt-20 text-red-500">Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}
