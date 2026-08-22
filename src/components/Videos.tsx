import { VIDEOS } from "../data";
import { IconExterno, IconReloj, Reveal } from "./ui";

export default function Videos() {
  return (
    <section id="videos" className="relative overflow-hidden bg-tinta py-24 text-papel scroll-mt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #5d2b61 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #d7263d 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-aji">
            <span className="h-px w-10 bg-aji" /> La escuela de cocina
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Aprende viendo a los que saben
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-lila">
            Los videos se reproducen aquí mismo, dentro de la página. Un consejo
            de cocinero a cocinero:{" "}
            <strong className="text-papel">
              pon el video en grande, pausa y repite las veces que necesites.
            </strong>{" "}
            Nadie nació sabiendo darle el punto al arroz.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={(i % 2) * 110}>
              <article className="group h-full overflow-hidden rounded-xl border-2 border-uva-2 bg-uva/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-aji/70 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-video bg-tinta">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.titulo}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-6">
                  {v.destacado && (
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-rojo px-3.5 py-1 text-sm font-bold text-crema">
                      <IconReloj className="h-4 w-4" /> Empieza por este
                    </p>
                  )}
                  <h3 className="font-display text-2xl font-black leading-snug text-papel">
                    {v.titulo}
                  </h3>
                  <p className="mt-3 leading-relaxed text-lila">{v.descripcion}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 font-bold text-aji transition-all duration-300 hover:gap-3.5 hover:text-aji-2"
                  >
                    Verlo en YouTube <IconExterno className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
