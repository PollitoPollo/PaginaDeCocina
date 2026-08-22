import { useState } from "react";
import { POSTS, type Post } from "../data";
import { IconFlecha, Modal, Reveal } from "./ui";

export default function Blog() {
  const [post, setPost] = useState<Post | null>(null);
  const [destacado, ...resto] = POSTS;

  return (
    <section id="blog" className="relative overflow-hidden bg-papel-2 py-24 scroll-mt-24">
      <p
        aria-hidden="true"
        className="text-stroke-uva pointer-events-none absolute -top-8 right-0 select-none font-display text-[22vw] font-black leading-none opacity-60"
      >
        BLOG
      </p>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-rojo">
            <span className="h-px w-10 bg-rojo" /> Bitácora del sabor
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
            Historias para leer con hambre
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-uva">
            La cocina peruana también se cuenta: de dónde vienen los platos,
            quiénes los inventaron y por qué nos hacen sentir en casa.
          </p>
        </Reveal>

        {/* Artículo destacado */}
        <Reveal delay={150}>
          <article className="group mt-12 grid overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema shadow-lg transition-all duration-300 hover:shadow-[14px_14px_0_rgba(70,32,75,0.9)] lg:grid-cols-2">
            <div className="relative overflow-hidden">
              <img
                src={destacado.imagen}
                alt={destacado.titulo}
                loading="lazy"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full"
              />
              <span className="absolute left-5 top-5 rounded-md bg-rojo px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-crema">
                Artículo destacado
              </span>
            </div>
            <div className="flex flex-col p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3.5 py-1 text-sm font-bold text-crema ${destacado.color}`}>
                  {destacado.categoria}
                </span>
                <span className="text-sm font-bold text-uva-2">
                  {destacado.fecha} · {destacado.lectura}
                </span>
              </div>
              <h3 className="mt-5 font-display text-3xl font-black leading-tight text-tinta sm:text-4xl">
                {destacado.titulo}
              </h3>
              <p className="mt-4 flex-1 text-lg leading-relaxed text-uva">
                {destacado.resumen}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-bold text-uva-2">
                  Por {destacado.autor}
                </p>
                <button
                  type="button"
                  onClick={() => setPost(destacado)}
                  className="inline-flex items-center gap-2 rounded-lg bg-rojo px-6 py-3.5 font-bold text-crema transition-all duration-300 hover:-translate-y-0.5 hover:bg-rojo-2 hover:shadow-lg"
                >
                  Leer artículo completo <IconFlecha className="h-5 w-5" />
                </button>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Resto de artículos */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {resto.map((p, i) => (
            <Reveal key={p.id} delay={i * 110}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0_rgba(215,38,61,0.85)]">
                <div className="relative overflow-hidden">
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`rounded-full px-3 py-0.5 text-[13px] font-bold ${p.color}`}>
                      {p.categoria}
                    </span>
                    <span className="text-[13px] font-bold text-uva-2">
                      {p.lectura}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-black leading-snug text-tinta">
                    {p.titulo}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-uva">{p.resumen}</p>
                  <button
                    type="button"
                    onClick={() => setPost(p)}
                    className="mt-5 inline-flex items-center gap-2 self-start font-bold text-rojo transition-all duration-300 hover:gap-3.5 hover:text-rojo-2"
                  >
                    Leer más <IconFlecha className="h-4.5 w-4.5" />
                  </button>
                  <p className="mt-4 border-t border-tinta/10 pt-3 text-[13px] font-bold text-uva-2">
                    {p.fecha} · Por {p.autor}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lector del artículo */}
      <Modal
        abierto={post !== null}
        onCerrar={() => setPost(null)}
        etiqueta={post ? post.titulo : "Artículo"}
      >
        {post && (
          <article>
            <div className="relative">
              <img
                src={post.imagen}
                alt=""
                className="h-56 w-full object-cover sm:h-72"
              />
              <button
                type="button"
                onClick={() => setPost(null)}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-crema text-tinta shadow-lg transition-transform hover:scale-110"
                aria-label="Cerrar artículo"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3.5 py-1 text-sm font-bold ${post.color}`}>
                  {post.categoria}
                </span>
                <span className="text-sm font-bold text-uva-2">
                  {post.fecha} · {post.lectura}
                </span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-black leading-tight text-tinta sm:text-4xl">
                {post.titulo}
              </h3>
              <p className="mt-3 font-bold text-rojo">Por {post.autor}</p>

              <div className="mt-8 space-y-6">
                {post.contenido.map((bloque, i) => {
                  if (bloque.tipo === "h2")
                    return (
                      <h4
                        key={i}
                        className="pt-4 font-display text-2xl font-black text-uva"
                      >
                        {bloque.texto}
                      </h4>
                    );
                  if (bloque.tipo === "quote")
                    return (
                      <blockquote
                        key={i}
                        className="rounded-r-xl border-l-8 border-aji bg-uva p-6 font-display text-xl italic leading-relaxed text-papel"
                      >
                        “{bloque.texto}”
                      </blockquote>
                    );
                  return (
                    <p
                      key={i}
                      className={`text-lg leading-relaxed text-tinta ${
                        i === 0 ? "dropcap" : ""
                      }`}
                    >
                      {bloque.texto}
                    </p>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between rounded-lg bg-papel p-5">
                <p className="text-sm font-bold text-uva-2">
                  ¿Te gustó? Compártelo con alguien que ame comer bien.
                </p>
                <button
                  type="button"
                  onClick={() => setPost(null)}
                  className="rounded-lg bg-tinta px-5 py-2.5 font-bold text-papel transition-colors hover:bg-rojo"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </article>
        )}
      </Modal>
    </section>
  );
}
