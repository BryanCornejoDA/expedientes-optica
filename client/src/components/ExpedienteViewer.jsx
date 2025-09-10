import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ExpedienteViewer({ paciente, onClose }) {
  if (!paciente) return null;

  const Item = ({ label, value }) => (
    <div className="grid grid-cols-4 gap-2 items-start">
      <div className="col-span-1 text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</div>
      <div className="col-span-3 text-sm text-gray-900 dark:text-gray-100 break-words">{value || "—"}</div>
    </div>
  );

  const RxBlock = ({ title, rx }) => (
    <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <Item label="ESF" value={rx?.esf} />
        <Item label="CIL" value={rx?.cil} />
        <Item label="EJE" value={rx?.eje} />
        <Item label="ADD" value={rx?.add} />
        <div className="col-span-2">
          <Item label="Medidas" value={rx?.medidas} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Expediente #{paciente.id} — {paciente.nombre}
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="grid gap-3">
              <Item label="DUI" value={paciente.dui} />
              <Item label="Teléfono" value={paciente.telefono} />
              <Item label="Tipo de Lentes" value={paciente.tipoLentes} />
              <Item label="Aro" value={paciente.aro} />
              <Item label="Tratamiento" value={paciente.tratamiento} />
              <Item label="Total Cancelado" value={paciente.totalCancelado} />
              <Item label="Fecha" value={paciente.fechaCita} />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <RxBlock title="RX OD" rx={paciente.rx?.OD} />
            <RxBlock title="RX OI" rx={paciente.rx?.OI} />
          </div>
        </div>

        {/* Notas */}
        <Card className="mt-4">
          <CardContent>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Notas</div>
            <div className="whitespace-pre-line text-sm text-gray-900 dark:text-gray-100 min-h-[80px]">
              {paciente.notas || "—"}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Volver</Button>
        </div>
      </div>
    </>
  );
}
