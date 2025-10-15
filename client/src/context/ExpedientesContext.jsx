import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getPacientes, addPaciente, updatePaciente, deletePaciente } from "@/services/expedientesService";

const ExpedientesCtx = createContext();
export const usePacientes = () => useContext(ExpedientesCtx);

export function ExpedientesProvider({ children }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (e) {
      setError(e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const normFecha = (f) => (f ? new Date(f).toISOString().slice(0,10) : "");

  const agregarPaciente = async (paciente) => {
    setLoading(true); setError(null);
    try {
      const body = { ...paciente, fechaCita: normFecha(paciente.fechaCita) };
      const creado = await addPaciente(body);
      setPacientes(prev => [...prev, creado]);
      return creado;
    } catch (e) {
      setError(e.message || 'Error creando paciente');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const editarPaciente = async (id, cambios) => {
    setLoading(true); setError(null);
    try {
      const body = {
        ...cambios,
        ...(cambios.fechaCita !== undefined ? { fechaCita: normFecha(cambios.fechaCita) } : {})
      };
      const actualizado = await updatePaciente(id, body);
      setPacientes(prev => prev.map(p => p.id === id ? actualizado : p));
      return actualizado;
    } catch (e) {
      setError(e.message || 'Error actualizando paciente');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const eliminarPaciente = async (id) => {
    setLoading(true); setError(null);
    try {
      await deletePaciente(id);
      setPacientes(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError(e.message || 'Error eliminando paciente');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExpedientesCtx.Provider value={{ pacientes, loading, error, cargar, agregarPaciente, editarPaciente, eliminarPaciente }}>
      {children}
    </ExpedientesCtx.Provider>
  );
}
