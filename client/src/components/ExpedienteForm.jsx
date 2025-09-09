import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DUI_RE   = /^\d{8}-\d$/;      // 12345678-9
const TEL_RE   = /^\d{7,9}$/;       // 7 a 9 dígitos
const NUM_RE   = /^-?\d+(\.\d+)?$/; // número con o sin decimales
const INT_RE   = /^\d+$/;

export default function ExpedienteForm({ pacienteActual, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    dui: "",
    telefono: "",
    tipoLentes: "",
    aro: "",
    tratamiento: "",
    rx: {
      OD: { esf: "", cil: "", eje: "", add: "", medidas: "" },
      OI: { esf: "", cil: "", eje: "", add: "", medidas: "" },
    },
    totalCancelado: "",
    fechaCita: "",
    notas: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pacienteActual) {
      setForm({
        ...pacienteActual,
        fechaCita: pacienteActual.fechaCita?.slice(0,10) || "",
      });
    }
  }, [pacienteActual]);

  const set = (path, value) => {
    setForm(prev => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      let cur = clone;
      while (keys.length > 1) cur = cur[keys.shift()];
      cur[keys[0]] = value;
      return clone;
    });
  };

  /** Valida TODO el formulario y devuelve { campo: "mensaje" } */
  const validate = (values) => {
    const e = {};

    // Requeridos simples
    if (!values.nombre || values.nombre.trim().length < 3) {
      e.nombre = "Ingrese un nombre (mínimo 3 caracteres).";
    }
    if (!values.dui || !DUI_RE.test(values.dui)) {
      e.dui = "DUI inválido. Formato: ########-#";
    }
    if (!values.telefono || !TEL_RE.test(values.telefono)) {
      e.telefono = "Teléfono inválido (7 a 9 dígitos).";
    }
    if (!values.tipoLentes) e.tipoLentes = "Seleccione el tipo de lentes.";
    if (!values.aro)        e.aro        = "Seleccione el aro.";
    if (!values.tratamiento) e.tratamiento = "Seleccione el tratamiento.";

    // Fecha
    if (!values.fechaCita) {
      e.fechaCita = "Seleccione la fecha.";
    } else if (isNaN(new Date(values.fechaCita).getTime())) {
      e.fechaCita = "Fecha inválida.";
    }

    // Total cancelado
    if (values.totalCancelado === "" || values.totalCancelado === null) {
      e.totalCancelado = "Ingrese el total cancelado.";
    } else if (!NUM_RE.test(values.totalCancelado)) {
      e.totalCancelado = "Debe ser numérico.";
    } else if (parseFloat(values.totalCancelado) < 0) {
      e.totalCancelado = "No puede ser negativo.";
    }

    // RX helper: valida un ojo
    const validaOjo = (ojo, prefix) => {
      const { esf, cil, eje, add } = ojo;

      const mustBeNumber = (val, label) => {
        if (val === "" || val === null) return; // opcional: si está vacío, no valida
        if (!NUM_RE.test(String(val))) e[prefix + label] = `${label} debe ser numérico.`;
      };
      mustBeNumber(esf, "ESF");
      mustBeNumber(cil, "CIL");
      mustBeNumber(add, "ADD");

      if (eje !== "" && eje !== null) {
        if (!INT_RE.test(String(eje))) e[prefix + "EJE"] = "EJE debe ser entero.";
        else if (parseInt(eje, 10) < 0 || parseInt(eje, 10) > 180)
          e[prefix + "EJE"] = "EJE debe estar entre 0 y 180.";
      }
    };

    validaOjo(values.rx?.OD ?? {}, "OD_");
    validaOjo(values.rx?.OI ?? {}, "OI_");

    return e;
  };

  // Para resaltar inputs con error
  const errClass = (name) =>
    errors[name] ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  const submit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    // normaliza fecha a YYYY-MM-DD
    const payload = { ...form, fechaCita: form.fechaCita || "" };
    onSubmit(payload);
  };

  // validación por campo al salir (blur)
  const validateField = (fieldPath) => {
    const v = validate(form);
    setErrors(prev => ({ ...prev, [fieldPath]: v[fieldPath] }));
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre</Label>
          <Input
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            onBlur={() => validateField("nombre")}
            className={errClass("nombre")}
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <Label>DUI</Label>
          <Input
            value={form.dui}
            onChange={(e) => set("dui", e.target.value)}
            onBlur={() => validateField("dui")}
            placeholder="00000000-0"
            className={errClass("dui")}
            aria-invalid={!!errors.dui}
          />
          {errors.dui && <p className="mt-1 text-xs text-red-600">{errors.dui}</p>}
        </div>

        <div>
          <Label>Teléfono</Label>
          <Input
            value={form.telefono}
            onChange={(e) => set("telefono", e.target.value.replace(/\D/g, ""))}
            onBlur={() => validateField("telefono")}
            placeholder="Solo dígitos"
            className={errClass("telefono")}
            aria-invalid={!!errors.telefono}
          />
          {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
        </div>

        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            value={form.fechaCita}
            onChange={(e) => set("fechaCita", e.target.value)}
            onBlur={() => validateField("fechaCita")}
            className={errClass("fechaCita")}
            aria-invalid={!!errors.fechaCita}
          />
          {errors.fechaCita && <p className="mt-1 text-xs text-red-600">{errors.fechaCita}</p>}
        </div>

        <div>
          <Label>Tipo de Lentes</Label>
          <Select
            value={form.tipoLentes}
            onChange={(e) => set("tipoLentes", e.target.value)}
            onBlur={() => validateField("tipoLentes")}
            className={errClass("tipoLentes")}
            aria-invalid={!!errors.tipoLentes}
          >
            <option value="">Seleccione…</option>
            <option value="Monofocales">Monofocales</option>
            <option value="Bifocales">Bifocales</option>
            <option value="Progresivos">Progresivos</option>
          </Select>
          {errors.tipoLentes && <p className="mt-1 text-xs text-red-600">{errors.tipoLentes}</p>}
        </div>

        <div>
          <Label>Aro</Label>
          <Select
            value={form.aro}
            onChange={(e) => set("aro", e.target.value)}
            onBlur={() => validateField("aro")}
            className={errClass("aro")}
            aria-invalid={!!errors.aro}
          >
            <option value="">Seleccione…</option>
            <option value="Metal">Metal</option>
            <option value="Plástico">Plástico</option>
            <option value="Carey">Carey</option>
          </Select>
          {errors.aro && <p className="mt-1 text-xs text-red-600">{errors.aro}</p>}
        </div>

        <div>
          <Label>Tratamiento</Label>
          <Select
            value={form.tratamiento}
            onChange={(e) => set("tratamiento", e.target.value)}
            onBlur={() => validateField("tratamiento")}
            className={errClass("tratamiento")}
            aria-invalid={!!errors.tratamiento}
          >
            <option value="">Seleccione…</option>
            <option value="Normal">Normal</option>
            <option value="antirreflejante (AR)">antirreflejante (AR)</option>
            <option value="Fotocromático">Fotocromático</option>
          </Select>
          {errors.tratamiento && <p className="mt-1 text-xs text-red-600">{errors.tratamiento}</p>}
        </div>

        <div>
          <Label>Total Cancelado</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.totalCancelado}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || parseFloat(val) >= 0) set("totalCancelado", val);
            }}
            onBlur={() => validateField("totalCancelado")}
            className={errClass("totalCancelado")}
            aria-invalid={!!errors.totalCancelado}
          />
          {errors.totalCancelado && (
            <p className="mt-1 text-xs text-red-600">{errors.totalCancelado}</p>
          )}
        </div>
      </div>

      {/* RX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OD */}
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">RX OD</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ESF</Label>
              <Input value={form.rx.OD.esf} onChange={(e)=>set("rx.OD.esf", e.target.value)} />
              {errors.OD_ESF && <p className="mt-1 text-xs text-red-600">{errors.OD_ESF}</p>}
            </div>
            <div>
              <Label>CIL</Label>
              <Input value={form.rx.OD.cil} onChange={(e)=>set("rx.OD.cil", e.target.value)} />
              {errors.OD_CIL && <p className="mt-1 text-xs text-red-600">{errors.OD_CIL}</p>}
            </div>
            <div>
              <Label>EJE</Label>
              <Input value={form.rx.OD.eje} onChange={(e)=>set("rx.OD.eje", e.target.value)} />
              {errors.OD_EJE && <p className="mt-1 text-xs text-red-600">{errors.OD_EJE}</p>}
            </div>
            <div>
              <Label>ADD</Label>
              <Input value={form.rx.OD.add} onChange={(e)=>set("rx.OD.add", e.target.value)} />
              {errors.OD_ADD && <p className="mt-1 text-xs text-red-600">{errors.OD_ADD}</p>}
            </div>
            <div className="col-span-2">
              <Label>Medidas</Label>
              <Input value={form.rx.OD.medidas} onChange={(e)=>set("rx.OD.medidas", e.target.value)} />
            </div>
          </div>
        </div>

        {/* OI */}
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">RX OI</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ESF</Label>
              <Input value={form.rx.OI.esf} onChange={(e)=>set("rx.OI.esf", e.target.value)} />
              {errors.OI_ESF && <p className="mt-1 text-xs text-red-600">{errors.OI_ESF}</p>}
            </div>
            <div>
              <Label>CIL</Label>
              <Input value={form.rx.OI.cil} onChange={(e)=>set("rx.OI.cil", e.target.value)} />
              {errors.OI_CIL && <p className="mt-1 text-xs text-red-600">{errors.OI_CIL}</p>}
            </div>
            <div>
              <Label>EJE</Label>
              <Input value={form.rx.OI.eje} onChange={(e)=>set("rx.OI.eje", e.target.value)} />
              {errors.OI_EJE && <p className="mt-1 text-xs text-red-600">{errors.OI_EJE}</p>}
            </div>
            <div>
              <Label>ADD</Label>
              <Input value={form.rx.OI.add} onChange={(e)=>set("rx.OI.add", e.target.value)} />
              {errors.OI_ADD && <p className="mt-1 text-xs text-red-600">{errors.OI_ADD}</p>}
            </div>
            <div className="col-span-2">
              <Label>Medidas</Label>
              <Input value={form.rx.OI.medidas} onChange={(e)=>set("rx.OI.medidas", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div>
        <Label>Notas</Label>
        <Textarea
          placeholder="Observaciones relevantes…"
          value={form.notas}
          onChange={(e)=>set("notas", e.target.value)}
        />
      </div>

      {/* Acciones */}
      <div className="mt-2 flex items-center gap-2">
        <Button className="btn-green" type="submit">
          {pacienteActual ? "Guardar cambios" : "Registrar"}
        </Button>
        <Button className="btn-outline" type="button" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
