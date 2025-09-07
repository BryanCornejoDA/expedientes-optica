
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
    // Aseguramos un ID único si no viene
    const id = paciente.id ?? (pacientes.length ? Math.max(...pacientes.map(p => p.id)) + 1 : 1);

    // Creamos estructura completa con los campos nuevos
    const nuevoPaciente = {
      id,
      nombre: paciente.nombre || "",
      dui: paciente.dui || "",
      telefono: paciente.telefono || "",
      tipoLentes: paciente.tipoLentes || "",
      aro: paciente.aro || "",
      tratamiento: paciente.tratamiento || "",
      rx: {
        OD: {
          esf: paciente.rx?.OD?.esf || "",
          cil: paciente.rx?.OD?.cil || "",
          eje: paciente.rx?.OD?.eje || "",
          add: paciente.rx?.OD?.add || "",
        },
        OI: {
          esf: paciente.rx?.OI?.esf || "",
          cil: paciente.rx?.OI?.cil || "",
          eje: paciente.rx?.OI?.eje || "",
          add: paciente.rx?.OI?.add || "",
        }
      },
      totalCancelado: paciente.totalCancelado || 0,
      fechaCita: paciente.fechaCita || "",
    };

    const agregado = await addPaciente(nuevoPaciente);
    setPacientes(prev => [...prev, agregado]);
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
