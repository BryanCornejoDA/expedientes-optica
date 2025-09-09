import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { usePacientes } from "@/context/ExpedientesContext";
import ExpedienteForm from "@/components/ExpedienteForm";
import { ArrowLeft } from "lucide-react";

export default function ExpedienteFormPage() {
  const navigate = useNavigate();
  const { pacientes, agregarPaciente, editarPaciente } = usePacientes();
  const { id } = useParams();
  const pacienteActual = id ? pacientes.find(p => String(p.id) === id) : null;

  const handleSubmit = async (paciente) => {
    if (pacienteActual) await editarPaciente(pacienteActual.id, paciente);
    else await agregarPaciente(paciente);
    navigate("/expedientes");
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="section-title">
            {pacienteActual ? "Editar Expediente" : "Nuevo Expediente"}
          </h1>
          <Button variant="outline" onClick={() => navigate("/expedientes")}>
            <ArrowLeft size={16} /> Volver
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 md:p-6">
            <ExpedienteForm
              pacienteActual={pacienteActual}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/expedientes")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
