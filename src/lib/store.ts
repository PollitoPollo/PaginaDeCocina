import { RECETAS, TOP10_BASE, type PlatoTop, type Receta, type RecetaMundo } from "../data";

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

/* ---------- Cuentas de la casa ----------
   jefe     / cocina2026 → administración: publica recetas, niveles, cocineros y términos
   invitado / sabor2026  → usuario casual: solo ve, marca recetas y completa niveles   */
export const CUENTAS_DEMO: Usuario[] = [
  {
    id: "admin",
    correo: "jefe@cocinapulguita.pe",
    usuario: "jefe",
    pass: "cocina2026",
    esAdmin: true,
    creadoEn: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "casual",
    correo: "invitado@cocinapulguita.pe",
    usuario: "invitado",
    pass: "sabor2026",
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
        "Las cuentas oficiales de la casa no cambian de contraseña por esta vía.",
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
  foto?: string;
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

/** Agrega un cocinero nuevo o, si ya existe su id, actualiza sus datos (editar). */
export function addChef(chef: Chef) {
  const chefs = getChefs();
  const existe = chefs.some((c) => c.id === chef.id);
  escribir(
    K_CHEFS,
    existe ? chefs.map((c) => (c.id === chef.id ? chef : c)) : [...chefs, chef]
  );
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

/* ---------- Calificaciones con estrellas (1 a 5) ---------- */

const claveCalif = (idUsuario: string) => `cp_calif_${idUsuario}`;

export function calificacionesDeUsuario(idUsuario: string): Record<string, number> {
  return leer<Record<string, number>>(claveCalif(idUsuario), {});
}

export function calificar(idUsuario: string, recetaId: string, estrellas: number) {
  const mapa = calificacionesDeUsuario(idUsuario);
  mapa[recetaId] = Math.min(5, Math.max(1, Math.round(estrellas)));
  escribir(claveCalif(idUsuario), mapa);
}

/* ---------- Top 10 · La gala del sabor 2025 ---------- */

const K_TOP10 = "cp_top10";

export function getTop10(): PlatoTop[] {
  const guardado = leer<PlatoTop[] | null>(K_TOP10, null);
  return guardado && Array.isArray(guardado) && guardado.length > 0
    ? guardado
    : TOP10_BASE;
}

/** Reemplaza los datos de un plato del Top 10 (solo el administrador). */
export function editarPlatoTop(id: string, datos: PlatoTop) {
  escribir(
    K_TOP10,
    getTop10().map((p) => (p.id === id ? { ...datos, id } : p))
  );
}

/* ---------- Donaciones ---------- */

export interface Donaciones {
  titulo: string;
  mensaje: string;
  qr: string;
  alias: string;
}

const DONACIONES_DEF: Donaciones = {
  titulo: "¡Gracias por mantener viva esta cocina!",
  mensaje:
    "Cocina Pulguita es un proyecto hecho con cariño para que las recetas del Perú y del mundo lleguen gratis a todas las mesas, para jóvenes y para abuelos. Tu aporte, grande o pequeño, se convierte en más videos, más recetas probadas y más escuela abierta. Cada donación es un plato más para todos. ¡Mil gracias por ser parte de esta familia!",
  qr: "",
  alias: "",
};

const K_DONACIONES = "cp_donaciones";

export function getDonaciones(): Donaciones {
  const d = leer<Partial<Donaciones> | null>(K_DONACIONES, null);
  return d ? { ...DONACIONES_DEF, ...d } : DONACIONES_DEF;
}

export function guardarDonaciones(d: Donaciones) {
  escribir(K_DONACIONES, d);
}

/* ---------- Redes sociales del creador ---------- */

export const REDES_SOCIALES = [
  { nombre: "Facebook", url: "https://www.facebook.com/juan.carlos.romero.castro.2025" },
  { nombre: "YouTube", url: "https://www.youtube.com/@lobovideosES" },
];

export function abrirRedes() {
  REDES_SOCIALES.forEach((red) => window.open(red.url, "_blank", "noopener"));
}

/* ---------- Términos y Condiciones ---------- */

export interface Terminos {
  texto: string;
  actualizado: string;
}

const TERMINOS_DEF: Terminos = {
  texto: `1. Sobre Cocina Pulguita
Cocina Pulguita es una página educativa y sin fines de lucro, creada para compartir recetas, videos y consejos de cocina peruana e internacional, pensada para personas de todas las edades: desde jóvenes que empiezan hasta abuelos con toda una vida de sazón.

2. Cuentas de usuario
Para marcar recetas como aprendidas, completar niveles de cocina básica y calificar platos necesitas una cuenta. Tu contraseña es personal y no debes compartirla con nadie. Las cuentas de administración son de uso exclusivo del equipo de la página.

3. Recetas y contenido
Las recetas, consejos y guías se publican con la mejor intención, pero cada cocina y cada cuerpo son distintos. Revisa siempre los ingredientes si tienes alergias o condiciones de salud, y si eres menor de edad, cocina con la supervisión de un adulto.

4. Videos y enlaces externos
Los videos pertenecen a sus creadores en YouTube y los enlaces recomendados abren páginas de terceros. Cocina Pulguita no se hace responsable por el contenido de esos sitios.

5. Donaciones
Los aportes en la sección de Donaciones son totalmente voluntarios y se destinan a mantener la página viva: más recetas probadas, más videos y más escuela gratuita para todos.

6. Convivencia
Esta es una mesa para todos y todas: se pide respeto en todo momento. El equipo de administración puede editar los contenidos de la página para mantenerla actualizada y mejorarla.

7. Cambios en estos términos
Estos términos pueden actualizarse cuando sea necesario. La fecha de la última actualización siempre aparecerá en la parte superior de este documento.`,
  actualizado: "1 de enero de 2026",
};

const K_TERMINOS = "cp_terminos";

export function getTerminos(): Terminos {
  const t = leer<Partial<Terminos> | null>(K_TERMINOS, null);
  return t && t.texto ? { ...TERMINOS_DEF, ...t } : TERMINOS_DEF;
}

/** Actualiza los términos (solo lo usa la cuenta de administrador). */
export function guardarTerminos(texto: string) {
  const fecha = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  escribir(K_TERMINOS, { texto: texto.trim(), actualizado: fecha });
}
