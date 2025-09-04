import { useState, useEffect } from "react";

export default function ExpedienteForm({ pacienteActual, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [graduacion, setGraduacion] = useState("");

  useEffect(() => {
    if (pacienteActual) {
      setNombre(pacienteActual.nombre);
      setFechaCita(pacienteActual.fechaCita);
      setGraduacion(pacienteActual.graduacion);
    }
  }, [pacienteActual]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, fechaCita, graduacion });
    setNombre("");
    setFechaCita("");
    setGraduacion("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <input
        type="text"
        placeholder="Nombre del paciente"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border p-2 rounded text-gray-700"
        required
      />
      <input
        type="date"
        value={fechaCita}
        onChange={(e) => setFechaCita(e.target.value)}
        className="w-full border p-2 rounded text-gray-700"
        required
      />
      <input
        type="text"
        placeholder="Graduación"
        value={graduacion}
        onChange={(e) => setGraduacion(e.target.value)}
        className="w-full border p-2 rounded text-gray-700"
        required
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {pacienteActual ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
