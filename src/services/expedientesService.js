// expedienteService.js

let pacientesDB = [];

// 🔹 Generar 200 pacientes de prueba automáticamente
for (let i = 1; i <= 200; i++) {
  pacientesDB.push({
    id: i,
    nombre: `Paciente ${i}`,
    fechaCita: `2025-09-${String((i % 30) + 1).padStart(2, "0")}`, // Fechas de 01 a 30
    graduacion: (Math.random() * 4 - 2).toFixed(2), // Entre -2.00 y +2.00
  });
}

// 🔹 Simular llamadas a "BD"
export const getPacientes = async () => {
  return pacientesDB;
};

export const addPaciente = async (paciente) => {
  const nuevo = { id: pacientesDB.length + 1, ...paciente };
  pacientesDB.push(nuevo);
  return nuevo;
};

export const updatePaciente = async (id, paciente) => {
  const index = pacientesDB.findIndex((p) => p.id === id);
  if (index !== -1) {
    pacientesDB[index] = { ...pacientesDB[index], ...paciente };
  }
};

export const deletePaciente = async (id) => {
  pacientesDB = pacientesDB.filter((p) => p.id !== id);
};
