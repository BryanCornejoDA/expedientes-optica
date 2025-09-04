import { createContext, useContext, useState, useEffect } from "react";
import { getPacientes, addPaciente, updatePaciente, deletePaciente } from "../services/expedientesService.js";

const PacientesContext = createContext();

export const usePacientes = () => useContext(PacientesContext);

export const PacientesProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    getPacientes().then(setPacientes);
  }, []);

  const agregarPaciente = async (paciente) => {
    const nuevo = await addPaciente(paciente);
    setPacientes(prev => [...prev, nuevo]);
  };

  const editarPaciente = async (id, paciente) => {
    await updatePaciente(id, paciente);
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, ...paciente } : p));
  };

  const eliminarPaciente = async (id) => {
    await deletePaciente(id);
    setPacientes(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PacientesContext.Provider value={{ pacientes, agregarPaciente, editarPaciente, eliminarPaciente }}>
      {children}
    </PacientesContext.Provider>
  );
};
