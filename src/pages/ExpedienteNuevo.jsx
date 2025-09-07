import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePacientes } from "../context/ExpedientesContext";
import ExpedienteForm from "../components/ExpedienteForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExpedienteFormPage() {
  const { pacientes, agregarPaciente, editarPaciente } = usePacientes();
  const navigate = useNavigate();
  const { id } = useParams(); // Para editar, obtenemos el id desde la ruta

  const pacienteActual = id ? pacientes.find(p => p.id.toString() === id) : null;

  const handleSubmit = (paciente) => {
    if (pacienteActual) {
      editarPaciente(pacienteActual.id, paciente);
    } else {
      agregarPaciente(paciente);
    }
    navigate("/expedientes"); // Volver a la lista después de guardar
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 md:p-6 items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-700">
              {pacienteActual ? "Editar Expediente" : "Nuevo Expediente"}
            </h1>
            <Button variant="outline" onClick={() => navigate("/expedientes")}>
              <ArrowLeft size={18} /> Volver
            </Button>
          </div>
          <ExpedienteForm
            pacienteActual={pacienteActual}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/expedientes")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
