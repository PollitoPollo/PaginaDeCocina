import {
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { PAISES, type PaisSeccion, type RecetaMundo } from "../data";
import {
  agregarRecetaInternacional,
  extraerIdYouTube,
  recetasInternacionalExtra,
} from "../lib/store";
import {
  IconCheck,
  IconCerrar,
  IconExterno,
  IconMas,
  IconOlla,
  IconPersonas,
  IconReloj,
  IconLlama,
  Modal,
  Reveal,
} from "../components/ui";

function Bandera({
  pais,
  className = "h-5 w-8",
}: {
  pais: PaisSeccion;
  className?: string;
}) {
  const { bandas, orient } = pais.bandera;
  const gradiente =
    orient === "v"
      ? `linear-gradient(90deg, ${bandas[0]} 0 33.4%, ${bandas[1]} 33.4% 66.7%, ${bandas[2]} 66.7% 100%)`
      : `linear-gradient(180deg, ${bandas[0]} 0 28%, ${bandas[1]} 28% 72%, ${bandas[2]} 72% 100%)`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 overflow-hidden rounded-[4px] shadow ring-1 ring-tinta/15 ${className}`}
      style={{ background: gradiente }}
    />
  );
}

const fuerzaDificultad = (d: RecetaMundo["dificultad"]) =>
  d === "Fácil" ? 1 : d === "Media" ? 2 : 3;

/* ---------- Formulario del administrador: receta internacional con foto ---------- */

const claseInput =
  "mt-1.5 w-full rounded-lg border-2 border-papel-2 bg-crema px-3.5 py-2.5 text-base text-tinta placeholder:text-uva-2/50 focus:border-uva focus:outline-none";
const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

function FormRecetaMundo({
  pais,
  onCerrar,
  onListo,
}: {
  pais: PaisSeccion;
  onCerrar: () => void;
  onListo: (receta: RecetaMundo) => void;
}) {
  const [c, setC] = useState({
    nombre: "",
    origen: "",
    tiempo: "",
    dificultad: "Media",
    porciones: "4",
    imagen: "",
    video: "",
    descripcion: "",
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
    const ingredientes = c.ingredientes.split("\n").map((s) => s.trim()).filter(Boolean);
    const pasos = c.pasos.split("\n").map((s) => s.trim()).filter(Boolean);
    if (c.nombre.trim().length < 3)
      return setError("Escribe el nombre del plato (al menos 3 letras).");
    if (!/^https?:\/\//.test(c.imagen.trim()))
      return setError("La foto es obligatoria: pega un enlace de imagen que empiece con http:// o https://");
    if (!c.video.trim())
      return setError("Pega el enlace del video tutorial de YouTube.");
    if (!c.descripcion.trim())
      return setError("Escribe una descripción corta del plato.");
    if (ingredientes.length < 2)
      return setError("Escribe al menos 2 ingredientes, uno por línea.");
    if (pasos.length < 2)
      return setError("Escribe al menos 2 pasos de preparación, uno por línea.");

    const receta: RecetaMundo = {
      id: `intl-${Date.now()}`,
      nombre: c.nombre.trim(),
      origen: c.origen.trim() || `Cocina de ${pais.nombre}`,
      tiempo: c.tiempo.trim() || "Por definir",
      dificultad: c.dificultad as RecetaMundo["dificultad"],
      porciones: Math.max(1, Number(c.porciones) || 4),
      descripcion: c.descripcion.trim(),
      ingredientes,
      pasos,
      video: extraerIdYouTube(c.video),
      tip: c.tip.trim() || "Cocínala con cariño y compártela en familia.",
      imagen: c.imagen.trim(),
      propia: true,
      pais: pais.id,
    };
    agregarRecetaInternacional(receta);
    onListo(receta);
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta={`Agregar receta de ${pais.nombre}`}>
      <div className="relative">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ventana"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors duration-300 hover:bg-rojo"
        >
          <IconCerrar className="h-5 w-5" />
        </button>

        <div className="px-6 pb-6 pt-9 text-crema sm:px-8" style={{ backgroundColor: pais.colores.acc1 }}>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-crema/85">
            <Bandera pais={pais} className="h-4 w-6" /> Solo para la cuenta de administrador
          </p>
          <h2 className="mt-1.5 font-display text-3xl font-black tracking-tight">
            Nueva receta de {pais.nombre}
          </h2>
          <p className="mt-1.5 text-crema/85">
            Aparecerá en la mesa de {pais.nombre}, con su foto, su video y su botón verde.
          </p>
        </div>

        <form onSubmit={enviar} className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2">
            <label htmlFor="im-nombre" className={claseLabel}>Nombre del plato *</label>
            <input id="im-nombre" value={c.nombre} onChange={set("nombre")} placeholder="Por ejemplo: Osobuco a la milanesa" className={claseInput} />
          </div>

          <div>
            <label htmlFor="im-origen" className={claseLabel}>Región u origen</label>
            <input id="im-origen" value={c.origen} onChange={set("origen")} placeholder={`Por ejemplo: Lombardía, ${pais.nombre}`} className={claseInput} />
          </div>

          <div>
            <label htmlFor="im-tiempo" className={claseLabel}>Tiempo de preparación</label>
            <input id="im-tiempo" value={c.tiempo} onChange={set("tiempo")} placeholder="Por ejemplo: 1 h 20 min" className={claseInput} />
          </div>

          <div>
            <label htmlFor="im-dificultad" className={claseLabel}>Dificultad</label>
            <select id="im-dificultad" value={c.dificultad} onChange={set("dificultad")} className={claseInput}>
              <option>Fácil</option>
              <option>Media</option>
              <option>Exigente</option>
            </select>
          </div>

          <div>
            <label htmlFor="im-porciones" className={claseLabel}>Porciones</label>
            <input id="im-porciones" type="number" min={1} max={30} value={c.porciones} onChange={set("porciones")} className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-imagen" className={claseLabel}>Foto del plato * (enlace de imagen)</label>
            <input id="im-imagen" value={c.imagen} onChange={set("imagen")} placeholder="https://… la foto es obligatoria, como en la página principal" className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-video" className={claseLabel}>Video tutorial de YouTube *</label>
            <input id="im-video" value={c.video} onChange={set("video")} placeholder="https://www.youtube.com/watch?v=…" className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-descripcion" className={claseLabel}>Descripción corta *</label>
            <textarea id="im-descripcion" rows={2} value={c.descripcion} onChange={set("descripcion")} placeholder="¿Qué hace especial a este plato?" className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-ingredientes" className={claseLabel}>Ingredientes * (uno por línea)</label>
            <textarea id="im-ingredientes" rows={5} value={c.ingredientes} onChange={set("ingredientes")} placeholder={"4 trozos de osobuco\n1 litro de caldo…"} className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-pasos" className={claseLabel}>Preparación * (un paso por línea)</label>
            <textarea id="im-pasos" rows={6} value={c.pasos} onChange={set("pasos")} placeholder={"Sella la carne por todos sus lados.\nAñade el caldo caliente…"} className={claseInput} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="im-tip" className={claseLabel}>Consejo del chef (opcional)</label>
            <textarea id="im-tip" rows={2} value={c.tip} onChange={set("tip")} placeholder="Un secreto de cocina para que salga perfecto…" className={claseInput} />
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
            <IconOlla className="h-6 w-6" /> Publicar en la mesa de {pais.nombre}
          </button>
        </form>
      </div>
    </Modal>
  );
}

/* ---------- Página ---------- */

export default function Internacional({
  esAdmin,
  logueado,
  aprendidas,
  onAlternarAprendida,
  avisar,
}: {
  esAdmin: boolean;
  logueado: boolean;
  aprendidas: string[];
  onAlternarAprendida: (recetaId: string) => void;
  avisar: (mensaje: string) => void;
}) {
  const [pais, setPais] = useState<PaisSeccion>(PAISES[0]);
  const [abierta, setAbierta] = useState<RecetaMundo | null>(null);
  const [extras, setExtras] = useState<RecetaMundo[]>(() => recetasInternacionalExtra());
  const [paisForm, setPaisForm] = useState<PaisSeccion | null>(null);

  const aprendidasSet = useMemo(() => new Set(aprendidas), [aprendidas]);
  const recetasPais = useMemo(
    () => [...pais.recetas, ...extras.filter((r) => r.pais === pais.id)],
    [pais, extras]
  );
  const esAprendida = abierta ? aprendidasSet.has(abierta.id) : false;

  const vars = {
    "--acc1": pais.colores.acc1,
    "--acc2": pais.colores.acc2,
  } as CSSProperties;

  const franja = `linear-gradient(90deg, ${pais.bandera.bandas
    .map((b, i) => `${b} ${(i * 100) / 3}% ${((i + 1) * 100) / 3}%`)
    .join(", ")})`;

  return (
    <div className="bg-papel">
      {/* Cabecera */}
      <section className="relative overflow-hidden bg-tinta pb-14 pt-40 text-papel">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #cfa9c6 0 2px, transparent 2px 26px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-aji">
              <span className="h-px w-10 bg-aji" /> La mesa del mundo
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              Cuatro países, cuatro <em className="text-aji">altares</em> del sabor
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-lila sm:text-xl">
              Alta gastronomía sin salir de tu cocina: México, Italia, España y
              Argentina, con sus ingredientes, su preparación y su video
              tutorial. Elige un país y la página se viste con sus colores.
            </p>
          </Reveal>

          {/* Selector de países */}
          <Reveal delay={150}>
            <div
              className="mt-10 flex flex-wrap gap-3"
              role="tablist"
              aria-label="Elegir país"
            >
              {PAISES.map((p) => {
                const activo = p.id === pais.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setPais(p)}
                    className={`flex items-center gap-3 rounded-full border-2 px-5 py-3 text-base font-bold transition-all duration-300 ${
                      activo
                        ? "border-aji bg-aji text-tinta shadow-lg"
                        : "border-lila/40 bg-uva/60 text-papel hover:-translate-y-0.5 hover:border-aji hover:text-aji"
                    }`}
                  >
                    <Bandera pais={p} />
                    {p.nombre}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Franja con la bandera del país activo */}
      <div
        aria-hidden="true"
        className="h-2.5 transition-all duration-700"
        style={{ background: franja }}
      />

      {/* Sección del país */}
      <main
        className="min-h-[60vh] py-16 transition-colors duration-700 sm:py-20"
        style={{ backgroundColor: pais.colores.fondo, ...vars }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal key={pais.id}>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <Bandera pais={pais} className="h-9 w-14" />
                <div>
                  <p
                    className="text-sm font-black uppercase tracking-[0.24em]"
                    style={{ color: "var(--acc1)" }}
                  >
                    Alta cocina de {pais.nombre}
                  </p>
                  <h2
                    className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl"
                    style={{ color: pais.colores.tinta }}
                  >
                    La mesa de {pais.nombre}
                  </h2>
                </div>
              </div>
              {esAdmin && (
                <button
                  type="button"
                  onClick={() => setPaisForm(pais)}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-verde px-5 py-3 font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-verde-2 hover:shadow-[0_14px_28px_rgba(47,143,78,0.35)]"
                >
                  <IconMas className="h-5 w-5" /> Agregar receta a {pais.nombre}
                </button>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-lg font-bold leading-relaxed text-tinta/75">
              {pais.lema}
            </p>
          </Reveal>

          <Reveal key={`img-${pais.id}`} delay={120}>
            <figure className="relative mt-9 overflow-hidden rounded-xl shadow-2xl">
              <img
                src={pais.imagen}
                alt={`Mesa típica de ${pais.nombre}`}
                className="kenburns h-56 w-full object-cover sm:h-80"
              />
              <figcaption
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-crema"
                style={{
                  background:
                    "linear-gradient(transparent, rgba(20,10,20,0.82))",
                }}
              >
                <span>La mesa de {pais.nombre}</span>
                <span className="hidden sm:inline">{recetasPais.length} recetas con video</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {recetasPais.map((receta, i) => {
              const aprendida = aprendidasSet.has(receta.id);
              return (
                <Reveal key={receta.id} delay={(i % 3) * 110}>
                  <article
                    className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(20,15,20,0.22)]"
                    style={{ borderTopWidth: 8, borderTopColor: "var(--acc1)" }}
                  >
                    {receta.imagen && (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={receta.imagen}
                          alt={receta.nombre}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        {aprendida && (
                          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-verde px-3 py-1 text-xs font-black uppercase tracking-wider text-crema shadow">
                            <IconCheck className="h-3.5 w-3.5" /> Aprendida
                          </span>
                        )}
                        {receta.propia && (
                          <span
                            className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-crema shadow"
                            style={{ backgroundColor: "var(--acc2)" }}
                          >
                            De la comunidad
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p
                        className="text-[13px] font-black uppercase tracking-[0.18em]"
                        style={{ color: "var(--acc2)" }}
                      >
                        {receta.origen}
                      </p>
                      {(!receta.imagen && (receta.propia || aprendida)) && (
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {aprendida && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-verde px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-crema">
                              <IconCheck className="h-3 w-3" /> Aprendida
                            </span>
                          )}
                          {receta.propia && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-crema"
                              style={{ backgroundColor: "var(--acc2)" }}
                            >
                              De la comunidad
                            </span>
                          )}
                        </div>
                      )}
                      <h3
                        className="mt-1.5 font-display text-2xl font-black leading-tight"
                        style={{ color: pais.colores.tinta }}
                      >
                        {receta.nombre}
                      </h3>
                      <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold text-uva-2">
                        <span className="inline-flex items-center gap-1.5">
                          <IconReloj className="h-4 w-4" style={{ color: "var(--acc1)" }} />
                          {receta.tiempo}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          {Array.from({ length: 3 }).map((_, li) => (
                            <IconLlama
                              key={li}
                              className={`h-4 w-4 ${
                                li < fuerzaDificultad(receta.dificultad)
                                  ? ""
                                  : "text-uva-2/25"
                              }`}
                              {...(li < fuerzaDificultad(receta.dificultad)
                                ? { style: { color: "var(--acc2)" } }
                                : {})}
                            />
                          ))}
                          {receta.dificultad}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <IconPersonas className="h-4 w-4" style={{ color: "var(--acc1)" }} />
                          {receta.porciones} porciones
                        </span>
                      </div>
                      <p className="mt-3.5 flex-1 leading-relaxed text-uva">
                        {receta.descripcion}
                      </p>
                      <button
                        type="button"
                        onClick={() => setAbierta(receta)}
                        className="mt-6 rounded-lg px-5 py-3 font-bold text-crema shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ backgroundColor: "var(--acc1)" }}
                      >
                        Ver receta y video
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-12 text-center text-sm font-bold text-tinta/60">
            ¿Quieres volver a la cocina peruana?{" "}
            <a href="#/" className="underline underline-offset-4 hover:text-rojo">
              El recetario de la casa te espera
            </a>
            .
          </p>
        </div>
      </main>

      {/* Ventana de la receta */}
      <Modal
        abierto={!!abierta}
        onCerrar={() => setAbierta(null)}
        etiqueta={abierta ? `Receta de ${abierta.nombre}` : "Receta internacional"}
      >
        {abierta && (
          <div>
            <div
              className="relative px-6 pb-6 pt-9 text-crema sm:px-10"
              style={{ backgroundColor: "var(--acc1)" }}
            >
              <button
                type="button"
                onClick={() => setAbierta(null)}
                aria-label="Cerrar receta"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-tinta/30 text-crema transition-colors hover:bg-rojo"
              >
                <IconCerrar className="h-5 w-5" />
              </button>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-crema/80">
                {pais.nombre} · {abierta.origen}
              </p>
              <h3 className="mt-1.5 pr-10 font-display text-3xl font-black tracking-tight sm:text-4xl">
                {abierta.nombre}
              </h3>
            </div>

            {abierta.imagen && (
              <img
                src={abierta.imagen}
                alt={abierta.nombre}
                className="h-52 w-full object-cover sm:h-64"
              />
            )}

            <div className="px-6 py-8 sm:px-10">
              <div className="flex flex-wrap gap-3 text-sm font-bold text-uva">
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  <IconReloj className="h-4 w-4 text-rojo" /> {abierta.tiempo}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  {Array.from({ length: 3 }).map((_, li) => (
                    <IconLlama
                      key={li}
                      className={`h-4 w-4 ${
                        li < fuerzaDificultad(abierta.dificultad)
                          ? "text-rojo"
                          : "text-uva-2/25"
                      }`}
                    />
                  ))}
                  {abierta.dificultad}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-4 py-1.5">
                  <IconPersonas className="h-4 w-4 text-rojo" /> {abierta.porciones} porciones
                </span>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-uva">{abierta.descripcion}</p>

              <div className="mt-9 grid gap-10 md:grid-cols-[1fr_1.35fr]">
                <div>
                  <h4 className="font-display text-2xl font-black text-tinta">Ingredientes</h4>
                  <ul className="mt-4 space-y-2.5">
                    {abierta.ingredientes.map((ing) => (
                      <li key={ing} className="flex gap-3 leading-snug text-uva">
                        <IconCheck className="mt-1 h-4 w-4 shrink-0 text-verde" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-black text-tinta">Preparación</h4>
                  <ol className="mt-4 space-y-4">
                    {abierta.pasos.map((paso, i) => (
                      <li key={paso} className="flex gap-4">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-uva font-display text-sm font-black text-crema">
                          {i + 1}
                        </span>
                        <span className="pt-1 leading-relaxed text-uva">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-9 rounded-xl border-l-8 p-5" style={{ borderColor: "var(--acc2)", backgroundColor: pais.colores.suave }}>
                <p className="font-display text-lg font-black" style={{ color: pais.colores.tinta }}>
                  El consejo del chef
                </p>
                <p className="mt-1.5 leading-relaxed text-uva">{abierta.tip}</p>
              </div>

              <div className="mt-11">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-display text-2xl font-black text-tinta">Video tutorial</h4>
                  <a
                    href={`https://www.youtube.com/watch?v=${abierta.video}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-verde transition-colors hover:text-verde-2"
                  >
                    Verlo directo en YouTube <IconExterno className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-4 aspect-video overflow-hidden rounded-xl border-2 border-tinta/10 bg-tinta shadow-lg">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${abierta.video}`}
                    title={`Video tutorial de ${abierta.nombre}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Botón verde: igual que en la página principal */}
              <div className="mt-11 border-t-2 border-tinta/10 pt-9 text-center">
                <button
                  type="button"
                  onClick={() => onAlternarAprendida(abierta.id)}
                  className={`inline-flex w-full max-w-md items-center justify-center gap-3 rounded-xl px-8 py-4 text-xl font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(47,143,78,0.35)] ${
                    esAprendida ? "bg-verde-2" : "bg-verde hover:bg-verde-2"
                  }`}
                >
                  {esAprendida ? (
                    <IconCheck className="h-6 w-6" />
                  ) : (
                    <IconOlla className="h-6 w-6" />
                  )}
                  Receta Aprendida
                </button>
                <p className="mx-auto mt-3.5 max-w-md text-sm font-bold leading-snug text-uva-2">
                  {!logueado
                    ? "Inicia sesión o crea tu cuenta para guardar tus recetas aprendidas y subir de nivel."
                    : esAprendida
                      ? "¡Ya sabes preparar este plato! Está guardado en tu nivel de cocina. Toca el botón de nuevo si quieres quitarlo."
                      : "Márcala cuando ya sepas prepararla: así sube tu nivel de cocina."}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Formulario del administrador */}
      {paisForm && (
        <FormRecetaMundo
          pais={paisForm}
          onCerrar={() => setPaisForm(null)}
          onListo={(receta) => {
            const nombrePais = paisForm.nombre;
            setExtras(recetasInternacionalExtra());
            setPaisForm(null);
            avisar(`¡"${receta.nombre}" ya está servida en la mesa de ${nombrePais}!`);
          }}
        />
      )}
    </div>
  );
}
