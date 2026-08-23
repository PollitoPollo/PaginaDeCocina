import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ENLACES } from "../data";
import { IconExterno, IconFlecha, IconOlla, Reveal } from "./ui";

export default function LinksFooter({ onToast }: { onToast: (msg: string) => void }) {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const navegar = useNavigate();
  const location = useLocation();

  const suscribir = (e: FormEvent) => {
    e.preventDefault();
    if (!correo.includes("@") || correo.trim().length < 5) {
      setError("Escribe un correo válido, por ejemplo: nombre@correo.com");
      return;
    }
    setError("");
    setCorreo("");
    onToast("¡Listo! El recetario va en camino a tu correo.");
  };

  const irASeccion = (id: string) => {
    const saltar = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (location.pathname !== "/") {
      navegar("/");
      setTimeout(saltar, 120);
    } else {
      saltar();
    }
  };

  return (
    <>
      <section id="enlaces" className="bg-papel py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-rojo">
                <span className="h-px w-10 bg-rojo" /> La despensa de enlaces
              </p>
              <h2 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
                Para seguir aprendiendo fuera de esta mesa
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-uva">
                Sitios y canales que recomendamos con confianza: historia,
                recetas en video y rutas para viajar comiendo. Todos se abren
                en una pestaña nueva, sin salirte de aquí.
              </p>
              <div className="mt-8 hidden rounded-xl border-l-8 border-rojo bg-crema p-6 lg:block">
                <p className="font-display text-xl font-black text-tinta">
                  ¿Conoces un buen sitio de cocina peruana?
                </p>
                <p className="mt-2 leading-relaxed text-uva">
                  Escríbenos por el boletín de abajo y lo añadiremos a esta
                  despensa con todo gusto.
                </p>
              </div>
            </Reveal>

            <div>
              {ENLACES.map((enlace, i) => (
                <Reveal key={enlace.url} delay={i * 70}>
                  <a
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid items-center gap-x-5 gap-y-1 border-t-2 border-tinta/10 py-6 transition-colors duration-300 last:border-b-2 hover:bg-crema sm:grid-cols-[3.2rem_1fr_auto] sm:px-3"
                  >
                    <span className="font-display text-3xl font-black italic text-uva/30 transition-colors duration-300 group-hover:text-rojo">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-black text-tinta transition-colors group-hover:text-rojo">
                        {enlace.nombre}
                      </span>
                      <span className="mt-1 block leading-snug text-uva">
                        {enlace.descripcion}
                      </span>
                      <span className="mt-1.5 inline-block rounded bg-papel-2 px-2 py-0.5 text-[13px] font-bold text-uva-2">
                        {enlace.dominio}
                      </span>
                    </span>
                    <IconExterno className="hidden h-6 w-6 text-uva-2 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-rojo sm:block" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Boletín */}
          <Reveal delay={150}>
            <div className="mt-20 overflow-hidden rounded-xl bg-uva text-papel shadow-2xl">
              <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl">
                    Llévate una receta nueva{" "}
                    <em className="text-aji">cada domingo</em>
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-lila">
                    Un correo corto, con una receta de temporada, su historia y
                    un video para acompañarla. Sin spam, con mucho sabor.
                  </p>
                </div>
                <form onSubmit={suscribir} noValidate>
                  <label htmlFor="correo" className="block text-sm font-bold uppercase tracking-wider text-lila">
                    Tu correo electrónico
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="correo"
                      type="email"
                      value={correo}
                      onChange={(e) => {
                        setCorreo(e.target.value);
                        setError("");
                      }}
                      placeholder="nombre@correo.com"
                      className="w-full rounded-lg border-2 border-uva-3 bg-tinta/60 px-5 py-3.5 text-lg text-papel placeholder:text-lila/60 focus:border-aji focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-aji px-7 py-3.5 text-lg font-bold text-tinta transition-all duration-300 hover:-translate-y-0.5 hover:bg-aji-2 hover:shadow-lg"
                    >
                      Suscribirme <IconFlecha className="h-5 w-5" />
                    </button>
                  </div>
                  <p
                    className={`mt-3 min-h-6 text-sm font-bold ${error ? "text-aji-2" : "text-lila/80"}`}
                    role={error ? "alert" : undefined}
                  >
                    {error || "Puedes darte de baja cuando quieras, sin rencores."}
                  </p>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-tinta pb-10 pt-16 text-papel">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <p className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-aji text-tinta">
                  <IconOlla className="h-6 w-6" />
                </span>
                <span className="font-display text-2xl font-black">
                  Cocina <span className="text-aji">Pulguita</span>
                </span>
              </p>
              <p className="mt-5 max-w-sm leading-relaxed text-lila">
                Recetas, videos, escuela de cocina básica y sabores del mundo,
                contados claro para todas las generaciones: del primer ceviche
                al picarón de la abuela.
              </p>
            </div>
            <nav aria-label="Secciones del pie de página">
              <h3 className="font-display text-lg font-black text-aji">Secciones</h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["recetas", "Recetas paso a paso"],
                  ["videos", "Videos de cocina"],
                  ["blog", "Blog del sabor"],
                  ["enlaces", "Enlaces recomendados"],
                ].map(([id, nombre]) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => irASeccion(id)}
                      className="font-bold text-lila transition-colors hover:text-aji"
                    >
                      {nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Páginas del sitio">
              <h3 className="font-display text-lg font-black text-aji">Páginas</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      navegar("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="font-bold text-lila transition-colors hover:text-aji"
                  >
                    Portada
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navegar("/cocina-basica")}
                    className="font-bold text-lila transition-colors hover:text-aji"
                  >
                    Cocina Básica
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navegar("/internacional")}
                    className="font-bold text-lila transition-colors hover:text-aji"
                  >
                    Internacional
                  </button>
                </li>
              </ul>
            </nav>
            <div>
              <h3 className="font-display text-lg font-black text-aji">Dato curioso</h3>
              <p className="mt-4 leading-relaxed text-lila">
                El Perú tiene más de 3.000 variedades de papa y 55 tipos de
                maíz. El morado, con el que se hace la chicha, solo crece en
                los Andes.
              </p>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-uva-2 pt-6 text-sm font-bold text-lila sm:flex-row sm:items-center">
            <p>© 2026 Cocina Pulguita — Hecho con ají amarillo, chicha morada y cariño.</p>
            <p>Los videos pertenecen a sus creadores en YouTube.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
