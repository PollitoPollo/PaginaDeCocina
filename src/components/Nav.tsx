import { useEffect, useState } from "react";
import { IconOlla } from "./ui";

export type Escala = "S" | "M" | "G";

const SECCIONES = [
  { id: "recetas", nombre: "Recetas" },
  { id: "videos", nombre: "Videos" },
  { id: "blog", nombre: "Blog" },
  { id: "enlaces", nombre: "Enlaces" },
];

const ESCALAS: { valor: Escala; etiqueta: string; clase: string }[] = [
  { valor: "S", etiqueta: "Letra normal", clase: "text-xs" },
  { valor: "M", etiqueta: "Letra grande", clase: "text-sm" },
  { valor: "G", etiqueta: "Letra muy grande", clase: "text-base" },
];

export default function Nav({
  escala,
  onEscala,
}: {
  escala: Escala;
  onEscala: (e: Escala) => void;
}) {
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
          className="ml-auto hidden items-center gap-7 md:flex"
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

        {/* Control de tamaño de letra, pensado para personas mayores */}
        <div
          className="ml-auto flex items-center gap-1 rounded-lg border border-uva-2 bg-uva p-1 md:ml-6"
          role="group"
          aria-label="Tamaño de letra"
        >
          <span className="hidden pl-2 pr-1 text-[11px] font-bold uppercase tracking-wider text-lila lg:block">
            Letra
          </span>
          {ESCALAS.map(({ valor, etiqueta, clase }) => (
            <button
              key={valor}
              type="button"
              onClick={() => onEscala(valor)}
              aria-pressed={escala === valor}
              aria-label={etiqueta}
              title={etiqueta}
              className={`grid h-9 w-9 place-items-center rounded-md font-display font-black transition-all ${clase} ${
                escala === valor
                  ? "bg-aji text-tinta shadow"
                  : "text-lila hover:bg-uva-2 hover:text-papel"
              }`}
            >
              A
            </button>
          ))}
        </div>
      </div>

      {/* Navegación en pantallas pequeñas */}
      <nav
        aria-label="Secciones del sitio (móvil)"
        className="flex gap-6 overflow-x-auto border-t border-uva-2 px-4 py-2 md:hidden"
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
