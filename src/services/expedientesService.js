// expedienteService.js

let pacientesDB = [];

// 🔹 Generar 200 pacientes de prueba automáticamente
for (let i = 1; i <= 200; i++) {
  pacientesDB.push({
    id: i,
    nombre: `Paciente ${i}`,
    dui: `${String(10000000 + i).padStart(8,"0")}-${i % 10}`,
    telefono: `7${String(1000000 + i).padStart(7,"0")}`,
    tipoLentes: ["Monofocal","Bifocal","Progresivo"][i % 3],
    aro: ["Metal","Plastic","Mixto"][i % 3],
    tratamiento: ["Normal","Terapéutico","Cosmético"][i % 3],
    rx: {
      OD: { esf: (Math.random()*4-2).toFixed(2), cil: (Math.random()*2-1).toFixed(2), eje: Math.floor(Math.random()*180), add: (Math.random()*3).toFixed(2) },
      OI: { esf: (Math.random()*4-2).toFixed(2), cil: (Math.random()*2-1).toFixed(2), eje: Math.floor(Math.random()*180), add: (Math.random()*3).toFixed(2) }
    },
    totalCancelado: (Math.random()*500+50).toFixed(2),
    fechaCita: `2025-09-${String((i % 30) + 1).padStart(2, "0")}`
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
