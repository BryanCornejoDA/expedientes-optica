// Base API: prefer env var VITE_API_URL; si no existe, apuntar por defecto a la API en Render
// Asegúrate en tu hosting (Vercel/Render) de definir VITE_API_URL si quieres sobrescribirlo.
const API = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  : 'https://expedientes-optica.onrender.com/api';

export const getPacientes = async () => {
  const res = await fetch(`${API}/pacientes`);
  if (!res.ok) throw new Error("Error al obtener pacientes");
  return res.json();
};

export const addPaciente = async (paciente) => {
  try {
    const res = await fetch(`${API}/pacientes`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(paciente)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("POST /pacientes status:", res.status, txt);
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("fetch POST /pacientes error:", err);
    throw err;
  }
};

export const updatePaciente = async (id, paciente) => {
  const res = await fetch(`${API}/pacientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente),
  });
  if (!res.ok) throw new Error("Error al actualizar paciente");
  return res.json();
};

export const deletePaciente = async (id) => {
  const res = await fetch(`${API}/pacientes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar paciente");
  return true;
};
