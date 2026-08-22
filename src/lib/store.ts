import { RECETAS, type Receta } from "../data";

export interface Usuario {
  id: string;
  correo: string;
  usuario: string;
  pass: string;
  esAdmin: boolean;
  creadoEn: string;
}

const K_USUARIOS = "sp_usuarios";
const K_SESION = "sp_sesion";
const K_EXTRA = "sp_recetas_extra";
const claveAprendidas = (idUsuario: string) => `sp_aprendidas_${idUsuario}`;

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const bruto = localStorage.getItem(clave);
    return bruto ? (JSON.parse(bruto) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin espacio disponible: se ignora */
  }
}

export function listaUsuarios(): Usuario[] {
  return leer<Usuario[]>(K_USUARIOS, []);
}

function guardarUsuarios(usuarios: Usuario[]) {
  escribir(K_USUARIOS, usuarios);
}

/* La cuenta de administrador se crea sola la primera vez.
   Demo: usuario "admin" · contraseña "admin123" */
(function sembrarAdmin() {
  const usuarios = listaUsuarios();
  if (!usuarios.some((u) => u.esAdmin)) {
    usuarios.push({
      id: "admin",
      correo: "admin@saborperu.pe",
      usuario: "admin",
      pass: "admin123",
      esAdmin: true,
      creadoEn: new Date().toISOString(),
    });
    guardarUsuarios(usuarios);
  }
})();

export type Resultado =
  | { ok: true; usuario: Usuario }
  | { ok: false; error: string };

export function iniciarSesion(nombre: string, clave: string): Resultado {
  const u = listaUsuarios().find(
    (x) => x.usuario.toLowerCase() === nombre.trim().toLowerCase()
  );
  if (!u || u.pass !== clave) {
    return {
      ok: false,
      error: "Usuario o contraseña incorrectos. Verifica e inténtalo de nuevo.",
    };
  }
  escribir(K_SESION, u.id);
  return { ok: true, usuario: u };
}

export function registrar(correo: string, nombre: string, clave: string): Resultado {
  const usuarios = listaUsuarios();
  if (usuarios.some((x) => x.usuario.toLowerCase() === nombre.trim().toLowerCase())) {
    return {
      ok: false,
      error: "Ese nombre de usuario ya está en uso. Elige otro, por favor.",
    };
  }
  if (usuarios.some((x) => x.correo.toLowerCase() === correo.trim().toLowerCase())) {
    return {
      ok: false,
      error: "Ese correo ya tiene una cuenta. Inicia sesión con él.",
    };
  }
  const nuevo: Usuario = {
    id: `u-${Date.now()}`,
    correo: correo.trim(),
    usuario: nombre.trim(),
    pass: clave,
    esAdmin: false,
    creadoEn: new Date().toISOString(),
  };
  guardarUsuarios([...usuarios, nuevo]);
  escribir(K_SESION, nuevo.id);
  return { ok: true, usuario: nuevo };
}

export function recordarClave(
  nombre: string,
  correo: string,
  nuevaClave: string
): Resultado {
  const usuarios = listaUsuarios();
  const u = usuarios.find(
    (x) =>
      x.usuario.toLowerCase() === nombre.trim().toLowerCase() &&
      x.correo.toLowerCase() === correo.trim().toLowerCase()
  );
  if (!u) {
    return {
      ok: false,
      error: "No encontramos una cuenta con ese usuario y ese correo juntos.",
    };
  }
  u.pass = nuevaClave;
  guardarUsuarios(usuarios);
  escribir(K_SESION, u.id);
  return { ok: true, usuario: u };
}

export function usuarioDeSesion(): Usuario | null {
  const id = leer<string | null>(K_SESION, null);
  if (!id) return null;
  return listaUsuarios().find((u) => u.id === id) ?? null;
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(K_SESION);
  } catch {
    /* se ignora */
  }
}

/* ---------- Recetas aprendidas por usuario ---------- */

export function aprendidasDeUsuario(idUsuario: string): string[] {
  return leer<string[]>(claveAprendidas(idUsuario), []);
}

/** Marca o desmarca una receta. Devuelve true si quedó como aprendida. */
export function alternarAprendida(idUsuario: string, recetaId: string): boolean {
  const actual = aprendidasDeUsuario(idUsuario);
  const estaba = actual.includes(recetaId);
  escribir(
    claveAprendidas(idUsuario),
    estaba ? actual.filter((r) => r !== recetaId) : [...actual, recetaId]
  );
  return !estaba;
}

/* ---------- Recetas agregadas por el administrador ---------- */

export function recetasExtra(): Receta[] {
  return leer<Receta[]>(K_EXTRA, []);
}

export function agregarRecetaExtra(receta: Receta) {
  escribir(K_EXTRA, [...recetasExtra(), receta]);
}

export function todasLasRecetas(): Receta[] {
  return [...RECETAS, ...recetasExtra()];
}

/* ---------- Niveles de cocina ---------- */

export interface Nivel {
  min: number;
  nombre: string;
}

export const NIVELES: Nivel[] = [
  { min: 0, nombre: "Curioso del sabor" },
  { min: 1, nombre: "Aprendiz" },
  { min: 3, nombre: "Pinche entusiasta" },
  { min: 5, nombre: "Cocinero de casa" },
  { min: 7, nombre: "Sazón de barrio" },
  { min: 9, nombre: "Maestro del sabor" },
];

export function nivelPara(cantidad: number) {
  let indice = 0;
  NIVELES.forEach((n, i) => {
    if (cantidad >= n.min) indice = i;
  });
  const actual = NIVELES[indice];
  const siguiente = NIVELES[indice + 1] ?? null;
  const progreso = siguiente
    ? Math.min(
        100,
        Math.round(((cantidad - actual.min) / (siguiente.min - actual.min)) * 100)
      )
    : 100;
  return { indice, actual, siguiente, progreso };
}

/** Acepta un enlace completo de YouTube o un ID suelto, y devuelve el ID. */
export function extraerIdYouTube(valor: string): string {
  const limpio = valor.trim();
  const coincidencia = limpio.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  return coincidencia ? coincidencia[1] : limpio;
}
