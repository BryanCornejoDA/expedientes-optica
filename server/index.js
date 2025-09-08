import fs from "fs";
import os from "os";
import path from "path";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS simple (dev)
app.use(cors());
app.use(express.json());

// ✅ Usa un directorio de datos fuera de OneDrive por defecto
const DATA_DIR = process.env.DATA_DIR
  || path.join(os.homedir(), "expedientes-optica-data");
const DB_FILE = path.join(DATA_DIR, "pacientes.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]", "utf-8");
  } catch (e) {
    console.error("No se pudo preparar el archivo de datos:", e);
  }
}

function leerPacientes() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error("Error leyendo pacientes.json:", e);
    return [];
  }
}

function guardarPacientes(pacientes) {
  ensureDataFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(pacientes, null, 2), "utf-8");
  } catch (e) {
    console.error("Error guardando pacientes.json:", e);
    // No tirar el server. Responderá 500 en el endpoint que llamó.
    throw e;
  }
}

// ENDPOINTS
// PUT: actualizar por id
app.put("/api/pacientes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const pacientes = leerPacientes();
    const idx = pacientes.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "No encontrado" });

    // id inmutable
    pacientes[idx] = { ...pacientes[idx], ...req.body, id };
    guardarPacientes(pacientes);
    res.json(pacientes[idx]);
  } catch (e) {
    console.error("PUT /api/pacientes/:id", e);
    res.status(500).json({ error: "Error actualizando paciente" });
  }
});

// DELETE: eliminar por id
app.delete("/api/pacientes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const pacientes = leerPacientes();
    if (!pacientes.some(p => p.id === id)) {
      return res.status(404).json({ error: "No encontrado" });
    }
    const nuevos = pacientes.filter(p => p.id !== id);
    guardarPacientes(nuevos);
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /api/pacientes/:id", e);
    res.status(500).json({ error: "Error eliminando paciente" });
  }
});

app.get("/api/pacientes", (req, res) => {
  const { q = "", fecha = "" } = req.query;
  const data = leerPacientes().filter(p => {
    const matchQ = q
      ? (p.nombre?.toLowerCase().includes(String(q).toLowerCase())
        || String(p.id).includes(q)
        || p.dui?.includes(q))
      : true;
    const matchFecha = fecha ? p.fechaCita === fecha : true;
    return matchQ && matchFecha;
  });
  res.json(data);
});

app.post("/api/pacientes", (req, res) => {
  try {
    const pacientes = leerPacientes();
    const nextId = pacientes.length ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
    const nuevo = { id: nextId, ...req.body };
    pacientes.push(nuevo);
    guardarPacientes(pacientes);
    res.status(201).json(nuevo);
  } catch (e) {
    console.error("POST /api/pacientes falló:", e);
    res.status(500).json({ error: "Error guardando paciente" });
  }
});

// Healthcheck
app.get("/", (_, res) => res.send("Optica Expedientes API OK"));

// Evita que un error no capturado mate el proceso en dev
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`API OK en http://localhost:${PORT}`);
});
