import { RECETAS, type Receta, type RecetaMundo } from "../data";

export interface Usuario {
  id: string;
  correo: string;
  usuario: string;
  pass: string;
  esAdmin: boolean;
  creadoEn: string;
}

const K_USUARIOS = "cp_usuarios";
const K_SESION = "cp_sesion";
const K_EXTRA = "cp_recetas_extra";
const K_NIVELES = "cp_niveles_basica";
const K_CHEFS = "cp_chefs";
const K_CONSEJOS = "cp_consejos";
const claveAprendidas = (idUsuario: string) => `cp_aprendidas_${idUsuario}`;

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

/* ---------- Cuentas de demostración ----------
   admin  / admin123  → puede agregar recetas, niveles, cocineros y consejos
   casual / casual123 → usuario casual: solo puede ver y marcar recetas        */
export const CUENTAS_DEMO: Usuario[] = [
  {
    id: "admin",
    correo: "admin@cocinapulguita.pe",
    usuario: "admin",
    pass: "admin123",
    esAdmin: true,
    creadoEn: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "casual",
    correo: "casual@cocinapulguita.pe",
    usuario: "casual",
    pass: "casual123",
    esAdmin: false,
    creadoEn: "2026-01-01T00:00:00.000Z",
  },
];

const esNombreDemo = (nombre: string) =>
  CUENTAS_DEMO.some((d) => d.usuario === nombre.trim().toLowerCase());

const buscarPorId = (id: string): Usuario | null =>
  CUENTAS_DEMO.find((d) => d.id === id) ??
  listaUsuarios().find((u) => u.id === id) ??
  null;

export function listaUsuarios(): Usuario[] {
  return leer<Usuario[]>(K_USUARIOS, []);
}

function guardarUsuarios(usuarios: Usuario[]) {
  escribir(K_USUARIOS, usuarios);
}

export type Resultado =
  | { ok: true; usuario: Usuario }
  | { ok: false; error: string };

