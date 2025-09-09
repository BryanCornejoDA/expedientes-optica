import { useState, useMemo } from "react";
import { usePacientes } from "@/context/ExpedientesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Eye, Edit, Trash, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/theme/ThemeToggle";

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

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="section-title">Gestión de Expedientes - Óptica</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="btn btn-green" onClick={() => navigate("/expedientes/nuevo")}>
            <FilePlus size={18} /> Nuevo Expediente
          </Button>
        </div>
      </div>

      {/* Banner de estado (similar al de la captura) */}
      {error && <div className="alert-success">Ocurrió un error: {error}</div>}

      {/* Filtros */}
      <Card className="mb-4">
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Input placeholder="Buscar por nombre, ID o DUI" value={search}
            onChange={(e) => { setSearch(e.target.value); setPaginaActual(1); }} />
          <Input type="date" value={fechaFiltro}
            onChange={(e) => { setFechaFiltro(e.target.value); setPaginaActual(1); }} />
          <Select value={registrosPorPagina}
            onChange={(e) => { setRegistrosPorPagina(Number(e.target.value)); setPaginaActual(1); }}>
            <option value={10}>10 por página</option>
            <option value={30}>30 por página</option>
            <option value={50}>50 por página</option>
          </Select>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>DUI</th>
                <th>Teléfono</th>
                <th>Tipo Lentes</th>
                <th>Aro</th>
                <th>Tratamiento</th>
                <th>RX OD</th>
                <th>RX OI</th>
                <th>Total</th>
                <th>Fecha</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesMostrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.dui}</td>
                  <td>{p.telefono}</td>
                  <td>{p.tipoLentes}</td>
                  <td>{p.aro}</td>
                  <td>{p.tratamiento}</td>
                  <td>
                    ESF: {p.rx?.OD?.esf}<br/>
                    CIL: {p.rx?.OD?.cil}<br/>
                    EJE: {p.rx?.OD?.eje}<br/>
                    ADD: {p.rx?.OD?.add}<br/>
                    MED: {p.rx?.OD?.medidas}
                  </td>
                  <td>
                    ESF: {p.rx?.OI?.esf}<br/>
                    CIL: {p.rx?.OI?.cil}<br/>
                    EJE: {p.rx?.OI?.eje}<br/>
                    ADD: {p.rx?.OI?.add}<br/>
                    MED: {p.rx?.OI?.medidas}
                  </td>
                  <td>{p.totalCancelado}</td>
                  <td>{p.fechaCita}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <Button variant="success" className="btn-green"><Eye size={14}/></Button>
                      <Button variant="default" className="btn-blue" onClick={() => navigate(`/expedientes/editar/${p.id}`)}><Edit size={14}/></Button>
                      <Button variant="destructive" className="btn-red" onClick={() => confirm(`¿Eliminar #${p.id}?`) && eliminarPaciente(p.id)}><Trash size={14}/></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pacientesMostrados.length === 0 && (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-slate-500">No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
