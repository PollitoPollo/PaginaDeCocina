import { useState, type ChangeEvent, type FormEvent } from "react";
import type { PlatoTop } from "../data";
import {
  editarPlatoTop,
  extraerIdYouTube,
  getTop10,
  abrirRedes,
} from "../lib/store";
import {
  IconCerrar,
  IconEditar,
  IconEstrella,
  IconExterno,
  IconLlama,
  IconPersonas,
  IconRedes,
  IconReloj,
  Modal,
  Reveal,
} from "../components/ui";

const ORO = "#d3a847";
const ORO_CLARO = "#f1d489";
const CREMA_TOP = "#f2e6cf";
const FONDO = "#171110";
const PANEL = "#221a15";

const fuerzaDificultad = (d: PlatoTop["dificultad"]) =>
  d === "Fácil" ? 1 : d === "Media" ? 2 : 3;

function Estrellas({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  const llenas = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <IconEstrella
          key={i}
          className={`${className} ${i < llenas ? "text-[#f1d489]" : "text-[#f2e6cf]/25"}`}
        />
      ))}
    </span>
  );
}

function Rombo() {
  return <span aria-hidden="true" className="mx-3 inline-block h-2 w-2 rotate-45 bg-[#d3a847]" />;
}

const claseInput =
  "mt-1.5 w-full rounded-lg border-2 border-[#3a2d22] bg-[#171110] px-3.5 py-2.5 text-base text-[#f2e6cf] placeholder:text-[#8a7a63] focus:border-[#d3a847] focus:outline-none";
const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

