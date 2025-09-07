import { useState, useEffect } from "react";

export default function ExpedienteForm({ pacienteActual, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [dui, setDui] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoLentes, setTipoLentes] = useState("");
  const [aro, setAro] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [rxOD, setRxOD] = useState({ esf: "", cil: "", eje: "", add: "" });
  const [rxOI, setRxOI] = useState({ esf: "", cil: "", eje: "", add: "" });
  const [totalCancelado, setTotalCancelado] = useState("");

  useEffect(() => {
    if (pacienteActual) {
      setNombre(pacienteActual.nombre || "");
      setDui(pacienteActual.dui || "");
      setTelefono(pacienteActual.telefono || "");
      setTipoLentes(pacienteActual.tipoLentes || "");
      setAro(pacienteActual.aro || "");
      setTratamiento(pacienteActual.tratamiento || "");
      setFechaCita(pacienteActual.fechaCita || "");
      setRxOD(pacienteActual.rx?.OD || { esf: "", cil: "", eje: "", add: "" });
      setRxOI(pacienteActual.rx?.OI || { esf: "", cil: "", eje: "", add: "" });
      setTotalCancelado(pacienteActual.totalCancelado || "");
    }
  }, [pacienteActual]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre,
      dui,
      telefono,
      tipoLentes,
      aro,
      tratamiento,
      fechaCita,
      rx: { OD: rxOD, OI: rxOI },
      totalCancelado: parseFloat(totalCancelado) || 0,
    });

    // Reset
    setNombre("");
    setDui("");
    setTelefono("");
    setTipoLentes("");
    setAro("");
    setTratamiento("");
    setFechaCita("");
    setRxOD({ esf: "", cil: "", eje: "", add: "" });
    setRxOI({ esf: "", cil: "", eje: "", add: "" });
    setTotalCancelado("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-h-[90vh] overflow-y-auto">
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="DUI"
        value={dui}
        onChange={(e) => setDui(e.target.value)}
        className="w-full border p-2 rounded"
        pattern="\d{8}-\d"
        title="Formato: 12345678-9"
        required
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full border p-2 rounded"
        pattern="\d{8,10}"
        title="Solo números, 8-10 dígitos"
        required
      />
      <input
        type="text"
        placeholder="Tipo de lentes"
        value={tipoLentes}
        onChange={(e) => setTipoLentes(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Aro"
        value={aro}
        onChange={(e) => setAro(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Tratamiento"
        value={tratamiento}
        onChange={(e) => setTratamiento(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        value={fechaCita}
        onChange={(e) => setFechaCita(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* RX */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">RX OD</h3>
          <input type="number" step="0.25" placeholder="ESF" value={rxOD.esf} onChange={(e) => setRxOD({...rxOD, esf: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="0.25" placeholder="CIL" value={rxOD.cil} onChange={(e) => setRxOD({...rxOD, cil: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="1" placeholder="EJE" value={rxOD.eje} onChange={(e) => setRxOD({...rxOD, eje: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="0.25" placeholder="ADD" value={rxOD.add} onChange={(e) => setRxOD({...rxOD, add: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <h3 className="font-semibold">RX OI</h3>
          <input type="number" step="0.25" placeholder="ESF" value={rxOI.esf} onChange={(e) => setRxOI({...rxOI, esf: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="0.25" placeholder="CIL" value={rxOI.cil} onChange={(e) => setRxOI({...rxOI, cil: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="1" placeholder="EJE" value={rxOI.eje} onChange={(e) => setRxOI({...rxOI, eje: e.target.value})} className="w-full border p-2 rounded" />
          <input type="number" step="0.25" placeholder="ADD" value={rxOI.add} onChange={(e) => setRxOI({...rxOI, add: e.target.value})} className="w-full border p-2 rounded" />
        </div>
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Total Cancelado"
        value={totalCancelado}
        onChange={(e) => setTotalCancelado(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="bg-gray-300 text-white px-4 py-2 rounded">Cancelar</button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          {pacienteActual ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
