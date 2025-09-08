import { useNavigate, useParams } from "react-router-dom";
import { usePacientes } from "@/context/ExpedientesContext";
import ExpedienteForm from "@/components/ExpedienteForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExpedienteFormPage() {
  const { pacientes, agregarPaciente, editarPaciente } = usePacientes();
  const navigate = useNavigate();
  const { id } = useParams();

  const pacienteActual = id ? pacientes.find(p => String(p.id) === id) : null;

  const handleSubmit = async (paciente) => {
    try {
      if (pacienteActual) {
        await editarPaciente(pacienteActual.id, paciente);
      } else {
        await agregarPaciente(paciente);
      }
      navigate("/expedientes");
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error guardando el expediente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 md:p-6 items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-700">
              {pacienteActual ? "Editar Expediente" : "Nuevo Expediente"}
            </h1>
            <Button variant="default" onClick={() => navigate("/expedientes")}>
              <ArrowLeft size={18} color="white" /> Volver 
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