function FormEditar({
  plato,
  onCerrar,
  onListo,
}: {
  plato: PlatoTop;
  onCerrar: () => void;
  onListo: (mensaje: string) => void;
}) {
  const [c, setC] = useState({
    nombre: plato.nombre,
    origen: plato.origen,
    rating: String(plato.rating),
    votos: plato.votos,
    tiempo: plato.tiempo,
    dificultad: plato.dificultad,
    porciones: String(plato.porciones),
    imagen: plato.imagen,
    video: plato.video,
    descripcion: plato.descripcion,
    veredicto: plato.veredicto,
    ingredientes: plato.ingredientes.join("\n"),
    pasos: plato.pasos.join("\n"),
    tip: plato.tip,
  });
  const [error, setError] = useState("");

  const set =
    (campo: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setC({ ...c, [campo]: e.target.value });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (c.nombre.trim().length < 3) return setError("Escribe el nombre del plato.");
    if (!c.video.trim()) return setError("El video tutorial de YouTube es obligatorio.");
    const ingredientes = c.ingredientes.split("\n").map((s) => s.trim()).filter(Boolean);
    const pasos = c.pasos.split("\n").map((s) => s.trim()).filter(Boolean);
    if (ingredientes.length < 2) return setError("Escribe al menos 2 ingredientes, uno por línea.");
    if (pasos.length < 2) return setError("Escribe al menos 2 pasos, uno por línea.");
    const rating = Math.min(5, Math.max(1, Number(c.rating) || 5));
    editarPlatoTop(plato.id, {
      ...plato,
      nombre: c.nombre.trim(),
      origen: c.origen.trim() || plato.origen,
      rating,
      votos: c.votos.trim() || plato.votos,
      tiempo: c.tiempo.trim() || plato.tiempo,
      dificultad: c.dificultad as PlatoTop["dificultad"],
      porciones: Math.max(1, Number(c.porciones) || plato.porciones),
      imagen: c.imagen.trim() || plato.imagen,
      video: extraerIdYouTube(c.video),
      descripcion: c.descripcion.trim() || plato.descripcion,
      veredicto: c.veredicto.trim() || plato.veredicto,
      ingredientes,
      pasos,
      tip: c.tip.trim() || plato.tip,
    });
    onListo(`"${c.nombre.trim()}" actualizado en el Top 10.`);
    onCerrar();
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta={`Editar ${plato.nombre}`}>
      <div className="relative">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ventana"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#f2e6cf]/20 text-[#f2e6cf] transition-colors duration-300 hover:bg-[#8e2434]"
        >
          <IconCerrar className="h-5 w-5" />
        </button>
        <div className="bg-[#221a15] px-6 pb-6 pt-9 text-[#f2e6cf] sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d3a847]">
            Solo administrador · Puesto {plato.puesto}
          </p>
          <h2 className="mt-1.5 font-display text-3xl font-black">Editar plato del Top 10</h2>
        </div>
        <form onSubmit={enviar} className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <label htmlFor="tp-nombre" className={claseLabel}>Nombre *</label>
            <input id="tp-nombre" value={c.nombre} onChange={set("nombre")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-origen" className={claseLabel}>Origen</label>
            <input id="tp-origen" value={c.origen} onChange={set("origen")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-rating" className={claseLabel}>Calificación (1 a 5)</label>
            <input id="tp-rating" type="number" min={1} max={5} step={0.1} value={c.rating} onChange={set("rating")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-votos" className={claseLabel}>Votos del jurado</label>
            <input id="tp-votos" value={c.votos} onChange={set("votos")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-tiempo" className={claseLabel}>Tiempo</label>
            <input id="tp-tiempo" value={c.tiempo} onChange={set("tiempo")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-dificultad" className={claseLabel}>Dificultad</label>
            <select id="tp-dificultad" value={c.dificultad} onChange={set("dificultad")} className={claseInput}>
              <option>Fácil</option>
              <option>Media</option>
              <option>Exigente</option>
            </select>
          </div>
          <div>
            <label htmlFor="tp-porciones" className={claseLabel}>Porciones</label>
            <input id="tp-porciones" type="number" min={1} max={30} value={c.porciones} onChange={set("porciones")} className={claseInput} />
          </div>
          <div>
            <label htmlFor="tp-video" className={claseLabel}>Video de YouTube *</label>
            <input id="tp-video" value={c.video} onChange={set("video")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-imagen" className={claseLabel}>Imagen del plato</label>
            <input id="tp-imagen" value={c.imagen} onChange={set("imagen")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-descripcion" className={claseLabel}>Descripción</label>
            <textarea id="tp-descripcion" rows={2} value={c.descripcion} onChange={set("descripcion")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-veredicto" className={claseLabel}>Veredicto del jurado</label>
            <textarea id="tp-veredicto" rows={2} value={c.veredicto} onChange={set("veredicto")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-ingredientes" className={claseLabel}>Ingredientes (uno por línea)</label>
            <textarea id="tp-ingredientes" rows={5} value={c.ingredientes} onChange={set("ingredientes")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-pasos" className={claseLabel}>Preparación (un paso por línea)</label>
            <textarea id="tp-pasos" rows={5} value={c.pasos} onChange={set("pasos")} className={claseInput} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tp-tip" className={claseLabel}>Consejo del chef</label>
            <textarea id="tp-tip" rows={2} value={c.tip} onChange={set("tip")} className={claseInput} />
          </div>
          {error && (
            <p role="alert" className="rounded-lg border-2 border-rojo/50 bg-rojo/10 px-4 py-3 text-sm font-bold text-rojo-2 sm:col-span-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#d3a847] px-6 py-3.5 text-lg font-bold text-[#171110] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1d489] sm:col-span-2"
          >
            <IconEditar className="h-5 w-5" /> Guardar cambios
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default function Top10({
  esAdmin,
  avisar,
}: {
  esAdmin: boolean;
  avisar: (mensaje: string) => void;
}) {
  const [platos, setPlatos] = useState<PlatoTop[]>(() => getTop10());
  const [abierto, setAbierto] = useState<PlatoTop | null>(null);
  const [editando, setEditando] = useState<PlatoTop | null>(null);

  const refrescar = () => setPlatos(getTop10());

  return (
    <div className="min-h-screen" style={{ backgroundColor: FONDO }}>
      {/* Cabecera de gala */}
      <section className="relative overflow-hidden pb-20 pt-44 text-[#f2e6cf]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #d3a847 0%, transparent 62%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #8e2434 0%, transparent 62%)" }}
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 right-0 select-none font-display text-[26vw] font-black italic leading-none text-[#f2e6cf]/[0.04]"
        >
          2025
        </p>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="flex items-center justify-center text-sm font-bold uppercase tracking-[0.3em] text-[#d3a847]">
              <span className="h-px w-12 bg-[#d3a847]/70" />
              La gala del sabor
              <span className="h-px w-12 bg-[#d3a847]/70" />
            </p>
            <h1 className="mt-6 font-display text-6xl font-black italic leading-none tracking-tight sm:text-8xl">
              Top <span className="text-[#d3a847]">10</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#f2e6cf]/80 sm:text-xl">
              Los diez platos mejor calificados del 2025, elegidos plato a plato
              por nuestro jurado de cocineras y cocineros de casa. Receta
              completa, veredicto y video tutorial, como en una gala.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 flex items-center justify-center text-sm font-bold uppercase tracking-[0.22em] text-[#f2e6cf]/60">
              Edición 2025 <Rombo /> {platos.length} platos galardonados <Rombo /> Jurado popular
            </p>
          </Reveal>
        </div>
      </section>

      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-transparent via-[#d3a847] to-transparent" />

      {/* Podio de platos */}
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          {platos.map((plato, i) => (
            <Reveal key={plato.id} delay={(i % 2) * 110}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#d3a847]/25 shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-[#d3a847]/60 hover:shadow-[0_26px_55px_rgba(0,0,0,0.6)]"
                style={{ backgroundColor: PANEL }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={plato.imagen}
                    alt={plato.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#171110]/85 via-transparent to-transparent"
                  />
                  {/* Calificación del jurado, en la esquina inferior derecha */}
                  <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-[#171110]/90 px-3 py-1.5 shadow-lg">
                    <Estrellas rating={plato.rating} className="h-3.5 w-3.5" />
                    <span className="font-display text-sm font-black text-[#f1d489]">
                      {plato.rating.toFixed(1)}
                    </span>
                  </span>
                  {plato.puesto <= 3 && (
                    <span
                      className="absolute left-3 top-3 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#171110] shadow-lg"
                      style={{
                        backgroundColor:
                          plato.puesto === 1 ? "#f1d489" : plato.puesto === 2 ? "#c9c9c9" : "#cd8f52",
                      }}
                    >
                      {plato.puesto === 1 ? "Oro 2025" : plato.puesto === 2 ? "Plata 2025" : "Bronce 2025"}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-6xl font-black italic leading-none"
                      style={{ WebkitTextStroke: `2px ${ORO}`, color: "transparent" }}
                    >
                      {String(plato.puesto).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d3a847]">
                        {plato.origen}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-black leading-tight text-[#f2e6cf]">
                        {plato.nombre}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold text-[#f2e6cf]/65">
                    <span className="inline-flex items-center gap-1.5">
                      <IconReloj className="h-4 w-4 text-[#d3a847]" /> {plato.tiempo}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {Array.from({ length: 3 }).map((_, li) => (
                        <IconLlama
                          key={li}
                          className={`h-4 w-4 ${li < fuerzaDificultad(plato.dificultad) ? "text-[#d3a847]" : "text-[#f2e6cf]/20"}`}
                        />
                      ))}
                      {plato.dificultad}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IconPersonas className="h-4 w-4 text-[#d3a847]" /> {plato.porciones} porciones
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f2e6cf]/45">
                    {plato.votos}
                  </p>

                  <blockquote
                    className="mt-4 border-l-4 pl-4 font-display text-base italic leading-relaxed text-[#f1d489]/90"
                    style={{ borderColor: ORO }}
                  >
                    “{plato.veredicto}”
                  </blockquote>

                  <p className="mt-3 flex-1 leading-relaxed text-[#f2e6cf]/75">{plato.descripcion}</p>

                  <button
                    type="button"
                    onClick={() => setAbierto(plato)}
                    className="mt-6 rounded-lg border-2 border-[#d3a847] px-5 py-3 font-bold text-[#f1d489] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d3a847] hover:text-[#171110] hover:shadow-[0_12px_26px_rgba(211,168,71,0.25)]"
                  >
                    Ver receta, video y más
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-16 text-center font-display text-lg italic text-[#f2e6cf]/55">
            El jurado vuelve a reunirse en diciembre. Mientras tanto, la cocina sigue abierta.
          </p>
        </Reveal>
      </main>

      {/* Ventana del plato */}
      <Modal
        abierto={!!abierto}
        onCerrar={() => setAbierto(null)}
        etiqueta={abierto ? `${abierto.nombre}, puesto ${abierto.puesto}` : "Plato del Top 10"}
      >
        {abierto && (
          <div>
            <div className="relative">
              <img src={abierto.imagen} alt={abierto.nombre} className="h-60 w-full object-cover sm:h-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171110]/95 via-[#171110]/30 to-transparent" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setAbierto(null)}
                aria-label="Cerrar ventana"
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[#171110]/70 text-[#f2e6cf] transition-colors duration-300 hover:bg-[#8e2434]"
              >
                <IconCerrar className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.22em] text-[#d3a847]">
                  Puesto {String(abierto.puesto).padStart(2, "0")} · {abierto.origen}
                </p>
                <h3 className="mt-1 font-display text-3xl font-black tracking-tight text-[#f2e6cf] sm:text-4xl">
                  {abierto.nombre}
                </h3>
                <p className="mt-2 flex items-center gap-2.5">
                  <Estrellas rating={abierto.rating} />
                  <span className="font-display text-lg font-black text-[#f1d489]">
                    {abierto.rating.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-[#f2e6cf]/70">· {abierto.votos}</span>
                </p>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-10">
              <div className="flex flex-wrap gap-3 text-sm font-bold text-uva">
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  <IconReloj className="h-4 w-4 text-rojo" /> {abierto.tiempo}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  {Array.from({ length: 3 }).map((_, li) => (
                    <IconLlama
                      key={li}
                      className={`h-4 w-4 ${li < fuerzaDificultad(abierto.dificultad) ? "text-rojo" : "text-uva-2/25"}`}
                    />
                  ))}
                  {abierto.dificultad}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  <IconPersonas className="h-4 w-4 text-rojo" /> {abierto.porciones} porciones
                </span>
              </div>

              <blockquote className="mt-6 border-l-4 border-[#d3a847] bg-[#221a15] px-5 py-4 font-display text-lg italic leading-relaxed text-[#f1d489]">
                “{abierto.veredicto}”
                <span className="mt-1 block text-xs font-black not-italic uppercase tracking-[0.2em] text-[#f2e6cf]/50">
                  Veredicto del jurado 2025
                </span>
              </blockquote>

              <p className="mt-6 text-lg leading-relaxed text-uva">{abierto.descripcion}</p>

              <div className="mt-9 grid gap-10 md:grid-cols-[1fr_1.35fr]">
                <div>
                  <h4 className="font-display text-2xl font-black text-tinta">Ingredientes</h4>
                  <ul className="mt-4 space-y-2.5">
                    {abierto.ingredientes.map((ing) => (
                      <li key={ing} className="flex gap-3 leading-snug text-uva">
                        <IconEstrella className="mt-1 h-3.5 w-3.5 shrink-0 text-[#d3a847]" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-black text-tinta">Preparación</h4>
                  <ol className="mt-4 space-y-4">
                    {abierto.pasos.map((paso, i) => (
                      <li key={paso} className="flex gap-4">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#221a15] font-display text-sm font-black text-[#f1d489]">
                          {i + 1}
                        </span>
                        <span className="pt-1 leading-relaxed text-uva">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-9 rounded-xl border-l-8 border-[#d3a847] bg-papel-2 p-5">
                <p className="font-display text-lg font-black text-tinta">El consejo del chef</p>
                <p className="mt-1.5 leading-relaxed text-uva">{abierto.tip}</p>
              </div>

              <div className="mt-11">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-display text-2xl font-black text-tinta">Video tutorial</h4>
                  <a
                    href={`https://www.youtube.com/watch?v=${abierto.video}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-[#8a6420] transition-colors duration-300 hover:text-[#d3a847]"
                  >
                    Verlo directo en YouTube <IconExterno className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-4 aspect-video overflow-hidden rounded-xl border-2 border-tinta/10 bg-[#171110] shadow-lg">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${abierto.video}`}
                    title={`Video tutorial de ${abierto.nombre}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Botones: editar receta (admin) y Redes */}
              <div className="mt-11 flex flex-wrap items-center justify-center gap-4 border-t-2 border-tinta/10 pt-8">
                {esAdmin && (
                  <button
                    type="button"
                    onClick={() => setEditando(abierto)}
                    className="inline-flex items-center gap-2.5 rounded-lg bg-[#d3a847] px-6 py-3 text-base font-bold text-[#171110] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1d489] hover:shadow-lg"
                  >
                    <IconEditar className="h-5 w-5" /> Editar receta
                  </button>
                )}
                <button
                  type="button"
                  onClick={abrirRedes}
                  className="inline-flex items-center gap-2.5 rounded-lg border-2 border-uva px-6 py-[0.68rem] text-base font-bold text-uva transition-all duration-300 hover:-translate-y-0.5 hover:bg-uva hover:text-crema"
                >
                  <IconRedes className="h-5 w-5" /> Redes
                </button>
              </div>
              <p className="mt-3 text-center text-xs font-bold text-uva-2">
                “Redes” abre el Facebook y el YouTube del creador en pestañas nuevas.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {editando && (
        <FormEditar
          plato={editando}
          onCerrar={() => setEditando(null)}
          onListo={(mensaje) => {
            refrescar();
            setAbierto(null);
            avisar(mensaje);
          }}
        />
      )}
    </div>
  );
}
