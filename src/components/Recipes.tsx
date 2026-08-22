import { useMemo, useState } from "react";
import { VIDEO_POR_RECETA, type Receta } from "../data";
import {
  IconCheck,
  IconCerrar,
  IconExterno,
  IconLlama,
  IconMas,
  IconOlla,
  IconPersonas,
  IconReloj,
  Modal,
  Reveal,
} from "./ui";

const CATEGORIAS = ["Todas", "Entradas", "De fondo", "Postres", "Bebidas"] as const;

const fuerzaDificultad = (d: Receta["dificultad"]) =>
  d === "Fácil" ? 1 : d === "Media" ? 2 : 3;

export default function Recipes({
  recetas,
  aprendidas,
  logueado,
  esAdmin,
  onAlternarAprendida,
  onAgregarReceta,
}: {
  recetas: Receta[];
  aprendidas: string[];
  logueado: boolean;
  esAdmin: boolean;
  onAlternarAprendida: (recetaId: string) => void;
  onAgregarReceta: () => void;
}) {
  const [filtro, setFiltro] = useState<string>("Todas");
  const [abierta, setAbierta] = useState<Receta | null>(null);

  const visibles = useMemo(
    () => (filtro === "Todas" ? recetas : recetas.filter((r) => r.categoria === filtro)),
    [recetas, filtro]
  );
  const setAprendidas = useMemo(() => new Set(aprendidas), [aprendidas]);
  const esAprendida = abierta ? setAprendidas.has(abierta.id) : false;
  const videoId = abierta ? abierta.video ?? VIDEO_POR_RECETA[abierta.id] : undefined;

  return (
    <section id="recetas" className="scroll-mt-24 bg-papel py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-rojo">
                <span className="h-px w-10 bg-rojo" /> El recetario de la casa
              </p>
              <h2 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
                Cocina peruana, paso a paso
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-uva">
                Cada receta trae sus ingredientes, su preparación y{" "}
                <strong>su video tutorial de YouTube</strong> al final. Cuando ya
                sepas preparar un plato, toca el botón verde{" "}
                <strong>Receta Aprendida</strong> y sube tu nivel de cocina.
              </p>
            </div>
            {esAdmin && (
              <button
                type="button"
                onClick={onAgregarReceta}
                className="inline-flex items-center gap-2.5 rounded-lg bg-verde px-5 py-3 text-base font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-verde-2 hover:shadow-[0_14px_28px_rgba(47,143,78,0.35)]"
              >
                <IconMas className="h-5 w-5" /> Agregar receta
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtrar recetas por categoría">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltro(cat)}
                aria-pressed={filtro === cat}
                className={`rounded-full border-2 px-5 py-2.5 font-bold transition-all duration-300 ${
                  filtro === cat
                    ? "border-uva bg-uva text-crema shadow-md"
                    : "border-uva/25 bg-crema text-uva hover:-translate-y-0.5 hover:border-uva hover:shadow"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {visibles.map((receta, i) => {
            const aprendidaCard = setAprendidas.has(receta.id);
            return (
              <Reveal key={receta.id} delay={(i % 3) * 110}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-rojo/50 hover:shadow-[0_22px_44px_rgba(43,15,46,0.18)]">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={receta.imagen}
                      alt={receta.nombre}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-rojo px-3.5 py-1 text-xs font-black uppercase tracking-wider text-crema shadow">
                      {receta.categoria}
                    </span>
                    {aprendidaCard && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-verde px-3 py-1 text-xs font-black uppercase tracking-wider text-crema shadow">
                        <IconCheck className="h-3.5 w-3.5" /> Aprendida
                      </span>
                    )}
                    {receta.propia && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-aji px-3 py-1 text-xs font-black uppercase tracking-wider text-tinta shadow">
                        Nueva de la comunidad
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-rojo">
                      {receta.region}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-black leading-tight text-tinta">
                      {receta.nombre}
                    </h3>
                    <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold text-uva-2">
                      <span className="inline-flex items-center gap-1.5">
                        <IconReloj className="h-4 w-4 text-rojo" /> {receta.tiempo}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        {Array.from({ length: 3 }).map((_, li) => (
                          <IconLlama
                            key={li}
                            className={`h-4 w-4 ${
                              li < fuerzaDificultad(receta.dificultad)
                                ? "text-rojo"
                                : "text-uva-2/25"
                            }`}
                          />
                        ))}
                        {receta.dificultad}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <IconPersonas className="h-4 w-4 text-rojo" /> {receta.porciones}{" "}
                        porciones
                      </span>
                    </div>
                    <p className="mt-3.5 flex-1 leading-relaxed text-uva">
                      {receta.descripcion}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAbierta(receta)}
                      className="mt-6 rounded-lg bg-uva px-5 py-3 font-bold text-crema transition-all duration-300 hover:bg-rojo hover:shadow-lg"
                    >
                      Ver receta completa
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ---------- Ventana de la receta ---------- */}
      <Modal
        abierto={!!abierta}
        onCerrar={() => setAbierta(null)}
        etiqueta={abierta ? `Receta de ${abierta.nombre}` : "Receta"}
      >
        {abierta && (
          <div>
            <div className="relative">
              <img
                src={abierta.imagen}
                alt={abierta.nombre}
                className="h-60 w-full object-cover sm:h-80"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-tinta/90 via-tinta/25 to-transparent"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setAbierta(null)}
                aria-label="Cerrar receta"
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-tinta/60 text-crema transition-colors duration-300 hover:bg-rojo"
              >
                <IconCerrar className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-crema">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-aji">
                  {abierta.categoria} · {abierta.region}
                </p>
                <h3 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
                  {abierta.nombre}
                </h3>
              </div>
            </div>

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

              <div className="mt-9 rounded-xl border-l-8 border-aji bg-papel-2 p-5">
                <p className="font-display text-lg font-black text-tinta">
                  El consejo de la abuela Rosa
                </p>
                <p className="mt-1.5 leading-relaxed text-uva">{abierta.tip}</p>
              </div>

              {/* Video tutorial, al final de la receta */}
              {videoId && (
                <div className="mt-11">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="font-display text-2xl font-black text-tinta">
                      Video tutorial
                    </h4>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-bold text-verde transition-colors duration-300 hover:text-verde-2"
                    >
                      Verlo directo en YouTube <IconExterno className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="mt-4 aspect-video overflow-hidden rounded-xl border-2 border-tinta/10 bg-tinta shadow-lg">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      title={`Video tutorial de ${abierta.nombre}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}

              {/* Botón verde: Receta Aprendida */}
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
    </section>
  );
}
