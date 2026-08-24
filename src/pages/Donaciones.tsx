import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  getDonaciones,
  guardarDonaciones,
  type Donaciones,
} from "../lib/store";
import {
  IconCerrar,
  IconCorazon,
  IconEditar,
  IconAji,
  IconMaiz,
  IconOlla,
  Modal,
  Reveal,
} from "../components/ui";

/* QR decorativo de ejemplo, mientras el administrador no suba el suyo */
function QRDecorativo() {
  const n = 25;
  const celdas: { x: number; y: number }[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const enFinder =
        (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!enFinder && (x * 7 + y * 11 + ((x * y) % 5)) % 3 === 0) {
        celdas.push({ x, y });
      }
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" fill="#2b0f2e" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fffaef" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#2b0f2e" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="h-full w-full" role="img" aria-label="Código QR de ejemplo">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fffaef" />
      {celdas.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#2b0f2e" />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}

const claseInput =
  "mt-1.5 w-full rounded-lg border-2 border-papel-2 bg-crema px-3.5 py-2.5 text-base text-tinta placeholder:text-uva-2/50 focus:border-uva focus:outline-none";
const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

export default function DonacionesPage({
  esAdmin,
  avisar,
}: {
  esAdmin: boolean;
  avisar: (mensaje: string) => void;
}) {
  const [datos, setDatos] = useState<Donaciones>(() => getDonaciones());
  const [editando, setEditando] = useState(false);
  const [c, setC] = useState({ ...datos });
  const [error, setError] = useState("");

  const set =
    (campo: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setC({ ...c, [campo]: e.target.value });

  const abrirEditor = () => {
    setC({ ...datos });
    setError("");
    setEditando(true);
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (c.titulo.trim().length < 5) {
      setError("Escribe un título de agradecimiento.");
      return;
    }
    if (c.mensaje.trim().length < 20) {
      setError("Escribe el mensaje de agradecimiento (al menos 20 letras).");
      return;
    }
    const nuevos = {
      titulo: c.titulo.trim(),
      mensaje: c.mensaje.trim(),
      qr: c.qr.trim(),
      alias: c.alias.trim(),
    };
    guardarDonaciones(nuevos);
    setDatos(nuevos);
    setEditando(false);
    avisar("El apartado de donaciones se actualizó con cariño.");
  };

  return (
    <div className="bg-papel">
      {/* Cabecera con los colores de la casa */}
      <section className="relative overflow-hidden bg-uva pb-24 pt-44 text-papel">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #f5a31a 0%, transparent 62%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #d7263d 0%, transparent 62%)" }}
        />
        <p
          aria-hidden="true"
          className="text-stroke-papel pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap font-display text-[16vw] font-black leading-none"
        >
          GRACIAS
        </p>
        <IconCorazon className="floaty absolute right-[10%] top-32 hidden h-12 w-12 text-rojo lg:block" />
        <IconAji className="floaty absolute left-[14%] top-40 hidden h-9 w-9 lg:block" style={{ animationDelay: "1.4s" }} />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.24em] text-aji">
              <span className="h-px w-10 bg-aji" /> El corazón de la casa
            </p>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              {datos.titulo}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="dropcap mt-8 text-xl leading-relaxed text-lila sm:text-2xl">
              {datos.mensaje}
            </p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
          {/* Panel del QR */}
          <Reveal>
            <div className="overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema shadow-xl">
              <div className="border-b-4 border-aji bg-uva px-6 py-4 text-crema">
                <p className="font-display text-xl font-black">Escanea y apoya</p>
                <p className="text-sm font-bold text-lila">
                  Con tu billetera digital o la app de tu banco
                </p>
              </div>
              <div className="p-6">
                <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg border-2 border-dashed border-uva/30 bg-crema p-2">
                  {datos.qr ? (
                    <img
                      src={datos.qr}
                      alt="Código QR para donar"
                      className="h-full w-full rounded object-contain"
                    />
                  ) : (
                    <QRDecorativo />
                  )}
                </div>
                {!datos.qr && (
                  <p className="mt-3 text-center text-xs font-bold text-uva-2">
                    QR de ejemplo: el administrador puede subir el QR oficial desde su cuenta.
                  </p>
                )}
                {datos.alias && (
                  <p className="mt-4 rounded-lg bg-papel-2 px-4 py-3 text-center text-sm font-bold text-uva">
                    O transfiere al alias: <span className="text-rojo">{datos.alias}</span>
                  </p>
                )}
              </div>
            </div>
            {esAdmin && (
              <button
                type="button"
                onClick={abrirEditor}
                className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-verde px-6 py-3.5 text-base font-bold text-crema shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde-2"
              >
                <IconEditar className="h-5 w-5" /> Editar contenido de donaciones
              </button>
            )}
          </Reveal>

          {/* En qué se usa el apoyo */}
          <div>
            <Reveal delay={100}>
              <h2 className="font-display text-3xl font-black tracking-tight text-tinta sm:text-4xl">
                ¿En qué se convierte tu apoyo?
              </h2>
            </Reveal>
            <div className="mt-7 space-y-5">
              {[
                {
                  Icono: IconOlla,
                  titulo: "Más recetas probadas",
                  texto:
                    "Cada plato se cocina, se mide y se vuelve a cocinar antes de publicarse, para que en tu casa salga a la primera.",
                },
                {
                  Icono: IconMaiz,
                  titulo: "Videos y tutoriales",
                  texto:
                    "Grabamos los pasos en video para que nadie se pierda: ideal para aprender viendo, a cualquier edad.",
                },
                {
                  Icono: IconCorazon,
                  titulo: "La escuela, siempre abierta",
                  texto:
                    "Cocina Básica, los niveles y las guías de utensilios seguirán siendo gratuitos para jóvenes y abuelos.",
                },
              ].map(({ Icono, titulo, texto }, i) => (
                <Reveal key={titulo} delay={i * 110}>
                  <div className="flex gap-5 rounded-xl border-2 border-tinta/10 bg-crema p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-rojo/40 hover:shadow-xl">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-uva text-aji shadow-inner">
                      <Icono className="h-7 w-7" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-black text-tinta">{titulo}</h3>
                      <p className="mt-1.5 leading-relaxed text-uva">{texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={160}>
              <div className="mt-8 rounded-xl border-l-8 border-rojo bg-papel-2 p-6">
                <p className="font-display text-lg font-black text-tinta">
                  Un detalle pequeño también cuenta
                </p>
                <p className="mt-1.5 leading-relaxed text-uva">
                  No hay aporte chiquito cuando se hace con cariño. Y si hoy no
                  puedes donar, compartir una receta con alguien que quieras ya
                  es una forma hermosa de apoyar esta cocina.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      {editando && (
        <Modal abierto onCerrar={() => setEditando(false)} etiqueta="Editar donaciones">
          <div className="relative">
            <button
              type="button"
              onClick={() => setEditando(false)}
              aria-label="Cerrar ventana"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors hover:bg-rojo"
            >
              <IconCerrar className="h-5 w-5" />
            </button>
            <div className="bg-verde-2 px-6 pb-6 pt-9 text-crema sm:px-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-aji-2">
                Solo administrador
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-black">Editar donaciones</h2>
            </div>
            <form onSubmit={guardar} className="space-y-4 px-6 py-6 sm:px-8">
              <div>
                <label htmlFor="dn-titulo" className={claseLabel}>Título de agradecimiento *</label>
                <input id="dn-titulo" value={c.titulo} onChange={set("titulo")} className={claseInput} />
              </div>
              <div>
                <label htmlFor="dn-mensaje" className={claseLabel}>Mensaje grande de agradecimiento *</label>
                <textarea id="dn-mensaje" rows={5} value={c.mensaje} onChange={set("mensaje")} className={claseInput} />
              </div>
              <div>
                <label htmlFor="dn-qr" className={claseLabel}>Imagen del QR de donación (enlace)</label>
                <input id="dn-qr" value={c.qr} onChange={set("qr")} placeholder="https://…/mi-qr.png (vacío muestra el QR de ejemplo)" className={claseInput} />
              </div>
              <div>
                <label htmlFor="dn-alias" className={claseLabel}>Alias de transferencia (opcional)</label>
                <input id="dn-alias" value={c.alias} onChange={set("alias")} placeholder="Por ejemplo: COCINA.PULGUITA" className={claseInput} />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold text-rojo-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-verde px-6 py-3.5 text-lg font-bold text-crema transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde-2"
              >
                <IconCorazon className="h-5 w-5" /> Guardar con gratitud
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
