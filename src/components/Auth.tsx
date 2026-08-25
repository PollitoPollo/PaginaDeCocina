import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Receta } from "../data";
import {
  iniciarSesion,
  NIVELES,
  nivelPara,
  recordarClave,
  registrar,
  type Usuario,
} from "../lib/store";
import {
  IconCheck,
  IconChevron,
  IconCerrar,
  IconLlave,
  IconMas,
  IconUsuario,
  Modal,
} from "./ui";
import ModalTerminos from "./Terminos";

export type ModoAuth = "login" | "registro" | "recordar";

/* ================= Botones y menú de la esquina superior derecha ================= */

export function ControlAuth({
  sesion,
  aprendidas,
  recetas,
  nivelCompletos,
  onAbrirAuth,
  onCerrarSesion,
  onAgregarReceta,
}: {
  sesion: Usuario | null;
  aprendidas: string[];
  recetas: Receta[];
  nivelCompletos: number;
  onAbrirAuth: (modo: ModoAuth) => void;
  onCerrarSesion: () => void;
  onAgregarReceta: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const alClic = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  /* --- Sin sesión: botones de acceso --- */
  if (!sesion) {
    return (
      <div className="ml-auto flex items-center gap-2 md:ml-6">
        <button
          type="button"
          onClick={() => onAbrirAuth("registro")}
          className="rounded-lg border-2 border-lila/50 px-3.5 py-2 text-sm font-bold text-papel transition-colors duration-300 hover:border-aji hover:text-aji"
        >
          Crear cuenta
        </button>
        <button
          type="button"
          onClick={() => onAbrirAuth("login")}
          className="rounded-lg bg-aji px-3.5 py-2 text-sm font-bold text-tinta transition-all duration-300 hover:bg-aji-2 hover:shadow-lg"
        >
          Ingresar
        </button>
      </div>
    );
  }

  /* --- Con sesión: menú desplegable --- */
  const totalAprendido = aprendidas.length + nivelCompletos;
  const nivel = nivelPara(totalAprendido);
  const recetasAprendidas = aprendidas
    .map((id) => recetas.find((r) => r.id === id))
    .filter((r): r is Receta => Boolean(r));

  return (
    <div ref={ref} className="relative ml-auto md:ml-6">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-lg border border-uva-2 bg-uva py-1.5 pl-1.5 pr-3 text-papel transition-colors duration-300 hover:border-aji"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-aji font-display text-base font-black text-tinta">
          {sesion.usuario.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-bold sm:block">
          {sesion.usuario}
        </span>
        <IconChevron
          className={`h-4 w-4 text-lila transition-transform duration-300 ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <div className="modal-in absolute right-0 top-full z-50 mt-3 w-[21.5rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border-2 border-tinta/10 bg-crema text-tinta shadow-2xl">
          {/* Saludo */}
          <div className="bg-uva px-5 py-4 text-crema">
            <p className="flex items-center gap-2 font-display text-xl font-black">
              <IconUsuario className="h-5 w-5 text-aji" /> Hola, {sesion.usuario}
            </p>
            <p className="mt-0.5 truncate text-sm text-lila">{sesion.correo}</p>
            {sesion.esAdmin && (
              <span className="mt-2.5 inline-block rounded-full bg-aji px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-tinta">
                Cuenta administrador
              </span>
            )}
          </div>

          {/* Mi nivel de cocina */}
          <div className="border-t border-papel-2 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-uva-2">
              Mi nivel de cocina
            </p>
            <p className="mt-1.5 font-display text-2xl font-black leading-tight">
              Nivel {nivel.indice + 1} de {NIVELES.length}
              <span className="text-rojo"> · {nivel.actual.nombre}</span>
            </p>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-papel-2"
              role="progressbar"
              aria-valuenow={nivel.progreso}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso hacia el siguiente nivel de cocina"
            >
              <div
                className="h-full rounded-full bg-verde transition-[width] duration-700 ease-out"
                style={{ width: `${nivel.progreso}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-bold leading-snug text-uva-2">
              {totalAprendido === 1 ? "1 aprendizaje" : `${totalAprendido} aprendizajes`}:{" "}
              {aprendidas.length} de {recetas.length} recetas
              {nivelCompletos > 0 &&
                ` y ${nivelCompletos} ${nivelCompletos === 1 ? "nivel" : "niveles"} de cocina básica`}
              .{" "}
              {nivel.siguiente
                ? `Te faltan ${nivel.siguiente.min - totalAprendido} para ser "${nivel.siguiente.nombre}".`
                : "¡Llegaste al nivel máximo, maestro!"}
            </p>
          </div>

          {/* Recetas aprendidas */}
          <div className="max-h-44 overflow-y-auto border-t border-papel-2 px-5 py-3.5">
            {recetasAprendidas.length === 0 ? (
              <p className="py-1.5 text-sm leading-relaxed text-uva-2">
                Aún no marcas recetas como aprendidas. Abre cualquier receta y
                toca el botón verde <strong>Receta Aprendida</strong>.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {recetasAprendidas.map((r) => (
                  <li key={r.id} className="flex items-center gap-3">
                    <img
                      src={r.imagen}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <span className="flex-1 text-sm font-bold leading-tight">
                      {r.nombre}
                    </span>
                    <IconCheck className="h-5 w-5 shrink-0 text-verde" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Acciones */}
          <div className="border-t border-papel-2 p-3">
            {sesion.esAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  onAgregarReceta();
                }}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-uva px-4 py-2.5 text-sm font-bold text-crema transition-colors duration-300 hover:bg-uva-2"
              >
                <IconMas className="h-4 w-4" /> Agregar receta nueva
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                onCerrarSesion();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-rojo/60 px-4 py-2.5 text-sm font-bold text-rojo transition-colors duration-300 hover:bg-rojo hover:text-crema"
            >
              <IconLlave className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Ventana de acceso: entrar, registrarse o recordar clave ================= */

export function ModalAuth({
  modoInicial,
  esAdmin,
  onCerrar,
  onExito,
  onToast,
}: {
  modoInicial: ModoAuth;
  esAdmin: boolean;
  onCerrar: () => void;
  onExito: (usuario: Usuario) => void;
  onToast: (mensaje: string) => void;
}) {
  const [modo, setModo] = useState<ModoAuth>(modoInicial);
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [verTerminos, setVerTerminos] = useState(false);
  const [error, setError] = useState("");

  const cambiarModo = (m: ModoAuth) => {
    setModo(m);
    setError("");
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (modo === "registro") {
      if (!correo.includes("@") || !correo.includes(".")) {
        setError("Escribe un correo válido, por ejemplo nombre@correo.com");
        return;
      }
      if (usuario.trim().length < 3) {
        setError("El nombre de usuario debe tener al menos 3 letras.");
        return;
      }
      if (clave.length < 4) {
        setError("La contraseña debe tener al menos 4 caracteres.");
        return;
      }
      if (clave !== clave2) {
        setError("Las contraseñas no coinciden. Vuelve a escribirlas con calma.");
        return;
      }
      if (!aceptaTerminos) {
        setError("Para crear tu cuenta necesitas aceptar los Términos y Condiciones.");
        return;
      }
      const r = registrar(correo, usuario, clave);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      onToast(`¡Cuenta creada! Bienvenido a la mesa, ${r.usuario.usuario}.`);
      onExito(r.usuario);
      return;
    }

    if (modo === "login") {
      const r = iniciarSesion(usuario, clave);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      onToast(`¡Hola de nuevo, ${r.usuario.usuario}!`);
      onExito(r.usuario);
      return;
    }

    if (usuario.trim().length < 3 || !correo.includes("@")) {
      setError("Escribe tu usuario y el correo con el que te registraste.");
      return;
    }
    if (clave.length < 4) {
      setError("La nueva contraseña debe tener al menos 4 caracteres.");
      return;
    }
    const r = recordarClave(usuario, correo, clave);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    onToast("Contraseña restablecida. ¡Ya estás dentro!");
    onExito(r.usuario);
  };

  const claseInput =
    "mt-1.5 w-full rounded-lg border-2 border-papel-2 bg-crema px-4 py-3 text-base text-tinta placeholder:text-uva-2/50 focus:border-uva focus:outline-none";
  const claseLabel = "block text-sm font-bold uppercase tracking-wider text-uva-2";

  return (
    <>
    <Modal abierto onCerrar={onCerrar} etiqueta="Iniciar sesión o crear cuenta">
      <div className="relative">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ventana"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-tinta/20 text-crema transition-colors duration-300 hover:bg-rojo"
        >
          <IconCerrar className="h-5 w-5" />
        </button>

        <div className="bg-uva px-6 pb-6 pt-9 text-crema sm:px-8">
          <h2 className="font-display text-3xl font-black tracking-tight">Mi cuenta</h2>
          <p className="mt-1.5 text-lila">
            Guarda tus recetas aprendidas y sube tu nivel de cocina.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {modo !== "recordar" ? (
            <div
              className="grid grid-cols-2 gap-1 rounded-lg bg-papel-2 p-1 text-sm font-bold"
              role="tablist"
              aria-label="Tipo de acceso"
            >
              <button
                type="button"
                role="tab"
                aria-selected={modo === "login"}
                onClick={() => cambiarModo("login")}
                className={`rounded-md px-3 py-2.5 transition-colors duration-300 ${
                  modo === "login" ? "bg-uva text-crema shadow" : "text-uva-2 hover:text-tinta"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modo === "registro"}
                onClick={() => cambiarModo("registro")}
                className={`rounded-md px-3 py-2.5 transition-colors duration-300 ${
                  modo === "registro" ? "bg-uva text-crema shadow" : "text-uva-2 hover:text-tinta"
                }`}
              >
                Crear cuenta
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => cambiarModo("login")}
              className="text-sm font-bold text-rojo underline-offset-4 hover:underline"
            >
              ← Volver a iniciar sesión
            </button>
          )}

          <form onSubmit={enviar} className="mt-5 space-y-4" noValidate>
            {modo !== "login" && (
              <div>
                <label htmlFor="auth-correo" className={claseLabel}>
                  {modo === "recordar" ? "Correo con el que te registraste" : "Correo electrónico"}
                </label>
                <input
                  id="auth-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="nombre@correo.com"
                  className={claseInput}
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-usuario" className={claseLabel}>
                Nombre de usuario
              </label>
              <input
                id="auth-usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Por ejemplo: cocinera1950"
                className={claseInput}
              />
            </div>
            <div>
              <label htmlFor="auth-clave" className={claseLabel}>
                {modo === "recordar" ? "Nueva contraseña" : "Contraseña"}
              </label>
              <input
                id="auth-clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder={modo === "recordar" ? "Escribe tu nueva clave" : "Tu clave secreta"}
                className={claseInput}
              />
            </div>

            {modo === "registro" && (
              <>
                <div>
                  <label htmlFor="auth-clave2" className={claseLabel}>
                    Confirmar contraseña
                  </label>
                  <input
                    id="auth-clave2"
                    type="password"
                    value={clave2}
                    onChange={(e) => setClave2(e.target.value)}
                    placeholder="Vuelve a escribir la misma clave"
                    className={claseInput}
                  />
                  {clave2.length > 0 && (
                    <p
                      className={`mt-1.5 text-sm font-bold ${
                        clave === clave2 ? "text-verde" : "text-rojo"
                      }`}
                    >
                      {clave === clave2
                        ? "✓ Las contraseñas coinciden."
                        : "Las contraseñas todavía no coinciden."}
                    </p>
                  )}
                </div>

                {/* Aceptar Términos y Condiciones */}
                <div
                  className={`rounded-lg border-2 p-4 transition-colors duration-300 ${
                    aceptaTerminos ? "border-verde bg-verde/10" : "border-papel-2 bg-crema"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (aceptaTerminos) {
                        setAceptaTerminos(false);
                      } else {
                        setVerTerminos(true);
                      }
                    }}
                    aria-pressed={aceptaTerminos}
                    className="flex w-full items-center gap-3.5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 transition-all duration-300 ${
                        aceptaTerminos
                          ? "border-verde bg-verde text-crema"
                          : "border-uva-2/50 bg-crema"
                      }`}
                    >
                      {aceptaTerminos && <IconCheck className="h-4 w-4" />}
                    </span>
                    <span className="font-bold leading-snug text-uva">
                      Aceptar los{" "}
                      <span className="text-rojo underline underline-offset-4">
                        Términos y Condiciones
                      </span>{" "}
                      de Cocina Pulguita
                    </span>
                  </button>
                  <p className="mt-2 pl-[2.65rem] text-[13px] font-bold leading-snug text-uva-2">
                    {aceptaTerminos
                      ? "Gracias por leerlos. Ya puedes crear tu cuenta."
                      : "Tócalos para leerlos: aparecerá un recuadro con las reglas de esta mesa."}
                  </p>
                </div>
              </>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border-2 border-rojo/40 bg-rojo/10 px-4 py-3 text-sm font-bold leading-snug text-rojo-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-aji px-6 py-3.5 text-lg font-bold text-tinta transition-all duration-300 hover:-translate-y-0.5 hover:bg-aji-2 hover:shadow-lg"
            >
              {modo === "login"
                ? "Iniciar sesión"
                : modo === "registro"
                  ? "Crear mi cuenta"
                  : "Restablecer contraseña"}
            </button>
          </form>

          {modo === "login" && (
            <button
              type="button"
              onClick={() => cambiarModo("recordar")}
              className="mt-4 w-full text-center text-sm font-bold text-uva-2 underline-offset-4 transition-colors hover:text-rojo hover:underline"
            >
              ¿Olvidaste tu contraseña? Restablécela aquí
            </button>
          )}
        </div>
      </div>
    </Modal>

    {/* Recuadro de Términos y Condiciones, con los colores de la página */}
    <ModalTerminos
      abierto={verTerminos}
      esAdmin={esAdmin}
      avisar={onToast}
      onCerrar={() => setVerTerminos(false)}
      onAceptar={() => setAceptaTerminos(true)}
    />
    </>
  );
}
