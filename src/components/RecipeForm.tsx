import { useState, type ChangeEvent, type FormEvent } from "react";
import { IMAGENES, type Receta } from "../data";
import { agregarRecetaExtra, extraerIdYouTube } from "../lib/store";
import { IconCerrar, IconOlla, Modal } from "./ui";

const claseInput =
  "mt-1.5 w-full rounded-lg border-2 border-papel-2 bg-crema px-3.5 py-2.5 text-base text-tinta placeholder:text-uva-2/50 focus:border-uva focus:outline-none";
const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

export default function RecipeForm({
  onCerrar,
  onAgregada,
  onToast,
}: {
  onCerrar: () => void;
  onAgregada: () => void;
  onToast: (mensaje: string) => void;
}) {
  const [c, setC] = useState({
    nombre: "",
    categoria: "De fondo",
    region: "",
    tiempo: "",
    dificultad: "Media",
    porciones: "4",
    imagen: "",
    descripcion: "",
    video: "",
    ingredientes: "",
    pasos: "",
    tip: "",
  });
  const [error, setError] = useState("");

  const set =
    (campo: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setC({ ...c, [campo]: e.target.value });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (c.nombre.trim().length < 3) {
      setError("Escribe el nombre del plato (al menos 3 letras).");
      return;
    }
    if (!c.descripcion.trim()) {
      setError("Escribe una descripción corta del plato.");
      return;
    }
    if (!c.video.trim()) {
      setError("Pega el enlace del video tutorial de YouTube. Es obligatorio.");
      return;
    }
    const ingredientes = c.ingredientes.split("\n").map((s) => s.trim()).filter(Boolean);
    const pasos = c.pasos.split("\n").map((s) => s.trim()).filter(Boolean);
    if (ingredientes.length < 2) {
      setError("Escribe al menos 2 ingredientes, uno por línea.");
      return;
    }
    if (pasos.length < 2) {
      setError("Escribe al menos 2 pasos de preparación, uno por línea.");
      return;
    }

    const receta: Receta = {
      id: `propia-${Date.now()}`,
      nombre: c.nombre.trim(),
      categoria: c.categoria as Receta["categoria"],
      region: c.region.trim() || "Receta de la casa",
      tiempo: c.tiempo.trim() || "Por definir",
      dificultad: c.dificultad as Receta["dificultad"],
      porciones: Math.max(1, Number(c.porciones) || 4),
      imagen: c.imagen.trim() || IMAGENES.chicha,
      descripcion: c.descripcion.trim(),
      ingredientes,
      pasos,
      tip: c.tip.trim() || "Cocínala con cariño y compártela en familia.",
      video: extraerIdYouTube(c.video),
      propia: true,
    };

    agregarRecetaExtra(receta);
    onToast(`¡"${receta.nombre}" ya está publicada en el recetario!`);
    onAgregada();
    onCerrar();
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta="Publicar receta nueva">
      <div className="relative">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ventana"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors duration-300 hover:bg-rojo"
        >
          <IconCerrar className="h-5 w-5" />
        </button>

        <div className="bg-verde-2 px-6 pb-6 pt-9 text-crema sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aji-2">
            Solo para la cuenta de administrador
          </p>
          <h2 className="mt-1.5 font-display text-3xl font-black tracking-tight">
            Publicar receta nueva
          </h2>
          <p className="mt-1.5 text-crema/85">
            La receta aparecerá en el recetario, con su video tutorial y su
            botón verde de “Receta Aprendida”.
          </p>
        </div>

        <form onSubmit={enviar} className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2">
            <label htmlFor="rf-nombre" className={claseLabel}>Nombre del plato *</label>
            <input id="rf-nombre" value={c.nombre} onChange={set("nombre")} placeholder="Por ejemplo: Rocoto relleno" className={claseInput} />
          </div>

          <div>
            <label htmlFor="rf-categoria" className={claseLabel}>Categoría</label>
            <select id="rf-categoria" value={c.categoria} onChange={set("categoria")} className={claseInput}>
              <option>Entradas</option>
              <option>De fondo</option>
              <option>Postres</option>
              <option>Bebidas</option>
            </select>
          </div>

          <div>
            <label htmlFor="rf-dificultad" className={claseLabel}>Dificultad</label>
            <select id="rf-dificultad" value={c.dificultad} onChange={set("dificultad")} className={claseInput}>
              <option>Fácil</option>
              <option>Media</option>
              <option>Exigente</option>
            </select>
          </div>

          <div>
            <label htmlFor="rf-region" className={claseLabel}>Región u origen</label>
            <input id="rf-region" value={c.region} onChange={set("region")} placeholder="Por ejemplo: Arequipa" className={claseInput} />
          </div>

          <div>
            <label htmlFor="rf-tiempo" className={claseLabel}>Tiempo de preparación</label>
            <input id="rf-tiempo" value={c.tiempo} onChange={set("tiempo")} placeholder="Por ejemplo: 1 h 30 min" className={claseInput} />
          </div>

          <div>
            <label htmlFor="rf-porciones" className={claseLabel}>Porciones</label>
            <input id="rf-porciones" type="number" min={1} max={30} value={c.porciones} onChange={set("porciones")} className={claseInput} />
          </div>

          <div>
            <label htmlFor="rf-imagen" className={claseLabel}>Imagen (enlace, opcional)</label>
            <input id="rf-imagen" value={c.imagen} onChange={set("imagen")} placeholder="https://… (si se deja vacío usamos una de la casa)" className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="rf-video" className={claseLabel}>Video tutorial de YouTube *</label>
            <input id="rf-video" value={c.video} onChange={set("video")} placeholder="https://www.youtube.com/watch?v=…" className={claseInput} />
            <p className="mt-1.5 text-[13px] font-bold text-uva-2">
              Pega el enlace completo del video; se mostrará al final de la receta.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="rf-descripcion" className={claseLabel}>Descripción corta *</label>
            <textarea id="rf-descripcion" rows={2} value={c.descripcion} onChange={set("descripcion")} placeholder="¿Qué hace especial a este plato?" className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="rf-ingredientes" className={claseLabel}>Ingredientes * (uno por línea)</label>
            <textarea id="rf-ingredientes" rows={5} value={c.ingredientes} onChange={set("ingredientes")} placeholder={"500 g de carne\n2 cebollas moradas\n…"} className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="rf-pasos" className={claseLabel}>Preparación * (un paso por línea)</label>
            <textarea id="rf-pasos" rows={6} value={c.pasos} onChange={set("pasos")} placeholder={"Sazona la carne con sal y pimienta.\nSella a fuego fuerte…"} className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="rf-tip" className={claseLabel}>Consejo de la abuela (opcional)</label>
            <textarea id="rf-tip" rows={2} value={c.tip} onChange={set("tip")} placeholder="Un secreto de cocina para que salga perfecto…" className={claseInput} />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold leading-snug text-rojo-2 sm:col-span-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-verde px-6 py-3.5 text-lg font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde-2 sm:col-span-2"
          >
            <IconOlla className="h-6 w-6" /> Publicar receta
          </button>
        </form>
      </div>
    </Modal>
  );
}
