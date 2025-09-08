import { useState, useMemo } from "react";
import { usePacientes } from "@/context/ExpedientesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Eye, Edit, Trash, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Expedientes() {
  const { pacientes, eliminarPaciente, loading, error } = usePacientes();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);

  const pacientesFiltrados = useMemo(() => {
    return pacientes
      .filter(p =>
        (p.nombre?.toLowerCase().includes(search.toLowerCase())) ||
        String(p.id).includes(search) ||
        (p.dui?.includes(search))
      )
      .filter(p => !fechaFiltro || p.fechaCita === fechaFiltro);
  }, [pacientes, search, fechaFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(pacientesFiltrados.length / registrosPorPagina));
  const pacientesMostrados = pacientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const onEliminar = async (id) => {
    if (confirm(`¿Eliminar el expediente #${id}? Esta acción no se puede deshacer.`)) {
      try { await eliminarPaciente(id); }
      catch (e) { alert("No se pudo eliminar: " + (e?.message ?? "")); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-blue-700">Gestión de Expedientes - Óptica</h1>
        <Button className="bg-blue-600 text-white flex items-center gap-2" onClick={() => navigate("/expedientes/nuevo")}>
          <FilePlus size={18} /> Nuevo Expediente
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-2 mb-6 flex-wrap">
        <Input placeholder="Buscar por nombre, ID o DUI" value={search} onChange={(e) => { setSearch(e.target.value); setPaginaActual(1); }} className="flex-1 min-w-[200px]" />
        <Input type="date" value={fechaFiltro} onChange={(e) => { setFechaFiltro(e.target.value); setPaginaActual(1); }} className="flex-1 min-w-[150px]" />
        <Select value={registrosPorPagina} onChange={(e) => { setRegistrosPorPagina(Number(e.target.value)); setPaginaActual(1); }} className="flex-1 min-w-[120px]">
          <option value={10}>10 por página</option>
          <option value={30}>30 por página</option>
          <option value={50}>50 por página</option>
        </Select>
      </div>

      {loading && <div className="p-4 text-sm text-gray-600">Cargando expedientes…</div>}
      {error && <div className="p-4 text-sm text-red-600">Error: {error}</div>}

      {!loading && (
        <Card className="flex-1 shadow-lg overflow-hidden">
          <CardContent className="p-2">
            <div className="overflow-x-hidden">
              <table className="w-full text-left table-auto border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-1 text-blue-700">ID</th>
                    <th className="p-1 text-blue-700">Nombre</th>
                    <th className="p-1 text-blue-700">DUI</th>
                    <th className="p-1 text-blue-700">Teléfono</th>
                    <th className="p-1 text-blue-700">Tipo Lentes</th>
                    <th className="p-1 text-blue-700">Aro</th>
                    <th className="p-1 text-blue-700">Tratamiento</th>
                    <th className="p-1 text-blue-700">RX OD</th>
                    <th className="p-1 text-blue-700">RX OI</th>
                    <th className="p-1 text-blue-700">Total Cancelado</th>
                    <th className="p-1 text-blue-700">Fecha</th>
                    <th className="p-1 text-center text-blue-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesMostrados.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 text-xs">
                      <td className="p-1">{p.id}</td>
                      <td className="p-1">{p.nombre}</td>
                      <td className="p-1">{p.dui}</td>
                      <td className="p-1">{p.telefono}</td>
                      <td className="p-1">{p.tipoLentes}</td>
                      <td className="p-1">{p.aro}</td>
                      <td className="p-1">{p.tratamiento}</td>
                      <td className="p-1">
                        ESF: {p.rx?.OD?.esf} <br />
                        CIL: {p.rx?.OD?.cil} <br />
                        EJE: {p.rx?.OD?.eje} <br />
                        ADD: {p.rx?.OD?.add}
                      </td>
                      <td className="p-1">
                        ESF: {p.rx?.OI?.esf} <br />
                        CIL: {p.rx?.OI?.cil} <br />
                        EJE: {p.rx?.OI?.eje} <br />
                        ADD: {p.rx?.OI?.add}
                      </td>
                      <td className="p-1">{p.totalCancelado}</td>
                      <td className="p-1">{p.fechaCita}</td>
                      <td className="p-1 flex justify-center gap-1 whitespace-nowrap">
                        <Button variant="outline" size="xs" onClick={() => {/* ver detalle */}}>
                          <Eye size={14} color="white"/>
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => navigate(`/expedientes/editar/${p.id}`)}>
                          <Edit size={14} color="white"/>
                        </Button>
                        <Button variant="destructive" size="xs" onClick={() => onEliminar(p.id)}>
                          <Trash size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {pacientesMostrados.length === 0 && (
                    <tr>
                      <td colSpan="12" className="text-center p-2 text-gray-500">
                        No se encontraron resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex flex-wrap justify-between items-center gap-2">
              <div>
                <Button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)} size="sm">Anterior</Button>
                <Button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)} size="sm" className="ml-2">Siguiente</Button>
              </div>
              <span className="text-gray-600 text-sm">Página {paginaActual} de {totalPaginas}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
