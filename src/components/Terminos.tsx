import { useState } from "react";
import { getTerminos, guardarTerminos } from "../lib/store";
import { IconCerrar, IconEditar, IconOlla, Modal } from "./ui";

function Parrafo({ texto }: { texto: string }) {
  const m = texto.match(/^(\d+)\.\s+([\s\S]*)/);
  if (m) {
    return (
      <div className="flex gap-4">
        <span className="font-display text-2xl font-black leading-none text-rojo">
          {m[1]}.
        </span>
        <p className="leading-relaxed text-uva">
          <span className="block font-display text-lg font-black text-tinta">
            {m[2].split("\n")[0]}
          </span>
          {m[2].split("\n").slice(1).join(" ")}
        </p>
      </div>
    );
  }
  return <p className="leading-relaxed text-uva">{texto}</p>;
}

export default function ModalTerminos({
  abierto,
  onCerrar,
  esAdmin,
  avisar,
  onAceptar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  esAdmin: boolean;
  avisar: (mensaje: string) => void;
  /** Si existe, se muestra el botón verde "He leído y acepto" (se usa al registrarse). */
  onAceptar?: () => void;
}) {
  const [terminos, setTerminos] = useState(getTerminos);
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [error, setError] = useState("");

  const parrafos = terminos.texto.split(/\n\s*\n|\n(?=\d+\.)/).map((p) => p.trim()).filter(Boolean);

  const guardar = () => {
    if (borrador.trim().length < 40) {
      setError("Los términos necesitan más contenido para guardarse.");
      return;
    }
    guardarTerminos(borrador);
    setTerminos(getTerminos());
    setEditando(false);
    setError("");
    avisar("Los Términos y Condiciones se actualizaron.");
  };

  if (!abierto) return null;

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} etiqueta="Términos y Condiciones">
      <div className="relative">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar términos y condiciones"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors duration-300 hover:bg-rojo"
        >
          <IconCerrar className="h-5 w-5" />
        </button>

        <div className="relative overflow-hidden bg-uva px-6 pb-6 pt-9 text-crema sm:px-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, #f5a31a 0%, transparent 70%)" }}
          />
          <p className="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.24em] text-aji">
            <IconOlla className="h-4 w-4" /> Las reglas de esta mesa
          </p>
          <h2 className="mt-2 pr-10 font-display text-3xl font-black tracking-tight">
            Términos y Condiciones
          </h2>
          <p className="mt-2 text-sm font-bold text-lila">
            Última actualización: {terminos.actualizado}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {!editando ? (
            <>
              <div className="max-h-80 space-y-6 overflow-y-auto pr-1.5">
                {parrafos.map((p, i) => (
                  <Parrafo key={i} texto={p} />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t-2 border-papel-2 pt-5">
                {onAceptar ? (
                  <button
                    type="button"
                    onClick={() => {
                      onAceptar();
                      onCerrar();
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-verde px-6 py-3 font-bold text-crema shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde-2 hover:shadow-lg"
                  >
                    He leído y acepto
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCerrar}
                    className="inline-flex items-center gap-2 rounded-lg bg-uva px-6 py-3 font-bold text-crema transition-all duration-300 hover:-translate-y-0.5 hover:bg-uva-2"
                  >
                    Entendido
                  </button>
                )}
                {esAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setBorrador(terminos.texto);
                      setError("");
                      setEditando(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-verde px-5 py-[0.6rem] font-bold text-verde transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde hover:text-crema"
                  >
                    <IconEditar className="h-4 w-4" /> Editar términos (admin)
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="terminos-editor"
                className="block text-sm font-bold uppercase tracking-wider text-uva-2"
              >
                Texto de los términos (solo administrador)
              </label>
              <textarea
                id="terminos-editor"
                rows={12}
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
                className="mt-2 w-full rounded-lg border-2 border-papel-2 bg-crema px-4 py-3 text-base leading-relaxed text-tinta focus:border-uva focus:outline-none"
                placeholder="Escribe cada punto en su propio párrafo. Empieza con “1. Título” para que se vea numerado."
              />
              {error && (
                <p role="alert" className="mt-2 text-sm font-bold text-rojo">
                  {error}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={guardar}
                  className="inline-flex items-center gap-2 rounded-lg bg-verde px-6 py-3 font-bold text-crema transition-all duration-300 hover:-translate-y-0.5 hover:bg-verde-2"
                >
                  Guardar términos
                </button>
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="rounded-lg border-2 border-uva/40 px-6 py-[0.68rem] font-bold text-uva transition-colors duration-300 hover:bg-papel-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
