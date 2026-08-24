import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconOlla } from "./ui";

const SECCIONES = [
  { id: "recetas", nombre: "Recetas" },
  { id: "videos", nombre: "Videos" },
  { id: "blog", nombre: "Blog" },
  { id: "enlaces", nombre: "Enlaces" },
];

const PAGINAS = [
  { ruta: "/cocina-basica", nombre: "Cocina Básica" },
  { ruta: "/internacional", nombre: "Internacional" },
  { ruta: "/top10", nombre: "Top 10" },
  { ruta: "/donaciones", nombre: "Donaciones" },
];

export default function Nav({ auth }: { auth: ReactNode }) {
  const [progreso, setProgreso] = useState(0);
  const [activa, setActiva] = useState("");
  const location = useLocation();
  const enPortada = location.pathname === "/";

  useEffect(() => {
    const alScroll = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 0);
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    if (!enPortada) return;
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECCIONES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [enPortada]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-uva-2 bg-tinta/95 text-papel backdrop-blur-sm">
      {/* Barra de progreso de lectura */}
      <div
        className="absolute left-0 top-0 h-1 bg-aji transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-aji text-tinta transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <IconOlla className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-black tracking-tight">
              Cocina <span className="text-aji">Pulguita</span>
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-lila">
              escuela de sabor
            </span>
          </span>
        </Link>

        <nav
          aria-label="Secciones y páginas del sitio"
          className="ml-auto hidden items-center gap-5 lg:flex"
        >
          {SECCIONES.map(({ id, nombre }) => (
            <a
              key={id}
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                const saltar = () =>
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                if (!enPortada) {
                  window.location.hash = "#/";
                  setTimeout(saltar, 150);
                } else {
                  saltar();
                }
              }}
              className={`nav-link text-[15px] font-bold transition-colors ${
                enPortada && activa === id ? "active text-aji" : "text-papel hover:text-aji"
              }`}
            >
              {nombre}
            </a>
          ))}
          <span aria-hidden="true" className="h-5 w-px bg-uva-2" />
          {PAGINAS.map(({ ruta, nombre }) => (
            <Link
              key={ruta}
              to={ruta}
              className={`nav-link text-[15px] font-bold transition-colors ${
                location.pathname === ruta ? "active text-aji" : "text-papel hover:text-aji"
              }`}
            >
              {nombre}
            </Link>
          ))}
        </nav>

        {auth}
      </div>

      {/* Navegación en pantallas pequeñas */}
      <nav
        aria-label="Secciones del sitio (móvil)"
        className="flex gap-6 overflow-x-auto border-t border-uva-2 px-4 py-2 lg:hidden"
      >
        {SECCIONES.map(({ id, nombre }) => (
          <a
            key={id}
            href={`#/`}
            onClick={(e) => {
              e.preventDefault();
              const saltar = () =>
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              if (!enPortada) {
                window.location.hash = "#/";
                setTimeout(saltar, 150);
              } else {
                saltar();
              }
            }}
            className="whitespace-nowrap text-sm font-bold text-papel"
          >
            {nombre}
          </a>
        ))}
        {PAGINAS.map(({ ruta, nombre }) => (
          <Link
            key={ruta}
            to={ruta}
            className={`whitespace-nowrap text-sm font-bold ${
              location.pathname === ruta ? "text-aji" : "text-papel"
            }`}
          >
            {nombre}
          </Link>
        ))}
      </nav>
    </header>
  );
}
