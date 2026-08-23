import { useState, type CSSProperties } from "react";
import { PAISES, type PaisSeccion, type RecetaMundo } from "../data";
import {
  IconCheck,
  IconCerrar,
  IconExterno,
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

export default function Internacional() {
  const [pais, setPais] = useState<PaisSeccion>(PAISES[0]);
  const [abierta, setAbierta] = useState<RecetaMundo | null>(null);

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
                <span className="hidden sm:inline">{pais.recetas.length} recetas con video</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {pais.recetas.map((receta, i) => (
              <Reveal key={receta.id} delay={(i % 3) * 110}>
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(20,15,20,0.22)]"
                  style={{ borderTopWidth: 8, borderTopColor: "var(--acc1)" }}
                >
                  <div className="flex flex-1 flex-col p-6">
                    <p
                      className="text-[13px] font-black uppercase tracking-[0.18em]"
                      style={{ color: "var(--acc2)" }}
                    >
                      {receta.origen}
                    </p>
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
            ))}
          </div>

          <p className="mt-12 text-center text-sm font-bold text-tinta/60">
            ¿Quieres volver a la cocina peruana?{" "}
            <a href="/#recetas" className="underline underline-offset-4 hover:text-rojo">
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


