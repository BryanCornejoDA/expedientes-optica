import { useState } from "react";
import { usePacientes } from "../context/ExpedientesContext";
import ExpedienteForm from "../components/ExpedienteForm";

export default function Expedientes() {
  const { pacientes, agregarPaciente, editarPaciente, eliminarPaciente } = usePacientes();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 🔹 Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔹 Estados de búsqueda y filtros
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gradFilter, setGradFilter] = useState("all");

  const handleSubmit = (paciente) => {
    if (editing) {
      editarPaciente(editing.id, paciente);
    } else {
      agregarPaciente(paciente);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (paciente) => {
    setEditing(paciente);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  // 🔹 Aplicar búsqueda y filtros antes de paginar
  const filteredPacientes = pacientes.filter((p) => {
    // Búsqueda por nombre
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());

    // Filtro por rango de fechas
    const matchDate =
      (!startDate || p.fechaCita >= startDate) &&
      (!endDate || p.fechaCita <= endDate);

    // Filtro por graduación
    let matchGrad = true;
    if (gradFilter === "positive") matchGrad = parseFloat(p.graduacion) > 0;
    if (gradFilter === "negative") matchGrad = parseFloat(p.graduacion) < 0;

    return matchSearch && matchDate && matchGrad;
  });

  // 🔹 Calcular pacientes mostrados (después de filtrar)
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPacientes = filteredPacientes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Expedientes de Óptica
        </h1>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            Agregar Paciente
          </button>

          {/* 🔹 Selector de cantidad */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded p-2 text-gray-700"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* 🔹 Barra de búsqueda y filtros */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-60 text-gray-700"
          />

          <div className="flex items-center gap-2">
            <label className="text-gray-700">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 rounded text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 rounded text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700">Graduación:</label>
            <select
              value={gradFilter}
              onChange={(e) => {
                setGradFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 rounded text-gray-700"
            >
              <option value="all">Todas</option>
              <option value="positive">Positivas</option>
              <option value="negative">Negativas</option>
            </select>
          </div>
        </div>

        {showForm && (
          <ExpedienteForm
            pacienteActual={editing}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* 🔹 Tabla responsive */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4 bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Fecha de Cita</th>
                <th className="border p-2">Graduación</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPacientes.map((p) => (
                <tr key={p.id} className="text-center border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-800">{p.id}</td>
                  <td className="p-2 text-gray-800">{p.nombre}</td>
                  <td className="p-2 text-gray-800">{p.fechaCita}</td>
                  <td className="p-2 text-gray-800">{p.graduacion}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => eliminarPaciente(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {currentPacientes.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500">
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Controles de paginación */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
