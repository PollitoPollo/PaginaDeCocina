import { useState, type ChangeEvent, type FormEvent, type SVGProps } from "react";
import { IconCerrar, IconCheck, IconChevron, IconEditar, IconExterno, IconMas, Modal, Reveal } from "../components/ui";
import {
  addChef,
  addConsejo,
  addNivelBasica,
  eliminarChef,
  eliminarConsejo,
  eliminarNivelBasica,
  extraerIdYouTube,
  getChefs,
  getConsejos,
  getNivelesBasica,
  MAX_NIVELES,
  type Chef,
  type ConsejoUtensilio,
  type NivelBasica,
} from "../lib/store";

type Pestana = "niveles" | "utensilios" | "chefs";

/* ---------- Iconos propios de esta página ---------- */
type IconProps = SVGProps<SVGSVGElement>;

function IconCapas({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
      <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" strokeLinejoin="round" />
      <path d="m4 12 8 3.5 8-3.5M4 16.5 12 20l8-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSarten({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
      <circle cx="9.5" cy="13" r="5.6" />
      <path d="M15.3 11.2 21 8.2M9.5 10.4v5.2M6.9 13h5.2" strokeLinecap="round" />
    </svg>
  );
}

function IconGorro({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
      <path d="M7 14a3.6 3.6 0 0 1-.9-7.1 4.6 4.6 0 0 1 9-1.3A4.2 4.2 0 0 1 18.4 8 3.6 3.6 0 0 1 17 14.6V17H7v-3Z" strokeLinejoin="round" />
      <path d="M7 17h10v3H7zM7 20v-3m5 3v-3m5 3v-3" strokeLinecap="round" />
    </svg>
  );
}

const PESTANAS: { id: Pestana; nombre: string; desc: string; Icono: (p: IconProps) => JSX.Element }[] = [
  { id: "niveles", nombre: "Manualidades en cocina", desc: "Hasta 8 niveles para dominar la cocina de casa", Icono: IconCapas },
  { id: "utensilios", nombre: "Buenos Utensilios", desc: "Materiales, ciencia y marcas probadas", Icono: IconSarten },
  { id: "chefs", nombre: "Aprende de los mejores", desc: "Los cocineros peruanos que cambiaron la historia", Icono: IconGorro },
];

/* ---------- Contenido fijo: la ciencia de los materiales ---------- */

const MATERIALES = [
  {
    nombre: "Acero inoxidable 18/10",
    ciencia:
      "Conduce poco el calor (unos 16 W/m·K): por eso las buenas ollas llevan un núcleo de aluminio o cobre encapsulado en la base o en toda la pared.",
    bueno: [
      "No reacciona con ácidos como el limón o el tomate",
      "Dura décadas y tolera el lavavajillas",
      "Es la olla de todos los días",
    ],
    malo: ["Sin núcleo, calienta de forma dispareja", "La comida se pega si no precalientas bien"],
  },
  {
    nombre: "Hierro fundido",
    ciencia:
      "Su gran masa térmica guarda el calor por largo rato: por eso sella carnes como ningún material y hasta hornea pan.",
    bueno: [
      "El mejor sellado para carnes y papas",
      "Con el uso desarrolla antiadherencia natural",
      "Pasa de generación en generación",
    ],
    malo: ["Es pesado", "Pide curado y secado inmediato", "Evítalo para salsas muy ácidas"],
  },
  {
    nombre: "Acero al carbono",
    ciencia:
      "Conduce mejor que el inox y pesa menos que el hierro: es el material que verás en casi toda cocina profesional del mundo.",
    bueno: [
      "Desarrolla una pátina antiadherente propia",
      "Responde rápido a los cambios de fuego",
      "Perfecto para wok y sartenes de chef",
    ],
    malo: ["Se oxida si queda mojado", "Necesita curado, igual que el hierro"],
  },
  {
    nombre: "Cobre",
    ciencia:
      "Es el mejor conductor doméstico (cerca de 400 W/m·K): el control de temperatura es casi instantáneo, clave para salsas delicadas.",
    bueno: ["Precisión absoluta al cocinar", "Hermoso y con siglos de tradición"],
    malo: ["Es el más caro", "Requiere estañado interior y mantenimiento"],
  },
  {
    nombre: "Antiadherente (PTFE o cerámica)",
    ciencia:
      "Su superficie reduce la fricción a valores mínimos: por eso nada se pega aunque uses muy poco aceite.",
    bueno: ["Imbatible para huevos y pescados delicados", "Se limpia en segundos"],
    malo: ["No debe pasar de 260 °C", "Cuando se raya se jubila: hay que reemplazarlo"],
  },
];

