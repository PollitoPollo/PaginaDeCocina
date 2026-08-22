import { useEffect, useState, type ReactNode } from "react";
import { IconOlla } from "./ui";

const SECCIONES = [
  { id: "recetas", nombre: "Recetas" },
  { id: "videos", nombre: "Videos" },
  { id: "blog", nombre: "Blog" },
  { id: "enlaces", nombre: "Enlaces" },
];

export default function Nav({ auth }: { auth: ReactNode }) {
  const [progreso, setProgreso] = useState(0);
  const [activa, setActiva] = useState("");

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
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-uva-2 bg-tinta/95 text-papel backdrop-blur-sm">
      {/* Barra de progreso de lectura */}
      <div
        className="absolute left-0 top-0 h-1 bg-aji transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-aji text-tinta transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <IconOlla className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-black tracking-tight">
              Sabor Perú
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-lila">
              cocina de todos
            </span>
          </span>
        </a>

        <nav
          aria-label="Secciones del sitio"
          className="ml-auto hidden items-center gap-7 lg:flex"
        >
          {SECCIONES.map(({ id, nombre }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link font-bold transition-colors ${
                activa === id ? "active text-aji" : "text-papel hover:text-aji"
              }`}
            >
              {nombre}
            </a>
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
            href={`#${id}`}
            className={`whitespace-nowrap text-sm font-bold ${
              activa === id ? "text-aji" : "text-papel"
            }`}
          >
            {nombre}
          </a>
        ))}
      </nav>
    </header>
  );
}