export function iniciarSesion(nombre: string, clave: string): Resultado {
  const n = nombre.trim().toLowerCase();
  const demo = CUENTAS_DEMO.find((d) => d.usuario === n);
  if (demo) {
    if (demo.pass !== clave) {
      return {
        ok: false,
        error: `Contraseña incorrecta para la cuenta "${demo.usuario}".`,
      };
    }
    escribir(K_SESION, demo.id);
    return { ok: true, usuario: demo };
  }
  const u = listaUsuarios().find((x) => x.usuario.toLowerCase() === n);
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
  if (esNombreDemo(nombre)) {
    return {
      ok: false,
      error: "Ese nombre de usuario está reservado. Elige otro, por favor.",
    };
  }
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
  if (esNombreDemo(nombre)) {
    return {
      ok: false,
      error:
        "Las cuentas de demostración (admin y casual) no cambian de contraseña.",
    };
  }
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
  return buscarPorId(id);
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

/* ---------- Cocina Básica: niveles publicados por el administrador ---------- */

export interface NivelBasica {
  id: string;
  titulo: string;
  resumen: string;
  tiempo: string;
  puntos: string[];
  imagen?: string;
  video?: string;
}

export const MAX_NIVELES = 8;

export function getNivelesBasica(): NivelBasica[] {
  return leer<NivelBasica[]>(K_NIVELES, []);
}

export function addNivelBasica(nivel: NivelBasica): { ok: boolean; error?: string } {
  const actual = getNivelesBasica();
  if (actual.length >= MAX_NIVELES) {
    return { ok: false, error: "Ya se publicaron los 8 niveles disponibles." };
  }
  escribir(K_NIVELES, [...actual, nivel]);
  return { ok: true };
}

export function eliminarNivelBasica(id: string) {
  escribir(
    K_NIVELES,
    getNivelesBasica().filter((n) => n.id !== id)
  );
}

/* ---------- Cocina Básica: niveles completados por usuario ---------- */

const claveCompletos = (idUsuario: string) => `cp_nivel_completo_${idUsuario}`;

export function completosDeUsuario(idUsuario: string): string[] {
  return leer<string[]>(claveCompletos(idUsuario), []);
}

/** Marca o desmarca un nivel como completado. Devuelve true si quedó completado. */
export function alternarNivelCompletado(idUsuario: string, nivelId: string): boolean {
  const actual = completosDeUsuario(idUsuario);
  const estaba = actual.includes(nivelId);
  escribir(
    claveCompletos(idUsuario),
    estaba ? actual.filter((n) => n !== nivelId) : [...actual, nivelId]
  );
  return !estaba;
}

/* ---------- Recetas internacionales agregadas por el administrador ---------- */

const K_INTL = "cp_internacional_extra";

export function recetasInternacionalExtra(): RecetaMundo[] {
  return leer<RecetaMundo[]>(K_INTL, []);
}

export function agregarRecetaInternacional(receta: RecetaMundo) {
  escribir(K_INTL, [...recetasInternacionalExtra(), receta]);
}

/* ---------- Cocina Básica: cocineros famosos ---------- */

export interface Chef {
  id: string;
  nombre: string;
  titulo: string;
  bio: string;
  logros: string[];
  platos: string[];
  enlace: string;
}

export const CHEFS_INICIALES: Chef[] = [
  {
    id: "chef-acurio",
    nombre: "Gastón Acurio",
    titulo: "El embajador de la cocina peruana",
    bio: "Lima, 1967. Dejó los estudios de Derecho para formarse en Le Cordon Bleu de París y en 1994 abrió Astrid & Gastón. Convirtió el cebiche, el lomo saltado y la causa en alta cocina y llevó los restaurantes peruanos a más de una decena de países.",
    logros: [
      "Fundó la escuela de cocina de Pachacútec para jóvenes de escasos recursos",
      "Impulsó Mistura, la feria gastronómica más grande de América Latina",
      "Autor de más de diez libros de cocina peruana",
    ],
    platos: ["Cebiche carretillero", "Lomo saltado de autor", "Causa limeña"],
    enlace: "https://es.wikipedia.org/wiki/Gast%C3%B3n_Acurio",
  },
  {
    id: "chef-virgilio",
    nombre: "Virgilio Martínez",
    titulo: "Central, el mejor restaurante del mundo",
    bio: "Lima, 1977. Se formó en Londres, París y Nueva York. Con su restaurante Central propone recorrer los ecosistemas del Perú por altitudes: del fondo del mar a los 4.000 metros, junto al proyecto de investigación Mater Iniciativa.",
    logros: [
      "Número 1 de The World's 50 Best Restaurants en 2023",
      "Mejor restaurante de América Latina en varios rankings",
      "Investigador de más de 200 ingredientes nativos peruanos",
    ],
    platos: ["Menú por altitudes Mundo Mater", "Pulpo a las brasas", "Papa nativa con huacatay"],
    enlace: "https://es.wikipedia.org/wiki/Virgilio_Mart%C3%ADnez",
  },
  {
    id: "chef-pia",
    nombre: "Pía León",
    titulo: "La chef que pinta platos con ingredientes nativos",
    bio: "Lima, 1986. Fue jefa de cocina de Central y en 2018 abrió Kjolle —nombre de una flor nativa—, con un menú que cambia según el color y la biodiversidad de los ingredientes que llegan cada semana del campo y del mar.",
    logros: [
      "Mejor Chef Femenina del Mundo 2021 (The World's 50 Best)",
      "Kjolle en el top 10 de Latin America's 50 Best",
      "Referente mundial de cocina basada en biodiversidad",
    ],
    platos: ["Pulpo con huacatay", "Pato con cushuro", "Postres de aguaymanto"],
    enlace: "https://es.wikipedia.org/wiki/P%C3%ADa_Le%C3%B3n",
  },
  {
    id: "chef-micha",
    nombre: "Mitsuharu Tsumura",
    titulo: "“Micha”, el maestro de la cocina nikkei",
    bio: "Lima, 1981, descendiente de japoneses. Estudió en Osaka y pasó por las cocinas de Astrid & Gastón. Con Maido unió la despensa peruana y la técnica japonesa hasta convertir la nikkei en uno de los movimientos gastronómicos más admirados del planeta.",
    logros: [
      "Maido, número 1 de Latin America's 50 Best en cinco ocasiones",
      "Maido entre los 5 mejores restaurantes del mundo",
      "Embajador mundial de la cocina nikkei",
    ],
    platos: ["Sushi nikkei", "Costilla de 50 horas", "Tiradito al rocoto"],
    enlace: "https://es.wikipedia.org/wiki/Mitsuharu_Tsumura",
  },
  {
    id: "chef-schiaffino",
    nombre: "Pedro Miguel Schiaffino",
    titulo: "El chef que puso la Amazonía en la mesa",
    bio: "Lima, 1975. Se formó en Italia y en Estados Unidos. Con sus restaurantes Malabar y Ámaz llevó ingredientes amazónicos como el paiche, el camu camu y la cecina a la alta cocina, trabajando de la mano con comunidades nativas.",
    logros: [
      "Pionero de la cocina amazónica sostenible en Latinoamérica",
      "Presencia constante en Latin America's 50 Best",
      "Alianzas de comercio justo con productores de la selva",
    ],
    platos: ["Paiche al camu camu", "Cecina amazónica", "Chocolate con copoazú"],
    enlace: "https://es.wikipedia.org/wiki/Pedro_Miguel_Schiaffino",
  },
];

export function getChefs(): Chef[] {
  try {
    const bruto = localStorage.getItem(K_CHEFS);
    if (bruto) return JSON.parse(bruto) as Chef[];
  } catch {
    /* datos dañados: se resiembra */
  }
  escribir(K_CHEFS, CHEFS_INICIALES);
  return CHEFS_INICIALES;
}

export function addChef(chef: Chef) {
  escribir(K_CHEFS, [...getChefs(), chef]);
}

export function eliminarChef(id: string) {
  escribir(
    K_CHEFS,
    getChefs().filter((c) => c.id !== id)
  );
}

/* ---------- Cocina Básica: consejos de utensilios ---------- */

export interface ConsejoUtensilio {
  id: string;
  titulo: string;
  texto: string;
}

export function getConsejos(): ConsejoUtensilio[] {
  return leer<ConsejoUtensilio[]>(K_CONSEJOS, []);
}

export function addConsejo(consejo: ConsejoUtensilio) {
  escribir(K_CONSEJOS, [...getConsejos(), consejo]);
}

export function eliminarConsejo(id: string) {
  escribir(
    K_CONSEJOS,
    getConsejos().filter((c) => c.id !== id)
  );
}

/* ---------- Niveles de experiencia (suben con recetas aprendidas) ---------- */

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