const CHECKLIST = [
  "Estampado «18/10» o fondo encapsulado declarado en la base",
  "Mangos remachados que no bailan al moverlos",
  "Base gruesa (3 mm o más) y perfectamente plana",
  "Paredes multicapa, no solo un disco pegado al fondo",
  "Tapa que ajusta bien y deja escapar el vapor",
  "Peso equilibrado: firme en la mano, sin cansar",
];

const MARCAS: { categoria: string; marcas: [string, string][] }[] = [
  {
    categoria: "Ollas de acero",
    marcas: [
      ["All-Clad (línea D3)", "la referencia mundial en construcción multicapa"],
      ["Tramontina Solar", "la mejor relación calidad-precio de Latinoamérica"],
      ["WMF · Fissler", "precisión alemana para toda la vida"],
    ],
  },
  {
    categoria: "Hierro fundido",
    marcas: [
      ["Lodge", "un siglo de hierro curado a precio justo"],
      ["Le Creuset · Staub", "esmaltados que pasan de generación en generación"],
    ],
  },
  {
    categoria: "Sartenes",
    marcas: [
      ["De Buyer Mineral B", "acero al carbono francés de cocina profesional"],
      ["T-fal · Tramontina", "antiadherentes confiables para el día a día"],
    ],
  },
  {
    categoria: "Cuchillos",
    marcas: [
      ["Victorinox Fibrox", "el mejor precio-calidad en pruebas comparativas de cocina"],
      ["Wüsthof · Zwilling", "los clásicos alemanes de filo duradero"],
      ["Tojiro", "la puerta de entrada al acero japonés"],
    ],
  },
  {
    categoria: "Ollas a presión",
    marcas: [
      ["Fissler · Kuhn Rikon", "seguridad suiza y alemana certificada"],
      ["IMCO", "la marca peruana querida por tres generaciones"],
    ],
  },
];

/* ---------- Formularios del administrador ---------- */

const claseInput =
  "mt-1.5 w-full rounded-lg border-2 border-papel-2 bg-crema px-3.5 py-2.5 text-base text-tinta placeholder:text-uva-2/50 focus:border-uva focus:outline-none";
const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

