import { useEffect, useRef, type ReactNode, type SVGProps } from "react";

/* ---------- Aparición al hacer scroll ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- Modal accesible ---------- */
export function Modal({
  abierto,
  onCerrar,
  etiqueta,
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  etiqueta: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={etiqueta}
    >
      <div
        className="absolute inset-0 bg-tinta/85"
        onClick={onCerrar}
        aria-hidden="true"
      />
      <div className="modal-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-crema text-tinta shadow-2xl">
        {children}
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */
export function Toast({ mensaje }: { mensaje: string | null }) {
  if (!mensaje) return null;
  return (
    <div
      className="toast-in fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-lg border-2 border-tinta/20 bg-aji px-6 py-3 font-bold text-tinta shadow-xl"
      role="status"
    >
      <IconAji className="h-5 w-5 shrink-0" />
      <span>{mensaje}</span>
    </div>
  );
}

/* ---------- Iconos dibujados a mano ---------- */
type IconProps = SVGProps<SVGSVGElement>;

export function IconAji({ className = "h-6 w-6", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...resto}>
      <path
        d="M15.5 6.5c2.5.6 4.5 2.9 4.3 6-.3 4.6-5.4 8.6-12.4 7.4-2.7-.5-4.6-2-4.9-3.4-.3-1.4 1.2-1.7 2.5-1.5 3.9.6 7.5-1.1 8.6-4.6.7-2.3-.5-3.7 1.9-3.9Z"
        fill="var(--color-rojo)"
      />
      <path
        d="M15.5 6.5c-.6-1.6.2-3.2 2.4-3.9.5 1.7.2 3.3-1 4.3M15.5 6.5c1.3.3 2.2 1 2.6 2"
        stroke="#3e7a3a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconOlla({ className = "h-6 w-6", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true" {...resto}>
      <path d="M5 10h14v5.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 5 15.5V10Z" strokeLinejoin="round" />
      <path d="M2.8 10h18.4M9 7.2c0-1.2 1-1.4 1-2.4M14 7.2c0-1.2 1-1.4 1-2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconReloj({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true" {...resto}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLlama({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true" {...resto}>
      <path
        d="M12 3.5c.6 2.6 2.6 3.9 3.9 5.7a7 7 0 1 1-11 5.4c0-3.2 2-5 3-7.2.7 1 1.2 2 1.1 3.4 1.5-1.3 3-3.8 3-7.3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPersonas({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true" {...resto}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 6a2.6 2.6 0 1 1 .8 5.1M16.8 14.7c2 .4 3.3 2 3.7 4.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlecha({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true" {...resto}>
      <path d="M4 12h15m-6-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconExterno({ className = "h-4 w-4", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className} aria-hidden="true" {...resto}>
      <path d="M7 17 17 7m0 0H9.5M17 7v7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className} aria-hidden="true" {...resto}>
      <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChakana({ className = "h-6 w-6", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...resto}>
      <path d="M9 2h6v4h4v6h-4v4h-2v6h-2v-6H9v-4H5V6h4V2Zm3 6.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
    </svg>
  );
}

export function IconMaiz({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true" {...resto}>
      <path
        d="M12 21c-3.2-2.3-4.8-6-4.8-9.6C7.2 6.6 9 3.5 12 3.5s4.8 3.1 4.8 7.9C16.8 15 15.2 18.7 12 21Z"
        strokeLinejoin="round"
      />
      <path d="M12 3.5V21M8.4 8h7.2M7.6 12h8.8M8.6 16h6.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCerrar({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true" {...resto}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevron({ className = "h-4 w-4", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true" {...resto}>
      <path d="m5 9 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMas({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true" {...resto}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsuario({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true" {...resto}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.9-3.7 3.9-5.6 7.5-5.6s6.6 1.9 7.5 5.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconLlave({ className = "h-5 w-5", ...resto }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true" {...resto}>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9m-3 0v3.5m-3-3.5V15" strokeLinecap="round" />
    </svg>
  );
}
