import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconOlla } from "./ui";

const SECCIONES = [
  { id: "recetas", nombre: "Recetas" },
  { id: "videos", nombre: "Videos" },
  { id: "blog", nombre: "Blog" },
  { id: "enlaces", nombre: "Enlaces" },
];

const RUTAS = [
  { path: "/cocina-basica", nombre: "Cocina Básica" },
  { path: "/internacional", nombre: "Internacional" },
];

export default function Nav({ auth }: { auth: ReactNode }) {
  const [progreso, setProgreso] = useState(0);
  const [activa, setActiva] = useState("");
  const navegar = useNavigate();
  const location = useLocation();

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
    if (location.pathname !== "/") return;
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
  }, [location.pathname]);

  /* Salta a una sección de la portada, estés en la página que estés. */
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-uva-2 bg-tinta/95 text-papel backdrop-blur-sm">
      {/* Barra de progreso de lectura */}
      <div
        className="absolute left-0 top-0 h-1 bg-aji transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-aji text-tinta transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <IconOlla className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-black tracking-tight">
              Cocina <span className="text-aji">Pulguita</span>
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-lila">
              escuela y sabor
            </span>
          </span>
        </Link>

        <nav
          aria-label="Secciones del sitio"
          className="ml-auto hidden items-center gap-6 xl:gap-7 lg:flex"
        >
          {SECCIONES.map(({ id, nombre }) => (
            <button
              key={id}
              type="button"
              onClick={() => irASeccion(id)}
              className={`nav-link font-bold transition-colors ${
                location.pathname === "/" && activa === id
                  ? "active text-aji"
                  : "text-papel hover:text-aji"
              }`}
            >
              {nombre}
            </button>
          ))}

          <span className="h-6 w-px bg-uva-2" aria-hidden="true" />

          {RUTAS.map(({ path, nombre }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link font-bold transition-colors ${
                location.pathname === path ? "active text-aji" : "text-papel hover:text-aji"
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
          <button
            key={id}
            type="button"
            onClick={() => irASeccion(id)}
            className="whitespace-nowrap text-sm font-bold text-papel"
          >
            {nombre}
          </button>
        ))}
        <span className="my-1 w-px shrink-0 bg-uva-2" aria-hidden="true" />
        {RUTAS.map(({ path, nombre }) => (
          <Link
            key={path}
            to={path}
            className={`whitespace-nowrap text-sm font-bold ${
              location.pathname === path ? "text-aji" : "text-papel"
            }`}
          >
            {nombre}
          </Link>
        ))}
      </nav>
    </header>
  );
}