function FormNivel({ onCerrar, onListo }: { onCerrar: () => void; onListo: (msg: string) => void }) {
  const [c, setC] = useState({
    titulo: "",
    resumen: "",
    tiempo: "",
    puntos: "",
    imagen: "",
    video: "",
  });
  const [error, setError] = useState("");
  const set = (campo: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setC({ ...c, [campo]: e.target.value });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const puntos = c.puntos.split("\n").map((s) => s.trim()).filter(Boolean);
    if (c.titulo.trim().length < 3) return setError("Escribe el título del nivel (al menos 3 letras).");
    if (puntos.length < 2) return setError("Escribe al menos 2 pasos o consejos, uno por línea.");
    const r = addNivelBasica({
      id: `n-${Date.now()}`,
      titulo: c.titulo.trim(),
      resumen: c.resumen.trim() || "Un nivel nuevo de la escuela de Cocina Pulguita.",
      tiempo: c.tiempo.trim() || "A tu ritmo",
      puntos,
      imagen: c.imagen.trim() || undefined,
      video: c.video.trim() ? extraerIdYouTube(c.video) : undefined,
    });
    if (!r.ok) return setError(r.error ?? "No se pudo publicar el nivel.");
    onListo(`Nivel publicado: "${c.titulo.trim()}".`);
    onCerrar();
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta="Publicar nivel de cocina básica">
      <div className="relative">
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors hover:bg-rojo">
          <IconCerrar className="h-5 w-5" />
        </button>
        <div className="bg-verde-2 px-6 pb-6 pt-9 text-crema sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aji-2">Solo administrador</p>
          <h2 className="mt-1.5 font-display text-3xl font-black">Publicar nivel nuevo</h2>
        </div>
        <form onSubmit={enviar} className="space-y-4 px-6 py-6 sm:px-8">
          <div>
            <label htmlFor="nv-titulo" className={claseLabel}>Título del nivel *</label>
            <input id="nv-titulo" value={c.titulo} onChange={set("titulo")} placeholder="Por ejemplo: Dominar el arroz graneado" className={claseInput} />
          </div>
          <div>
            <label htmlFor="nv-tiempo" className={claseLabel}>Tiempo sugerido</label>
            <input id="nv-tiempo" value={c.tiempo} onChange={set("tiempo")} placeholder="Por ejemplo: 1 semana de práctica" className={claseInput} />
          </div>
          <div>
            <label htmlFor="nv-resumen" className={claseLabel}>Resumen</label>
            <textarea id="nv-resumen" rows={2} value={c.resumen} onChange={set("resumen")} placeholder="¿Qué aprenderá la gente en este nivel?" className={claseInput} />
          </div>
          <div>
            <label htmlFor="nv-imagen" className={claseLabel}>Imagen de identificación (enlace, opcional)</label>
            <input id="nv-imagen" value={c.imagen} onChange={set("imagen")} placeholder="https://… la foto que representará el nivel" className={claseInput} />
          </div>
          <div>
            <label htmlFor="nv-video" className={claseLabel}>Video tutorial de YouTube (opcional)</label>
            <input id="nv-video" value={c.video} onChange={set("video")} placeholder="https://www.youtube.com/watch?v=…" className={claseInput} />
            <p className="mt-1.5 text-[13px] font-bold text-uva-2">
              La imagen y el video ayudan a identificar el nivel de un vistazo.
            </p>
          </div>
          <div>
            <label htmlFor="nv-puntos" className={claseLabel}>Pasos y consejos * (uno por línea)</label>
            <textarea id="nv-puntos" rows={6} value={c.puntos} onChange={set("puntos")} placeholder={"Lava el arroz hasta que el agua salga clara.\nUsa la medida 1 de arroz por 1.5 de agua…"} className={claseInput} />
          </div>
          {error && <p role="alert" className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold text-rojo-2">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-verde px-6 py-3.5 text-lg font-bold text-crema transition-all hover:-translate-y-0.5 hover:bg-verde-2">
            Publicar nivel
          </button>
        </form>
      </div>
    </Modal>
  );
}

function FormChef({
  inicial,
  onCerrar,
  onListo,
}: {
  inicial: Chef | null;
  onCerrar: () => void;
  onListo: (msg: string) => void;
}) {
  const [c, setC] = useState({
    nombre: inicial?.nombre ?? "",
    titulo: inicial?.titulo ?? "",
    foto: inicial?.foto ?? "",
    bio: inicial?.bio ?? "",
    logros: inicial ? inicial.logros.join("\n") : "",
    platos: inicial ? inicial.platos.join("\n") : "",
    enlace: inicial?.enlace ?? "",
  });
  const [error, setError] = useState("");
  const set = (campo: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setC({ ...c, [campo]: e.target.value });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const logros = c.logros.split("\n").map((s) => s.trim()).filter(Boolean);
    const platos = c.platos.split("\n").map((s) => s.trim()).filter(Boolean);
    if (c.nombre.trim().length < 3) return setError("Escribe el nombre del cocinero.");
    if (c.bio.trim().length < 20) return setError("Escribe una biografía corta (al menos 20 letras).");
    if (logros.length < 1) return setError("Escribe al menos 1 logro, uno por línea.");
    if (platos.length < 1) return setError("Escribe al menos 1 plato estrella, uno por línea.");
    if (!/^https?:\/\//.test(c.enlace.trim())) return setError("El enlace debe empezar con http:// o https://");
    addChef({
      id: inicial?.id ?? `chef-${Date.now()}`,
      nombre: c.nombre.trim(),
      titulo: c.titulo.trim() || "Cocinero peruano",
      foto: c.foto.trim() || undefined,
      bio: c.bio.trim(),
      logros,
      platos,
      enlace: c.enlace.trim(),
    });
    onListo(
      inicial
        ? `Datos de ${c.nombre.trim()} actualizados.`
        : `Cocinero agregado: ${c.nombre.trim()}.`
    );
    onCerrar();
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta="Agregar cocinero famoso">
      <div className="relative">
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors hover:bg-rojo">
          <IconCerrar className="h-5 w-5" />
        </button>
        <div className="bg-verde-2 px-6 pb-6 pt-9 text-crema sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aji-2">Solo administrador</p>
          <h2 className="mt-1.5 font-display text-3xl font-black">
            {inicial ? `Editar a ${inicial.nombre}` : "Agregar cocinero"}
          </h2>
        </div>
        <form onSubmit={enviar} className="space-y-4 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ch-nombre" className={claseLabel}>Nombre *</label>
              <input id="ch-nombre" value={c.nombre} onChange={set("nombre")} placeholder="Nombre y apellido" className={claseInput} />
            </div>
            <div>
              <label htmlFor="ch-titulo" className={claseLabel}>Título o apodo</label>
              <input id="ch-titulo" value={c.titulo} onChange={set("titulo")} placeholder="Por ejemplo: La reina del sabor criollo" className={claseInput} />
            </div>
          </div>
          <div>
            <label htmlFor="ch-foto" className={claseLabel}>Foto del cocinero (enlace, opcional)</label>
            <input id="ch-foto" value={c.foto} onChange={set("foto")} placeholder="https://… (sin foto se muestra su monograma)" className={claseInput} />
          </div>
          <div>
            <label htmlFor="ch-bio" className={claseLabel}>Biografía corta *</label>
            <textarea id="ch-bio" rows={3} value={c.bio} onChange={set("bio")} placeholder="¿Quién es y por qué importa su cocina?" className={claseInput} />
          </div>
          <div>
            <label htmlFor="ch-logros" className={claseLabel}>Logros * (uno por línea)</label>
            <textarea id="ch-logros" rows={3} value={c.logros} onChange={set("logros")} placeholder={"Premio nacional de cocina 2020\nJurado de festivales gastronómicos"} className={claseInput} />
          </div>
          <div>
            <label htmlFor="ch-platos" className={claseLabel}>Platos estrella * (uno por línea)</label>
            <textarea id="ch-platos" rows={2} value={c.platos} onChange={set("platos")} placeholder={"Seco de cabrito\nTorta de choclo"} className={claseInput} />
          </div>
          <div>
            <label htmlFor="ch-enlace" className={claseLabel}>Enlace para conocer más *</label>
            <input id="ch-enlace" value={c.enlace} onChange={set("enlace")} placeholder="https://…" className={claseInput} />
          </div>
          {error && <p role="alert" className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold text-rojo-2">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-verde px-6 py-3.5 text-lg font-bold text-crema transition-all hover:-translate-y-0.5 hover:bg-verde-2">
            {inicial ? "Guardar cambios" : "Agregar cocinero"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

function FormConsejo({ onCerrar, onListo }: { onCerrar: () => void; onListo: (msg: string) => void }) {
  const [c, setC] = useState({ titulo: "", texto: "" });
  const [error, setError] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (c.titulo.trim().length < 3) return setError("Escribe un título corto para el consejo.");
    if (c.texto.trim().length < 15) return setError("El consejo necesita al menos 15 letras.");
    addConsejo({ id: `c-${Date.now()}`, titulo: c.titulo.trim(), texto: c.texto.trim() });
    onListo("Consejo publicado en la sección de utensilios.");
    onCerrar();
  };

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta="Agregar consejo de utensilios">
      <div className="relative">
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors hover:bg-rojo">
          <IconCerrar className="h-5 w-5" />
        </button>
        <div className="bg-verde-2 px-6 pb-6 pt-9 text-crema sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aji-2">Solo administrador</p>
          <h2 className="mt-1.5 font-display text-3xl font-black">Consejo de la casa</h2>
        </div>
        <form onSubmit={enviar} className="space-y-4 px-6 py-6 sm:px-8">
          <div>
            <label htmlFor="co-titulo" className={claseLabel}>Título *</label>
            <input id="co-titulo" value={c.titulo} onChange={(e) => setC({ ...c, titulo: e.target.value })} placeholder="Por ejemplo: La prueba de la gota de agua" className={claseInput} />
          </div>
          <div>
            <label htmlFor="co-texto" className={claseLabel}>Consejo *</label>
            <textarea id="co-texto" rows={4} value={c.texto} onChange={(e) => setC({ ...c, texto: e.target.value })} placeholder="Cuéntalo como se lo contarías a tu familia…" className={claseInput} />
          </div>
          {error && <p role="alert" className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold text-rojo-2">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-verde px-6 py-3.5 text-lg font-bold text-crema transition-all hover:-translate-y-0.5 hover:bg-verde-2">
            Publicar consejo
          </button>
        </form>
      </div>
    </Modal>
  );
}

/* ---------- Página principal ---------- */

export default function CocinaBasica({
  esAdmin,
  logueado,
  completos,
  onCompletar,
  avisar,
}: {
  esAdmin: boolean;
  logueado: boolean;
  completos: string[];
  onCompletar: (nivelId: string) => void;
  avisar: (mensaje: string) => void;
}) {
  const [pestana, setPestana] = useState<Pestana>("niveles");
  const [niveles, setNiveles] = useState<NivelBasica[]>(() => getNivelesBasica());
  const [chefs, setChefs] = useState<Chef[]>(() => getChefs());
  const [consejos, setConsejos] = useState<ConsejoUtensilio[]>(() => getConsejos());
  const [nivelAbierto, setNivelAbierto] = useState<string | null>(null);
  const [modal, setModal] = useState<"nivel" | "chef" | "consejo" | null>(null);
  const [editandoChef, setEditandoChef] = useState<Chef | null>(null);

  return (
    <div className="bg-papel">
      {/* Cabecera */}
      <section className="relative overflow-hidden bg-tinta pb-28 pt-40 text-papel">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #f5a31a 0%, transparent 65%)" }}
        />
        <p
          aria-hidden="true"
          className="text-stroke-papel pointer-events-none absolute -bottom-6 right-0 select-none whitespace-nowrap font-display text-[18vw] font-black leading-none"
        >
          ESCUELA
        </p>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-aji">
              <span className="h-px w-10 bg-aji" /> La escuela de la casa
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              Cocina <em className="text-aji">Básica</em>: aprender bien para cocinar mejor
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-lila sm:text-xl">
              Tres puertas para entrar a la cocina con el pie derecho: niveles
              de manualidades de cocina, una guía científica de utensilios y las
              historias de los grandes cocineros del Perú. Elige tu puerta.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Boletos de acceso */}
      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3" role="tablist" aria-label="Secciones de Cocina Básica">
          {PESTANAS.map(({ id, nombre, desc, Icono }) => {
            const activa = pestana === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setPestana(id)}
                className={`group rounded-xl border-2 p-5 text-left shadow-lg transition-all duration-300 ${
                  activa
                    ? "-translate-y-1 border-rojo bg-rojo text-crema shadow-[0_18px_36px_rgba(215,38,61,0.35)]"
                    : "border-tinta/10 bg-crema text-tinta hover:-translate-y-1 hover:border-uva hover:shadow-xl"
                }`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-lg transition-colors duration-300 ${
                    activa ? "bg-crema text-rojo" : "bg-uva text-aji group-hover:bg-uva-2"
                  }`}
                >
                  <Icono className="h-6 w-6" />
                </span>
                <span className="mt-4 block font-display text-xl font-black leading-tight sm:text-2xl">
                  {nombre}
                </span>
                <span className={`mt-1.5 block text-sm font-bold leading-snug ${activa ? "text-crema/90" : "text-uva-2"}`}>
                  {desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6">
        {/* ============ NIVELES ============ */}
        {pestana === "niveles" && (
          <section aria-label="Manualidades en cocina: niveles">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <h2 className="font-display text-3xl font-black text-tinta sm:text-4xl">
                    Niveles de cocina ({niveles.length} de {MAX_NIVELES})
                  </h2>
                  <p className="mt-2 max-w-2xl text-lg leading-relaxed text-uva">
                    Cada nivel es una habilidad completa para la vida. Tócalos
                    para abrirlos y practica a tu ritmo, sin apuro.
                  </p>
                </div>
                {esAdmin && (
                  <button
                    type="button"
                    onClick={() => setModal("nivel")}
                    disabled={niveles.length >= MAX_NIVELES}
                    className="inline-flex items-center gap-2.5 rounded-lg bg-verde px-5 py-3 font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-verde-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <IconMas className="h-5 w-5" /> Publicar nivel
                  </button>
                )}
              </div>
            </Reveal>

            {niveles.length === 0 && (
              <Reveal delay={120}>
                <div className="mt-8 rounded-xl border-l-8 border-aji bg-crema p-7 shadow-md">
                  <p className="font-display text-2xl font-black text-tinta">
                    La pizarra está limpia, lista para escribir
                  </p>
                  <p className="mt-2 max-w-2xl leading-relaxed text-uva">
                    {esAdmin
                      ? "Todavía no has publicado ningún nivel. Usa el botón verde para publicar el primero de los 8 niveles disponibles."
                      : "Todavía no se han publicado niveles en esta escuela. Vuelve pronto: el administrador está preparando el primer curso."}
                  </p>
                </div>
              </Reveal>
            )}

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: MAX_NIVELES }).map((_, i) => {
                const nivel = niveles[i];
                if (!nivel) {
                  return (
                    <div
                      key={`libre-${i}`}
                      className="flex min-h-44 flex-col items-start justify-end rounded-xl border-2 border-dashed border-uva/25 bg-crema/50 p-6"
                    >
                      <span className="font-display text-6xl font-black leading-none text-uva/10">
                        {i + 1}
                      </span>
                      <p className="mt-3 font-display text-lg font-black text-uva/40">
                        Nivel {i + 1} · aún sin publicar
                      </p>
                      <p className="mt-1 text-sm font-bold text-uva-2/70">
                        {esAdmin
                          ? "Este espacio espera tu próximo nivel."
                          : "Próximamente en la escuela."}
                      </p>
                    </div>
                  );
                }
                const abierto = nivelAbierto === nivel.id;
                const completo = completos.includes(nivel.id);
                return (
                  <Reveal key={nivel.id} delay={(i % 2) * 100}>
                    <article
                      className={`overflow-hidden rounded-xl border-2 bg-crema shadow-md transition-shadow duration-300 hover:shadow-xl ${
                        completo ? "border-verde/60" : "border-tinta/10"
                      }`}
                    >
                      {nivel.imagen && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={nivel.imagen}
                            alt=""
                            loading="lazy"
                            className="kenburns h-full w-full object-cover"
                          />
                          {completo && (
                            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-verde px-3 py-1 text-xs font-black uppercase tracking-wider text-crema shadow">
                              <IconCheck className="h-3.5 w-3.5" /> Completado
                            </span>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setNivelAbierto(abierto ? null : nivel.id)}
                        aria-expanded={abierto}
                        className="flex w-full items-center gap-4 p-5 text-left"
                      >
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-uva font-display text-xl font-black text-aji">
                          {i + 1}
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-xl font-black leading-tight text-tinta">
                            {nivel.titulo}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-rojo">{nivel.tiempo}</span>
                            {nivel.video && (
                              <span className="rounded bg-papel-2 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-uva-2">
                                Con video
                              </span>
                            )}
                            {completo && !nivel.imagen && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-verde px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-crema">
                                <IconCheck className="h-3 w-3" /> Completado
                              </span>
                            )}
                          </span>
                        </span>
                        <IconChevron
                          className={`h-5 w-5 shrink-0 text-uva-2 transition-transform duration-300 ${abierto ? "rotate-180" : ""}`}
                        />
                      </button>
                      {abierto && (
                        <div className="modal-in border-t-2 border-papel-2 px-5 pb-6 pt-5">
                          <p className="font-display text-lg italic text-uva">{nivel.resumen}</p>
                          <ol className="mt-4 space-y-3">
                            {nivel.puntos.map((punto, j) => (
                              <li key={punto} className="flex gap-3.5">
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-papel-2 font-display text-sm font-black text-uva">
                                  {j + 1}
                                </span>
                                <span className="pt-0.5 leading-relaxed text-uva">{punto}</span>
                              </li>
                            ))}
                          </ol>
                          {nivel.video && (
                            <div className="mt-6">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-rojo">
                                  Video del tutorial
                                </p>
                                <a
                                  href={`https://www.youtube.com/watch?v=${nivel.video}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm font-bold text-verde transition-colors duration-300 hover:text-verde-2"
                                >
                                  Verlo en YouTube <IconExterno className="h-3.5 w-3.5" />
                                </a>
                              </div>
                              <div className="mt-3 aspect-video overflow-hidden rounded-lg border-2 border-tinta/10 bg-tinta shadow">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${nivel.video}`}
                                  title={`Video del nivel ${nivel.titulo}`}
                                  loading="lazy"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  className="h-full w-full"
                                />
                              </div>
                            </div>
                          )}
                          {logueado ? (
                            <button
                              type="button"
                              onClick={() => onCompletar(nivel.id)}
                              className={`mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg px-4 py-3.5 text-lg font-bold text-crema shadow transition-all duration-300 hover:-translate-y-0.5 ${
                                completo ? "bg-verde-2" : "bg-verde hover:bg-verde-2"
                              }`}
                            >
                              <IconCheck className="h-5 w-5" />
                              {completo
                                ? "Nivel completado — toca para deshacer"
                                : "Marcar como Completado"}
                            </button>
                          ) : (
                            <p className="mt-5 rounded-lg bg-papel-2 px-4 py-3 text-center text-sm font-bold leading-relaxed text-uva-2">
                              Inicia sesión (o crea tu cuenta) para marcar este nivel como
                              completado: también sube tu nivel de cocinero.
                            </p>
                          )}
                          {esAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                eliminarNivelBasica(nivel.id);
                                setNiveles(getNivelesBasica());
                                avisar(`Nivel "${nivel.titulo}" eliminado.`);
                              }}
                              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-rojo underline-offset-4 hover:underline"
                            >
                              <IconCerrar className="h-4 w-4" /> Quitar este nivel
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ============ UTENSILIOS ============ */}
        {pestana === "utensilios" && (
          <section aria-label="Buenos utensilios de cocina">
            <Reveal>
              <h2 className="max-w-3xl font-display text-3xl font-black text-tinta sm:text-4xl">
                Buenos Utensilios: la ciencia detrás de una buena olla
              </h2>
              <p className="dropcap mt-4 max-w-3xl text-lg leading-relaxed text-uva">
                No hace falta gastar una fortuna para cocinar bien: hace falta
                entender los materiales. El calor se mueve de forma distinta en
                cada metal, y eso cambia todo: cómo se dora la carne, cómo se
                pega el arroz y cuánto dura la olla en tu cocina. Aquí está lo
                que dice la física de la cocina, en cristiano.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <a
                href="https://www.youtube.com/results?search_query=como+elegir+ollas+y+sartenes+de+cocina+tutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-uva px-5 py-3 font-bold text-crema shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-uva-2 hover:shadow-lg"
              >
                Ver tutoriales en video sobre utensilios <IconExterno className="h-4 w-4" />
              </a>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {MATERIALES.map((m, i) => (
                <Reveal key={m.nombre} delay={(i % 3) * 110}>
                  <article className="flex h-full flex-col rounded-xl border-t-8 border-aji bg-crema p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <h3 className="font-display text-2xl font-black text-tinta">{m.nombre}</h3>
                    <p className="mt-3 rounded-lg bg-uva px-4 py-3 text-sm font-bold leading-relaxed text-lila">
                      <span className="text-aji">Según la ciencia:</span> {m.ciencia}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {m.bueno.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm font-bold leading-snug text-uva">
                          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-verde" /> {b}
                        </li>
                      ))}
                      {m.malo.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm font-bold leading-snug text-uva-2">
                          <IconCerrar className="mt-0.5 h-4 w-4 shrink-0 text-rojo" /> {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}

              {/* Checklist de calidad */}
              <Reveal delay={200}>
                <article className="flex h-full flex-col rounded-xl bg-rojo p-6 text-crema shadow-md">
                  <h3 className="font-display text-2xl font-black">
                    Cómo reconocer la calidad en la tienda
                  </h3>
                  <p className="mt-2 text-sm font-bold text-crema/85">
                    Antes de pagar, revisa estos 6 puntos con tus propias manos:
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {CHECKLIST.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm font-bold leading-snug">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-aji-2" /> {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            {/* Marcas probadas */}
            <Reveal delay={120}>
              <div className="mt-14">
                <h3 className="font-display text-2xl font-black text-tinta sm:text-3xl">
                  Las marcas que pasan la prueba
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-uva">
                  Recomendadas una y otra vez en pruebas comparativas de cocinas
                  especializadas (America's Test Kitchen, Serious Eats y
                  Wirecutter). No son las únicas buenas, pero son apuesta segura.
                </p>
                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {MARCAS.map(({ categoria, marcas }) => (
                    <div key={categoria} className="rounded-xl border-2 border-tinta/10 bg-crema p-5">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-rojo">{categoria}</p>
                      <ul className="mt-3 space-y-3">
                        {marcas.map(([marca, razon]) => (
                          <li key={marca}>
                            <span className="block font-display text-lg font-black leading-tight text-tinta">{marca}</span>
                            <span className="text-sm font-bold leading-snug text-uva-2">{razon}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Consejos de la casa (personalizables por el admin) */}
            <Reveal delay={150}>
              <div className="mt-14">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="font-display text-2xl font-black text-tinta sm:text-3xl">
                    Consejos de la casa
                  </h3>
                  {esAdmin && (
                    <button
                      type="button"
                      onClick={() => setModal("consejo")}
                      className="inline-flex items-center gap-2 rounded-lg bg-verde px-4 py-2.5 text-sm font-bold text-crema shadow transition-all hover:-translate-y-0.5 hover:bg-verde-2"
                    >
                      <IconMas className="h-4 w-4" /> Agregar consejo
                    </button>
                  )}
                </div>
                {consejos.length === 0 ? (
                  <p className="mt-5 rounded-xl border-2 border-dashed border-uva/25 bg-crema/60 p-6 font-bold text-uva-2">
                    {esAdmin
                      ? "Aún no has publicado consejos. Comparte aquí tus trucos de toda la vida."
                      : "Aquí aparecerán los trucos del administrador para elegir y cuidar utensilios."}
                  </p>
                ) : (
                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {consejos.map((consejo) => (
                      <article key={consejo.id} className="rounded-xl border-l-8 border-uva-3 bg-crema p-5 shadow-sm">
                        <p className="font-display text-lg font-black text-tinta">{consejo.titulo}</p>
                        <p className="mt-1.5 text-sm font-bold leading-relaxed text-uva">{consejo.texto}</p>
                        {esAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              eliminarConsejo(consejo.id);
                              setConsejos(getConsejos());
                              avisar("Consejo eliminado.");
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-rojo underline-offset-4 hover:underline"
                          >
                            <IconCerrar className="h-3.5 w-3.5" /> Quitar
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* ============ CHEFS ============ */}
        {pestana === "chefs" && (
          <section aria-label="Cocineros famosos del Perú">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <h2 className="max-w-2xl font-display text-3xl font-black text-tinta sm:text-4xl">
                    Aprende de los mejores cocineros del Perú
                  </h2>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-uva">
                    Ellos pusieron la cocina peruana en la mesa del mundo.
                    Conoce sus historias, sus logros y los platos con los que
                    hicieron historia.
                  </p>
                </div>
                {esAdmin && (
                  <button
                    type="button"
                    onClick={() => setModal("chef")}
                    className="inline-flex items-center gap-2.5 rounded-lg bg-verde px-5 py-3 font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-verde-2"
                  >
                    <IconMas className="h-5 w-5" /> Agregar cocinero
                  </button>
                )}
              </div>
            </Reveal>

            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {chefs.map((chef, i) => {
                const iniciales = chef.nombre
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p.charAt(0))
                  .join("")
                  .toUpperCase();
                return (
                  <Reveal key={chef.id} delay={(i % 2) * 120}>
                    <article className="flex h-full flex-col rounded-xl border-2 border-tinta/10 bg-crema p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-rojo/40 hover:shadow-xl">
                      <div className="flex items-center gap-5">
                        {chef.foto ? (
                          <img
                            src={chef.foto}
                            alt={`Foto de ${chef.nombre}`}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-full border-2 border-aji object-cover shadow-inner"
                          />
                        ) : (
                          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-uva font-display text-2xl font-black text-aji shadow-inner">
                            {iniciales}
                          </span>
                        )}
                        <div>
                          <h3 className="font-display text-2xl font-black leading-tight text-tinta">
                            {chef.nombre}
                          </h3>
                          <p className="mt-0.5 font-display text-base italic text-rojo">{chef.titulo}</p>
                        </div>
                      </div>
                      <p className="mt-5 leading-relaxed text-uva">{chef.bio}</p>
                      <div className="mt-5">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-uva-2">Logros</p>
                        <ul className="mt-2.5 space-y-2">
                          {chef.logros.map((logro) => (
                            <li key={logro} className="flex gap-2.5 text-sm font-bold leading-snug text-uva">
                              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-verde" /> {logro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-uva-2">Platos estrella</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {chef.platos.map((plato) => (
                            <span key={plato} className="rounded-full bg-papel-2 px-3.5 py-1.5 text-sm font-bold text-uva">
                              {plato}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                        <a
                          href={chef.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-bold text-rojo transition-all duration-300 hover:gap-3.5 hover:text-rojo-2"
                        >
                          Conocer más sobre {chef.nombre.split(" ")[0]} <IconExterno className="h-4 w-4" />
                        </a>
                        {esAdmin && (
                          <span className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setEditandoChef(chef);
                                setModal("chef");
                              }}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-verde underline-offset-4 hover:text-verde-2 hover:underline"
                            >
                              <IconEditar className="h-4 w-4" /> Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                eliminarChef(chef.id);
                                setChefs(getChefs());
                                avisar(`Cocinero ${chef.nombre} eliminado.`);
                              }}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-uva-2 underline-offset-4 hover:text-rojo hover:underline"
                            >
                              <IconCerrar className="h-4 w-4" /> Quitar
                            </button>
                          </span>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {modal === "nivel" && (
        <FormNivel
          onCerrar={() => setModal(null)}
          onListo={(msg) => {
            setNiveles(getNivelesBasica());
            avisar(msg);
          }}
        />
      )}
      {modal === "chef" && (
        <FormChef
          key={editandoChef?.id ?? "chef-nuevo"}
          inicial={editandoChef}
          onCerrar={() => {
            setModal(null);
            setEditandoChef(null);
          }}
          onListo={(msg) => {
            setChefs(getChefs());
            setEditandoChef(null);
            avisar(msg);
          }}
        />
      )}
      {modal === "consejo" && (
        <FormConsejo
          onCerrar={() => setModal(null)}
          onListo={(msg) => {
            setConsejos(getConsejos());
            avisar(msg);
          }}
        />
      )}
    </div>
  );
}
