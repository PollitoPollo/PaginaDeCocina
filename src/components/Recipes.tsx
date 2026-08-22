import { useState } from "react";
import { RECETAS, type Receta } from "../data";
import { IconAji, IconCheck, IconLlama, IconPersonas, IconReloj, Modal, Reveal } from "./ui";

const FILTROS = ["Todas", "Entradas", "De fondo", "Postres", "Bebidas"] as const;
type Filtro = (typeof FILTROS)[number];

const NIVEL: Record<Receta["dificultad"], number> = {
  "Fácil": 1,
  "Media": 2,
  "Exigente": 3,
};

export default function Recipes() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [abierta, setAbierta] = useState<Receta | null>(null);

  const visibles =
    filtro === "Todas" ? RECETAS : RECETAS.filter((r) => r.categoria === filtro);

  return (
    <section id="recetas" className="relative overflow-hidden bg-papel py-24 scroll-mt-24">
      <IconAji
        aria-hidden="true"
        className="floaty absolute -right-6 top-16 h-24 w-24 opacity-20 lg:h-32 lg:w-32"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-rojo">
            <span className="h-px w-10 bg-rojo" /> El recetario
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
            Siete tesoros para empezar a cocinar peruano
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-uva">
            Cada receta trae sus ingredientes, los pasos uno por uno y el
            consejo de la abuela. Toca <strong>“Ver receta completa”</strong> y
            cocina a tu ritmo, sin apuros.
          </p>
        </Reveal>

        {/* Filtros */}
        <Reveal delay={120}>
          <div
            className="mt-10 flex flex-wrap gap-3"
            role="group"
            aria-label="Filtrar recetas por categoría"
          >
            {FILTROS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltro(f)}
                aria-pressed={filtro === f}
                className={`rounded-full border-2 px-5 py-2.5 text-base font-bold transition-all duration-300 ${
                  filtro === f
                    ? "border-uva bg-uva text-crema shadow-md"
                    : "border-tinta/15 bg-crema text-uva hover:-translate-y-0.5 hover:border-uva"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tarjetas */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((r, i) => (
            <Reveal key={r.id} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0_rgba(245,163,26,0.9)]">
                <div className="relative overflow-hidden">
                  <img
                    src={r.imagen}
                    alt={r.nombre}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-tinta/85 px-3.5 py-1 text-sm font-bold text-aji">
                    {r.categoria}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-crema/95 px-3.5 py-1 text-sm font-bold text-uva">
                    {r.region}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-black leading-snug text-tinta">
                    {r.nombre}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-uva">
                    {r.descripcion}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-uva-2">
                    <li className="flex items-center gap-1.5" title="Tiempo de preparación">
                      <IconReloj className="h-4.5 w-4.5 text-rojo" /> {r.tiempo}
                    </li>
                    <li
                      className="flex items-center gap-1"
                      title={`Dificultad: ${r.dificultad}`}
                    >
                      {[1, 2, 3].map((n) => (
                        <IconLlama
                          key={n}
                          className={`h-4.5 w-4.5 ${
                            n <= NIVEL[r.dificultad] ? "text-rojo" : "text-tinta/20"
                          }`}
                        />
                      ))}
                      <span className="ml-1">{r.dificultad}</span>
                    </li>
                    <li className="flex items-center gap-1.5" title="Porciones">
                      <IconPersonas className="h-4.5 w-4.5 text-rojo" /> {r.porciones}{" "}
                      personas
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setAbierta(r)}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-tinta px-5 py-3 font-bold text-papel transition-all duration-300 hover:bg-rojo hover:tracking-wide group-hover:bg-rojo"
                  >
                    Ver receta completa
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Modal de receta */}
      <Modal
        abierto={abierta !== null}
        onCerrar={() => setAbierta(null)}
        etiqueta={abierta ? `Receta de ${abierta.nombre}` : "Receta"}
      >
        {abierta && (
          <>
            <div className="relative">
              <img
                src={abierta.imagen}
                alt={abierta.nombre}
                className="h-60 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/90 via-tinta/20 to-transparent" />
              <button
                type="button"
                onClick={() => setAbierta(null)}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-crema text-tinta shadow-lg transition-transform hover:scale-110"
                aria-label="Cerrar receta"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 p-6 text-papel sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-aji">
                  {abierta.categoria} · {abierta.region}
                </p>
                <h3 className="mt-2 font-display text-3xl font-black sm:text-4xl">
                  {abierta.nombre}
                </h3>
              </div>
            </div>

            <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_1.25fr]">
              <div>
                <h4 className="font-display text-2xl font-black text-rojo">
                  Ingredientes
                </h4>
                <p className="mt-1 text-sm font-bold text-uva-2">
                  Para {abierta.porciones} personas · {abierta.tiempo}
                </p>
                <ul className="mt-5 space-y-3">
                  {abierta.ingredientes.map((ing) => (
                    <li key={ing} className="flex items-start gap-3 leading-snug">
                      <IconCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rojo" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-rojo">
                  Preparación paso a paso
                </h4>
                <ol className="mt-5 space-y-5">
                  {abierta.pasos.map((paso, i) => (
                    <li key={paso} className="flex gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-uva font-display text-lg font-black text-crema">
                        {i + 1}
                      </span>
                      <p className="pt-1.5 leading-relaxed">{paso}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 rounded-lg border-l-8 border-aji bg-aji/15 p-5">
                  <p className="flex items-center gap-2 font-display text-lg font-black text-tinta">
                    <IconAji className="h-5 w-5" /> El consejo de la abuela Rosa
                  </p>
                  <p className="mt-2 leading-relaxed text-uva">
                    “{abierta.tip}”
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
