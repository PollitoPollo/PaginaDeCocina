export interface Receta {
  id: string;
  nombre: string;
  categoria: "Entradas" | "De fondo" | "Postres" | "Bebidas";
  region: string;
  tiempo: string;
  dificultad: "Fácil" | "Media" | "Exigente";
  porciones: number;
  imagen: string;
  descripcion: string;
  ingredientes: string[];
  pasos: string[];
  tip: string;
  video?: string;
  propia?: boolean;
  pais?: string;
}

export const IMAGENES = {
  ceviche:
    "https://image.qwenlm.ai/generated-images/39e9c0f0-9057-4886-b055-0b291677cc83/_result.png",
  lomo: "https://image.qwenlm.ai/generated-images/e197fdf8-2866-46ba-99df-0ba3c6fdb0cf/_result.png",
  aji: "https://image.qwenlm.ai/generated-images/61b0fd2c-eb99-46a2-9ede-198ba2a15cd3/_result.png",
  causa:
    "https://image.qwenlm.ai/generated-images/066ddb1c-36cb-4da4-b415-5aa5958e9514/_result.png",
  anticuchos:
    "https://image.qwenlm.ai/generated-images/bc5fff92-3262-4503-a6c2-acdbd8400899/_result.png",
  chicha:
    "https://image.qwenlm.ai/generated-images/0407a688-64bc-4788-924a-0cddb4da1a39/_result.png",
  picarones:
    "https://image.qwenlm.ai/generated-images/8b2293b2-6367-4061-b409-5ab72532e206/_result.png",
};

export const RECETAS: Receta[] = [
  {
    id: "ceviche",
    nombre: "Ceviche Clásico de Lima",
    categoria: "Entradas",
    region: "Costa",
    tiempo: "30 min",
    dificultad: "Fácil",
    porciones: 4,
    imagen: IMAGENES.ceviche,
    descripcion:
      "Pescado fresco cocido en jugo de limón con cebolla morada y ají limo. El plato más famoso del Perú y Patrimonio de la Humanidad.",
    ingredientes: [
      "600 g de filete de corvina o lenguado fresco",
      "12 limones jugosos",
      "1 cebolla morada grande en pluma",
      "1 ají limo picado sin semillas",
      "1 diente de ajo finamente picado",
      "1 ramita de culantro picado",
      "1 camote sancochado en rodajas",
      "1 choclo sancochado en rodajas",
      "Sal y pimienta al gusto",
      "Hojas de lechuga para emplatar",
    ],
    pasos: [
      "Corta el pescado en cubos de 2 cm. Revisa que no tenga espinas.",
      "Colócalo en un bol de vidrio y sazónalo con sal. Déjalo reposar 5 minutos.",
      "Añade el ajo picado y el ají limo. Mezcla con suavidad.",
      "Exprime los limones directamente sobre el bol, sin apretarlos demasiado para que no amarguen.",
      "Remueve y deja que el pescado se “cocine” en el jugo solo de 5 a 8 minutos.",
      "Incorpora la cebolla, el culantro y una pizca de pimienta. Prueba y ajusta la sal.",
      "Sirve de inmediato con camote, choclo y la lechuga.",
    ],
    tip: "El ceviche no se deja horas en limón: con 8 minutos basta. Si reposa demasiado, el pescado se pone duro.",
  },
  {
    id: "lomo",
    nombre: "Lomo Saltado",
    categoria: "De fondo",
    region: "Cocina chifa",
    tiempo: "40 min",
    dificultad: "Media",
    porciones: 4,
    imagen: IMAGENES.lomo,
    descripcion:
      "Tiras de res salteadas al fuego con cebolla, tomate, sillao y vinagre. El encuentro del Perú y la China en un solo plato.",
    ingredientes: [
      "600 g de lomo de res en tiras gruesas",
      "2 cebollas moradas en gajos gruesos",
      "2 tomates en gajos",
      "2 ajíes amarillos en tiras",
      "3 cucharadas de sillao (salsa de soya)",
      "2 cucharadas de vinagre tinto",
      "1 ramita de culantro picado",
      "2 dientes de ajo picados",
      "4 papas blancas para freír",
      "2 tazas de arroz blanco cocido",
      "Aceite, sal, pimienta y comino",
    ],
    pasos: [
      "Sazona las tiras de res con sal, pimienta y comino.",
      "Fríe las papas en bastones hasta dorarlas y mantenlas calientes.",
      "En un wok o sartén muy caliente con aceite, sella la carne 2 minutos. Retírala.",
      "En el mismo sartén saltea el ajo, la cebolla, el ají amarillo y el tomate por 2 minutos.",
      "Regresa la carne, añade el sillao y el vinagre, y saltea a fuego fuerte 1 minuto más.",
      "Apaga el fuego, agrega el culantro y mezcla con cariño.",
      "Sirve al momento con las papas fritas y el arroz blanco.",
    ],
    tip: "El secreto es el fuego: sartén bien humeante y todo picado antes de empezar. El saltado no se hierve, se besa con la llama.",
  },
  {
    id: "aji-gallina",
    nombre: "Ají de Gallina",
    categoria: "De fondo",
    region: "Criollo",
    tiempo: "50 min",
    dificultad: "Media",
    porciones: 6,
    imagen: IMAGENES.aji,
    descripcion:
      "Un guiso cremoso de gallina con ají amarillo, pan y nueces. Cocina de abrazo que perfuma la casa desde la época virreinal.",
    ingredientes: [
      "1 pechuga de gallina o pollo (700 g aprox.)",
      "5 cucharadas de pasta de ají amarillo",
      "4 rebanadas de pan remojadas",
      "1 taza de leche evaporada",
      "½ taza de nueces molidas",
      "2 dientes de ajo picados",
      "1 cebolla morada picada en cuadritos",
      "3 papas sancochadas en rodajas",
      "2 huevos duros",
      "Aceitunas negras",
      "Aceite, sal y pimienta",
    ],
    pasos: [
      "Cocina la gallina en agua con sal y una rama de apio. Reserva el caldo.",
      "Desmenuza la carne en tiras finas y resérvala.",
      "Sofríe la cebolla y el ajo hasta que estén transparentes. Añade la pasta de ají amarillo y cocina 5 minutos.",
      "Licúa el pan con la leche y un cucharón de caldo, y viértelo al sartén.",
      "Remueve a fuego bajo hasta que espese como una crema suave.",
      "Incorpora las nueces, la gallina, sal y pimienta. Cocina 5 minutos más.",
      "Sirve sobre las papas, con huevo duro, aceitunas y arroz graneado.",
    ],
    tip: "Si espesa demasiado, aligéralo con un chorrito del caldo de la gallina. Debe quedar cremoso, como un abrazo.",
  },
  {
    id: "causa",
    nombre: "Causa Limeña",
    categoria: "Entradas",
    region: "Lima",
    tiempo: "45 min",
    dificultad: "Media",
    porciones: 6,
    imagen: IMAGENES.causa,
    descripcion:
      "Capas de papa amarilla sazonada con ají y limón, rellenas de palta y pollo. Se sirve fría, elegante y perfecta para reuniones.",
    ingredientes: [
      "1 kg de papa amarilla sancochada",
      "4 cucharadas de pasta de ají amarillo",
      "Jugo de 3 limones",
      "3 cucharadas de aceite",
      "1 palta en láminas",
      "300 g de pollo deshilachado (o atún)",
      "3 cucharadas de mayonesa",
      "Huevo duro y aceitunas para decorar",
      "Sal y pimienta blanca",
    ],
    pasos: [
      "Prensa la papa aún caliente hasta que no queden grumos.",
      "Sazónala con el ají amarillo, el jugo de limón, el aceite, sal y pimienta. Amasa hasta integrar.",
      "Mezcla el pollo deshilachado con la mayonesa.",
      "Divide la masa de papa en dos o tres porciones iguales.",
      "En un molde, arma capas: papa, palta, pollo y papa otra vez.",
      "Refrigera 30 minutos para que tome cuerpo y desmolda con cuidado.",
      "Decora con huevo, aceitunas y un hilito de mayonesa.",
    ],
    tip: "La papa se prensa caliente, pero la causa se sirve fría. La media hora de refrigerador es la que le da la forma perfecta.",
  },
  {
    id: "anticuchos",
    nombre: "Anticuchos de Corazón",
    categoria: "Entradas",
    region: "Cocina de calle",
    tiempo: "1 h + macerado",
    dificultad: "Media",
    porciones: 4,
    imagen: IMAGENES.anticuchos,
    descripcion:
      "Brochetas de corazón de res marinadas en ají panca y doradas a la parrilla. Las reinas de la noche limeña desde el siglo XIX.",
    ingredientes: [
      "1 kg de corazón de res limpio, en cubos",
      "½ taza de pasta de ají panca",
      "¼ de taza de vinagre tinto",
      "1 cucharada de comino molido",
      "4 dientes de ajo molidos",
      "2 cucharadas de sillao",
      "Sal y pimienta al gusto",
      "Brochetas (palitos) de madera",
      "Papas doradas y choclo para acompañar",
      "Crema de rocoto (opcional)",
    ],
    pasos: [
      "Limpia el corazón retirando grasa y venas. Córtalo en cubos de 3 cm.",
      "Mezcla el ají panca, el vinagre, el ajo, el comino, el sillao, sal y pimienta.",
      "Macera la carne en el refrigerador al menos 4 horas (mejor de un día para otro).",
      "Ensarta los cubos en las brochetas, de 4 en 4.",
      "Gríllalos a fuego fuerte, pintándolos con el aderezo, 3 minutos por lado.",
      "Sirve con papas doradas, choclo y una buena crema de rocoto.",
    ],
    tip: "No los sobrecocines: el anticucho perfecto está dorado por fuera y jugoso por dentro. La parrilla bien caliente hace la mitad del trabajo.",
  },
  {
    id: "picarones",
    nombre: "Picarones con Miel de Higo",
    categoria: "Postres",
    region: "Lima",
    tiempo: "1 h",
    dificultad: "Exigente",
    porciones: 6,
    imagen: IMAGENES.picarones,
    descripcion:
      "Aros fritos de zapallo y camote bañados en miel de higo. El postre de las procesiones, las plazas y las tardes de lluvia.",
    ingredientes: [
      "500 g de zapallo macre",
      "500 g de camote",
      "500 g de harina de trigo",
      "1 cucharada de levadura seca",
      "1 cucharada de anís en grano",
      "1 huevo",
      "Aceite en abundancia para freír",
      "8 higos para la miel",
      "1 bloque de chancaca (panela)",
      "1 rama de canela y 3 clavos de olor",
      "Cáscara de naranja",
    ],
    pasos: [
      "Cocina el zapallo y el camote. Hazlos puré por separado y deja entibiar.",
      "Mezcla la harina con la levadura, el anís, el huevo y ambos purés.",
      "Amasa y deja reposar 30 minutos tapada con un paño limpio.",
      "Para la miel: hierve los higos, la chancaca, la canela, el clavo y la cáscara con un poco de agua hasta lograr un almíbar ligero.",
      "Toma porciones de masa con la mano humedecida y dales forma de aro.",
      "Fríelos en aceite bien caliente hasta dorarlos de ambos lados.",
      "Escúrrelos y báñalos con la miel de higo caliente.",
    ],
    tip: "La masa debe quedar blanda y pegajosa: así es como debe ser. Con las manos mojadas y un poco de valentía salen aros hermosos.",
  },
  {
    id: "chicha",
    nombre: "Chicha Morada",
    categoria: "Bebidas",
    region: "Todo el Perú",
    tiempo: "50 min",
    dificultad: "Fácil",
    porciones: 8,
    imagen: IMAGENES.chicha,
    descripcion:
      "Maíz morado hervido con piña, membrillo, canela y clavo. La bebida morada que refresca todas las mesas del país.",
    ingredientes: [
      "2 mazorcas de maíz morado con sus pancas",
      "1 piña (usa las cáscaras y un poco de pulpa)",
      "1 membrillo en cuartos",
      "2 ramas de canela",
      "6 clavos de olor",
      "150 g de azúcar (o al gusto)",
      "Jugo de 2 limones",
      "3 litros de agua",
      "Hielo para servir",
    ],
    pasos: [
      "Lava bien el maíz morado, sin retirar las pancas (hojas) moradas.",
      "En una olla grande, pon a hervir el maíz, las cáscaras de piña, el membrillo, la canela y el clavo en los 3 litros de agua.",
      "Baja el fuego y cocina 40 minutos, hasta que el maíz haya soltado todo su color.",
      "Cuela el líquido, añade el azúcar y remueve hasta disolverla.",
      "Deja enfriar y refrigera al menos 2 horas.",
      "Sirve con hielo, un chorrito de limón y piña picada en cuadritos.",
    ],
    tip: "El chorrito de limón al final despierta el sabor y vuelve el morado mucho más brillante. Pruébalo y verás la diferencia.",
  },
];

/* ---------------- Blog ---------------- */

export interface BloqueBlog {
  tipo: "p" | "h2" | "quote";
  texto: string;
}

export interface Post {
  id: string;
  titulo: string;
  categoria: string;
  color: string;
  fecha: string;
  lectura: string;
  autor: string;
  imagen: string;
  resumen: string;
  contenido: BloqueBlog[];
}

export const POSTS: Post[] = [
  {
    id: "chicha-morada",
    titulo: "Chicha morada: el tesoro morado de los Andes",
    categoria: "Historia",
    color: "bg-uva text-crema",
    fecha: "18 de enero de 2026",
    lectura: "6 min de lectura",
    autor: "Rosa Quispe",
    imagen: IMAGENES.chicha,
    resumen:
      "Nació de un maíz que solo crece en el Perú y pasó de bebida ceremonial inca al refresco más querido del país. Esta es su historia.",
    contenido: [
      {
        tipo: "p",
        texto:
          "En los valles interandinos, a más de dos mil metros de altura, crece un maíz que casi no existe en ninguna otra parte del mundo: el maíz morado. Su color violeta profundo, casi azul cuando cae la tarde, se debe a las antocianinas, el mismo pigmento de los arándanos. De esos granos nace, desde hace siglos, la bebida más democrática del Perú: la chicha morada.",
      },
      {
        tipo: "p",
        texto:
          "Antes de la llegada de los españoles, las chichas ya protagonizaban rituales y fiestas de cosecha, sobre todo en su versión fermentada de maíz de jora. La variante morada, dulce y sin alcohol, se popularizó en las ciudades durante el siglo XX: se vendía en enormes jarras de vidrio en los mercados y acompañaba cualquier almuerzo criollo que se respetara.",
      },
      { tipo: "h2", texto: "Una receta con pocos secretos y mucha paciencia" },
      {
        tipo: "p",
        texto:
          "La base es maíz morado hervido con cáscaras de piña, membrillo, canela y clavo de olor. Después de unos cuarenta minutos a fuego lento, el agua se vuelve púrpura y la casa huele a fiesta. Entonces se cuela, se endulza y se enfría bien. El chorrito de limón al servir la convierte en otra bebida: más viva, más brillante.",
      },
      {
        tipo: "quote",
        texto:
          "Una jarra de chicha morada bien fría sobre la mesa es la señal más clara de que en esa casa se sabe recibir.",
      },
      {
        tipo: "p",
        texto:
          "En los últimos años el Perú ha reconocido al maíz morado como producto bandera, y la ciencia estudia con interés sus propiedades antioxidantes. El tesoro morado, parece, todavía tiene mucho por dar: cada vaso es un sorbo de historia andina servido con hielo y limón.",
      },
    ],
  },
  {
    id: "aji-amarillo",
    titulo: "Ají amarillo: el alma dorada de la cocina criolla",
    categoria: "Ingredientes",
    color: "bg-aji text-tinta",
    fecha: "2 de febrero de 2026",
    lectura: "5 min de lectura",
    autor: "Chef Martín Delgado",
    imagen: IMAGENES.aji,
    resumen:
      "Sin ají amarillo no hay cocina criolla. Este ají naranja pone color, aroma y un picante amable en los platos más famosos del país.",
    contenido: [
      {
        tipo: "p",
        texto:
          "Si la cocina tuviera bandera, una de sus franjas sería naranja. El ají amarillo (Capsicum baccatum) se cultiva en el Perú desde hace más de cuatro mil años y es el ají más sembrado del país. Su picor es amable: calienta sin quemar, acompaña sin imponerse y deja hablar a los demás sabores.",
      },
      {
        tipo: "p",
        texto:
          "Su papel va mucho más allá del picante. En el ají de gallina aporta cuerpo y color; en la causa limeña sazona la papa; en el ceviche baila junto al ají limo; y en la salsa huancaína es el protagonista absoluto. Casi no existe receta criolla que no pida, al menos, una cucharada.",
      },
      { tipo: "h2", texto: "La reina del mercado" },
      {
        tipo: "p",
        texto:
          "En todo mercado peruano hay un puesto donde el ají amarillo brilla en montañas doradas. Se consigue fresco, en pasta, seco —entonces se llama ají mirasol— o congelado. Los cocineros recomiendan sofreír la pasta a fuego lento hasta que pierda el crudo: es el momento exacto en que suelta todo su perfume.",
      },
      {
        tipo: "quote",
        texto:
          "Quien aprende a domar el ají amarillo ya cruzó el primer puente hacia la cocina peruana.",
      },
      {
        tipo: "p",
        texto:
          "Para los que se inician, un truco de abuela: si quieres el sabor pero temes el picor, retira las semillas y las venas antes de cocinarlo. El ají perdona, pero no olvida; y una buena huancaína merece respeto.",
      },
    ],
  },
  {
    id: "ceviche-unesco",
    titulo: "Ceviche: por qué la UNESCO lo declaró Patrimonio de la Humanidad",
    categoria: "Cultura",
    color: "bg-rojo text-crema",
    fecha: "20 de febrero de 2026",
    lectura: "7 min de lectura",
    autor: "Valeria Torres",
    imagen: IMAGENES.ceviche,
    resumen:
      "En diciembre de 2023, la UNESCO reconoció la preparación y el consumo del ceviche peruano. Pero el premio celebra mucho más que una receta.",
    contenido: [
      {
        tipo: "p",
        texto:
          "El 6 de diciembre de 2023, la UNESCO inscribió “la práctica y los sentidos de la preparación y el consumo del ceviche” en la lista del Patrimonio Cultural Inmaterial de la Humanidad. El fallo no premió un plato, sino una cadena viva: el pescador artesanal, la vendedora del mercado, el cocinero cebichero y la familia que se reúne alrededor del plato al mediodía.",
      },
      {
        tipo: "p",
        texto:
          "El ceviche tiene raíces prehispánicas. Mucho antes de que el limón llegara con los españoles, los pueblos de la costa ya marinaban pescado fresco en jugo de tumbo y chicha fermentada. Con los siglos se sumaron la cebolla, el ají limo y el limón, hasta darle la forma que hoy une al país entero, del malecón al pueblo más alto de la sierra.",
      },
      { tipo: "h2", texto: "Un ritual con hora propia" },
      {
        tipo: "p",
        texto:
          "Las cebicherías tienen reglas no escritas: se almuerza temprano, siempre fresco y, si es posible, mirando al mar. “El ceviche se hace con el pescado del día o no se hace”, repiten los maestros cebicheros. Y la leche de tigre, ese jugo cítrico que queda en el plato, se bebe casi como un brindis: es el gusto por la vida hecho caldo.",
      },
      {
        tipo: "quote",
        texto:
          "El ceviche no se come solamente: se comparte, se celebra y se enseña de mano en mano.",
      },
      {
        tipo: "p",
        texto:
          "El reconocimiento también trae tareas: proteger la pesca artesanal, cuidar el mar y transmitir el oficio a las nuevas generaciones. Porque un patrimonio inmaterial solo está vivo mientras la gente lo sigue practicando, plato tras plato, limón tras limón.",
      },
    ],
  },
  {
    id: "revolucion-lima",
    titulo: "Del huarike a la alta cocina: la revolución gastronómica de Lima",
    categoria: "Crónica",
    color: "bg-uva-2 text-crema",
    fecha: "8 de marzo de 2026",
    lectura: "8 min de lectura",
    autor: "Jorge Huanca",
    imagen: IMAGENES.lomo,
    resumen:
      "En veinticinco años, Lima pasó de esconder sus cocinas populares a ser capital gastronómica mundial. Esta es la historia de esa transformación.",
    contenido: [
      {
        tipo: "p",
        texto:
          "En los años noventa, la comida peruana era cosa de casa o de huariques de barrio, casi nunca motivo de orgullo nacional. Veinticinco años después, Lima concentra algunos de los restaurantes más premiados del mundo y la palabra “cebichería” aparece en los diccionarios gastronómicos de medio planeta. ¿Qué pasó en el camino?",
      },
      {
        tipo: "p",
        texto:
          "La respuesta tiene muchos nombres. Por un lado, cocineros como Gastón Acurio, que en los años 2000 decidieron que la comida peruana merecía la alta cocina y la pasearon por el mundo. Por otro, miles de cocineras y cocineros anónimos: las caseritas del mercado, las pollerías, los maestros del chifa, que sostuvieron el sabor mientras nadie los miraba.",
      },
      { tipo: "h2", texto: "El chifa, lo nikkei y el mestizaje" },
      {
        tipo: "p",
        texto:
          "La cocina peruana es una historia de encuentros. La inmigración china trajo el wok y nacieron el lomo saltado y el aeropuerto; la japonesa afinó el corte del pescado y dio origen a la cocina nikkei; la herencia africana vive en los anticuchos y el cau cau. Ese mestizaje, durante años menospreciado, resultó ser la mayor riqueza del país.",
      },
      {
        tipo: "quote",
        texto:
          "La cocina peruana no es un museo: es una olla con la puerta abierta, donde siempre cabe uno más.",
      },
      {
        tipo: "p",
        texto:
          "Hoy el reto es otro: que la revolución alcance todas las mesas, que el productor andino y amazónico reciba lo justo por su cosecha, y que la siguiente generación cocine con el mismo orgullo. El fuego, por lo pronto, sigue bien encendido, y la mesa está servida.",
      },
    ],
  },
];

/* ---------------- Videos ---------------- */

export interface Video {
  id: string;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
}

export const VIDEOS: Video[] = [
  {
    id: "_ivdbk8kzMg",
    titulo: "Ceviche peruano: la auténtica receta",
    descripcion:
      "Pescado blanco, limón, cebolla morada y camote, explicados paso a paso para hacer ceviche en casa sin miedo.",
    destacado: true,
  },
  {
    id: "8LuWG6ajNNA",
    titulo: "Cebiche peruano clásico, con historia",
    descripcion:
      "Una receta personal del emblemático cebiche peruano, contada con calma y con la técnica de toda la vida.",
  },
  {
    id: "Oiy05vYSr3s",
    titulo: "Lomo saltado: el salteado peruano perfecto",
    descripcion:
      "Tiras de res, cebolla, tomate y sillao al fuego fuerte. Ideal para perderle el miedo al wok y al saltado.",
  },
  {
    id: "7RVpseqTKf0",
    titulo: "Lomo saltado y chicha morada, en español",
    descripcion:
      "Una clase completa y en español: el plato bandera y la bebida morada, preparados juntos como en un almuerzo de domingo.",
  },
  {
    id: "8tRAKTwS0_s",
    titulo: "Cómo hacer chicha morada en casa",
    descripcion:
      "Maíz morado, cáscaras de piña, canela y clavo: la receta completa de la bebida más querida del Perú, para 6 personas.",
  },
  {
    id: "vOO-cemAQTc",
    titulo: "La mejor chicha morada, según la tradición",
    descripcion:
      "Los trucos para lograr el morado perfecto y el punto exacto de dulzor, como se prepara en las casas peruanas.",
  },
];

/* ---------------- Enlaces ---------------- */

export interface Enlace {
  nombre: string;
  descripcion: string;
  dominio: string;
  url: string;
}

export const ENLACES: Enlace[] = [
  {
    nombre: "Perú Travel",
    descripcion: "El sitio oficial de turismo del Perú, con rutas gastronómicas por todo el país.",
    dominio: "peru.travel",
    url: "https://peru.travel/es",
  },
  {
    nombre: "Gastronomía del Perú · Wikipedia",
    descripcion: "Un recorrido completo por la historia, los platos y las regiones de la cocina peruana.",
    dominio: "es.wikipedia.org",
    url: "https://es.wikipedia.org/wiki/Gastronom%C3%ADa_del_Per%C3%BA",
  },
  {
    nombre: "Recetas Peruanas",
    descripcion: "Centenares de recetas caseras explicadas con cantidades y fotografías paso a paso.",
    dominio: "recetasperuanas.com",
    url: "https://www.recetasperuanas.com/",
  },
  {
    nombre: "Cocina peruana en YouTube",
    descripcion: "Los mejores canales y tutoriales en video para aprender a cocinar peruano viendo.",
    dominio: "youtube.com",
    url: "https://www.youtube.com/results?search_query=cocina+peruana+recetas",
  },
  {
    nombre: "El ceviche · Patrimonio Inmaterial UNESCO",
    descripcion: "La ficha oficial del reconocimiento de la UNESCO al ceviche como patrimonio de la humanidad.",
    dominio: "ich.unesco.org",
    url: "https://ich.unesco.org/es/RL/01973",
  },
  {
    nombre: "PromPerú",
    descripcion: "Promoción de la imagen del Perú: cultura, exportaciones y la marca país de nuestra cocina.",
    dominio: "promperu.gob.pe",
    url: "https://promperu.gob.pe/",
  },
];

export const PLATOS_MARQUESINA = [
  "Ceviche",
  "Lomo saltado",
  "Ají de gallina",
  "Causa limeña",
  "Anticuchos",
  "Pisco sour",
  "Chicha morada",
  "Picarones",
  "Pachamanca",
  "Rocoto relleno",
  "Arroz con pollo",
  "Juane",
];

/** Video tutorial de YouTube asignado a cada receta del recetario. */
export const VIDEO_POR_RECETA: Record<string, string> = {
  ceviche: "_ivdbk8kzMg",
  lomo: "Oiy05vYSr3s",
  "aji-gallina": "WpfUdBSMhYo",
  causa: "GG-o8MPBmoY",
  anticuchos: "uBJmVVbRGxY",
  picarones: "gjJHYMfG210",
  chicha: "8tRAKTwS0_s",
};

/* ---------------- Página Internacional ---------------- */

export interface RecetaMundo {
  id: string;
  nombre: string;
  origen: string;
  tiempo: string;
  dificultad: "Fácil" | "Media" | "Exigente";
  porciones: number;
  descripcion: string;
  ingredientes: string[];
  pasos: string[];
  video: string;
  tip: string;
  imagen?: string;
  propia?: boolean;
  pais?: string;
}

export interface PaisSeccion {
  id: string;
  nombre: string;
  lema: string;
  colores: { acc1: string; acc2: string; tinta: string; fondo: string; suave: string };
  bandera: { bandas: string[]; orient: "v" | "h" };
  imagen: string;
  recetas: RecetaMundo[];
}

export const PAISES: PaisSeccion[] = [
  {
    id: "mexico",
    nombre: "México",
    lema: "Maíz, chile y paciencia: la cocina mestiza que conquistó al mundo.",
    colores: { acc1: "#0e6b3a", acc2: "#c8102e", tinta: "#123524", fondo: "#f2f3e2", suave: "#e4e8cd" },
    bandera: { bandas: ["#006847", "#f4f4f4", "#ce1126"], orient: "v" },
    imagen:
      "https://image.qwenlm.ai/generated-images/f545d9bb-6f39-46ef-a49c-1918bcd798e3/_result.png",
    recetas: [
      {
        id: "mx-pastor",
        nombre: "Tacos al Pastor",
        origen: "Ciudad de México",
        tiempo: "1 h + marinado",
        dificultad: "Media",
        porciones: 4,
        descripcion:
          "Cerdo marinado en adobo de achiote y chiles guajillo, dorado al calor fuerte con piña. La taquería más famosa del mundo, en tu cocina.",
        ingredientes: [
          "1 kg de lomo de cerdo en láminas finas",
          "4 chiles guajillo y 2 chiles anchos",
          "50 g de pasta de achiote",
          "3 dientes de ajo",
          "½ cebolla blanca",
          "¼ de taza de vinagre blanco",
          "1 piña en rodajas",
          "Tortillas de maíz, cilantro, cebolla y limones para servir",
        ],
        pasos: [
          "Tuesta los chiles en un comal seco y remójalos en agua caliente por 15 minutos.",
          "Licúalos con el achiote, el ajo, la cebolla, el vinagre y una pizca de sal hasta lograr un adobo espeso.",
          "Marina la carne al menos 2 horas; si es toda la noche, mejor todavía.",
          "Dórala en sartén muy caliente hasta que los bordes se caramelicen.",
          "Asa la piña en el mismo sartén hasta dorarla y córtala en trocitos.",
          "Sirve en tortillas calientes con piña, cilantro, cebolla y limón.",
        ],
        video: "GS7g2l6t_Ug",
        tip: "El sabor “de trompo” se logra con calor muy alto y láminas delgadas. La piña no es adorno: es parte del adobo.",
      },
      {
        id: "mx-mole",
        nombre: "Mole Poblano",
        origen: "Puebla",
        tiempo: "2 h",
        dificultad: "Exigente",
        porciones: 8,
        descripcion:
          "Más de una docena de chiles, chocolate, especias y semillas en una salsa profunda y festiva. El platillo de las grandes celebraciones mexicanas.",
        ingredientes: [
          "3 chiles mulatos, 3 anchos y 3 pasilla",
          "50 g de chocolate de mesa",
          "1 jitomate y ½ cebolla",
          "3 dientes de ajo",
          "30 g de ajonjolí y 20 g de almendras",
          "1 plátano macho y 1 tortilla",
          "1 raja de canela",
          "1 pollo cocido en piezas y caldo de pollo",
        ],
        pasos: [
          "Fríe ligeramente los chiles, límpialos de semillas y remójalos en agua caliente.",
          "Asa el jitomate, la cebolla y el ajo, y licúalos con los chiles escurridos.",
          "Fríe el ajonjolí, las almendras, el plátano y la tortilla; licúalos con un poco de caldo.",
          "Une todo en una olla con la canela y cocina 30 minutos a fuego bajo, moviendo siempre.",
          "Añade el chocolate, sal al gusto y caldo hasta lograr la textura de una crema.",
          "Baña el pollo cocido y sirve con ajonjolí tostado por encima.",
        ],
        video: "K_D54YtCSrw",
        tip: "El mole mejora al día siguiente. Cocina a fuego bajo y sin dejar de mover: el chocolate no perdona el fondo de la olla.",
      },
      {
        id: "mx-nogada",
        nombre: "Chiles en Nogada",
        origen: "Puebla",
        tiempo: "1 h 30 min",
        dificultad: "Exigente",
        porciones: 6,
        descripcion:
          "Chiles poblanos rellenos de picadillo con frutas, bañados en crema de nuez, granada y perejil: el verde, blanco y rojo de la bandera en un plato.",
        ingredientes: [
          "6 chiles poblanos asados, sudados y pelados",
          "300 g de carne de cerdo molida",
          "1 pera, 1 manzana y 1 plátano macho en cubitos",
          "½ cebolla y 2 dientes de ajo picados",
          "1 jitomate picado",
          "200 g de nuez de castilla pelada",
          "100 g de queso fresco y ½ taza de leche",
          "1 granada y perejil fresco; canela y sal",
        ],
        pasos: [
          "Sofríe cebolla y ajo, agrega la carne, el jitomate y la canela, y cocina bien.",
          "Incorpora las frutas, cocina 5 minutos más y deja enfriar el picadillo.",
          "Rellena los chiles con cuidado de no romperlos.",
          "Licúa la nuez con el queso y la leche hasta obtener una crema tersa.",
          "Cubre los chiles con la nogada y decora con granada y perejil.",
          "Sirve a temperatura ambiente, como se ha hecho por dos siglos.",
        ],
        video: "oP6hcmAID3s",
        tip: "Su temporada va de julio a septiembre, cuando llegan la nuez criolla y la granada. Vale la pena esperarlos.",
      },
    ],
  },
  {
    id: "italia",
    nombre: "Italia",
    lema: "Pocos ingredientes, técnica impecable: la escuela de la sencillez perfecta.",
    colores: { acc1: "#1c7c44", acc2: "#b21f2d", tinta: "#1c3a2a", fondo: "#f1f3e8", suave: "#e2e8d2" },
    bandera: { bandas: ["#009246", "#f4f4f4", "#ce2b37"], orient: "v" },
    imagen:
      "https://image.qwenlm.ai/generated-images/6fd85ecd-8d47-4b63-afb2-a66494be91bf/_result.png",
    recetas: [
      {
        id: "it-carbonara",
        nombre: "Spaghetti alla Carbonara",
        origen: "Roma",
        tiempo: "25 min",
        dificultad: "Fácil",
        porciones: 4,
        descripcion:
          "La carbonara romana de verdad: guanciale, yemas, pecorino y pimienta. Sin nata ni crema. Cremosa, simple y lista en lo que hierve la pasta.",
        ingredientes: [
          "400 g de spaghetti",
          "150 g de guanciale en tiras",
          "4 yemas de huevo y 1 huevo entero",
          "80 g de queso pecorino romano rallado",
          "Pimienta negra recién molida, en abundancia",
          "Sal para el agua de la pasta",
        ],
        pasos: [
          "Cuece la pasta en agua abundante con sal.",
          "Derrite el guanciale a fuego medio hasta que esté crujiente y dorado.",
          "Bate las yemas con el pecorino y mucha pimienta en un bol amplio.",
          "Pasa la pasta al sartén con el guanciale, ya fuera del fuego.",
          "Añade la mezcla de huevo y un cucharón de agua de la pasta, removiendo sin parar.",
          "Sirve al momento con más pecorino y pimienta.",
        ],
        video: "Nlm6G6_8GqI",
        tip: "La cremosidad nace de la emulsión de huevo, queso y agua de cocción, siempre fuera del fuego. Si vuelves a encender la llama, harás huevo revuelto.",
      },
      {
        id: "it-risotto",
        nombre: "Risotto alla Milanese",
        origen: "Milán",
        tiempo: "40 min",
        dificultad: "Media",
        porciones: 4,
        descripcion:
          "Arroz carnaroli dorado por el azafrán y acabado con mantequilla y parmesano. La técnica que define al risotto italiano: caldo, paciencia y mantecatura.",
        ingredientes: [
          "320 g de arroz carnaroli o arborio",
          "1,2 litros de caldo caliente",
          "Unas hebras de azafrán",
          "1 cebolla pequeña picada fina",
          "60 g de mantequilla fría",
          "60 g de parmigiano reggiano rallado",
          "½ taza de vino blanco seco",
          "Sal",
        ],
        pasos: [
          "Infusiona el azafrán en un cucharón de caldo caliente.",
          "Sofríe la cebolla con la mitad de la mantequilla, añade el arroz y tuesta 2 minutos.",
          "Vierte el vino y deja que se evapore por completo.",
          "Agrega caldo caliente cucharón a cucharón, removiendo, durante 16 a 18 minutos.",
          "Incorpora el azafrán y, fuera del fuego, manteca con la mantequilla fría y el parmesano.",
          "Deja reposar 1 minuto y sirve “all'onda”: cremoso, como una ola.",
        ],
        video: "uCePQ9bk144",
        tip: "No laves el arroz: su almidón es el que da la cremosidad. El punto se comprueba al mover la olla: el risotto debe ondear.",
      },
      {
        id: "it-ossobuco",
        nombre: "Ossobuco alla Milanese",
        origen: "Lombardía",
        tiempo: "2 h",
        dificultad: "Exigente",
        porciones: 4,
        descripcion:
          "Jarrete de ternera braseado lentamente en vino blanco y caldo, perfumado con gremolata. El plato de domingo que acompaña perfecto al risotto.",
        ingredientes: [
          "4 jarretes de ternera de unos 3 cm de grosor",
          "Harina para enharinar",
          "1 vaso de vino blanco",
          "400 ml de caldo",
          "1 cebolla, 1 zanahoria y 1 rama de apio picados",
          "200 g de tomate triturado",
          "Ralladura y jugo de 1 limón",
          "1 diente de ajo y perejil fresco para la gremolata",
          "Mantequilla y aceite de oliva",
        ],
        pasos: [
          "Ata los jarretes, enharínalos y dóralos en mantequilla con aceite. Resérvalos.",
          "Sofríe las verduras en la misma olla hasta que estén tiernas.",
          "Regresa la carne, vierte el vino y deja que reduzca a la mitad.",
          "Añade el tomate y el caldo, tapa y brasea a fuego mínimo 1 hora y 45 minutos.",
          "Prepara la gremolata: ralladura de limón, ajo y perejil picados muy finos.",
          "Sirve el ossobuco con su salsa y una lluvia de gremolata fresca.",
        ],
        video: "utPA43t1cTI",
        tip: "El tuétano del hueso es la mejor parte: se unta en pan. Y con la salsa que sobre, al día siguiente toca risotto.",
      },
    ],
  },
  {
    id: "espana",
    nombre: "España",
    lema: "Del socarrat de la paella al jugo de la tortilla: la mesa del mediodía eterno.",
    colores: { acc1: "#b01e28", acc2: "#e9a11c", tinta: "#3d1a12", fondo: "#faf0dc", suave: "#f2e1c2" },
    bandera: { bandas: ["#aa151b", "#f1bf00", "#aa151b"], orient: "h" },
    imagen:
      "https://image.qwenlm.ai/generated-images/5228ddfe-563c-4cc7-bc7e-70950b4cc494/_result.png",
    recetas: [
      {
        id: "es-paella",
        nombre: "Paella Valenciana",
        origen: "Valencia",
        tiempo: "1 h",
        dificultad: "Exigente",
        porciones: 6,
        descripcion:
          "Arroz bomba en paellera con azafrán, pollo, conejo y judías verdes. El plato más famoso de España, con una regla de oro: jamás se remueve.",
        ingredientes: [
          "400 g de arroz bomba",
          "300 g de pollo y 200 g de conejo en trozos",
          "150 g de judía verde plana",
          "100 g de garrofón",
          "1 tomate maduro rallado",
          "1,5 litros de caldo caliente",
          "Unas hebras de azafrán y pimentón dulce",
          "Aceite de oliva y sal",
        ],
        pasos: [
          "Dora bien la carne salada en aceite de oliva, en la paellera.",
          "Añade las judías y el garrofón, y sofríe unos minutos.",
          "Incorpora el tomate y el pimentón, y cocina hasta hacer un sofrito oscuro.",
          "Suma el arroz, nácrelo un minuto y vierte el caldo caliente con el azafrán.",
          "Fuego vivo 10 minutos y suave 8 más, sin tocar el arroz.",
          "Sube el fuego 1 minuto final para el socarrat y reposa 5 minutos tapada con un paño.",
        ],
        video: "l6ND4pZXKLU",
        tip: "El socarrat —la costra caramelizada del fondo— es el alma de la paella. Se anuncia con un crepitar suave: ese es el momento.",
      },
      {
        id: "es-tortilla",
        nombre: "Tortilla Española",
        origen: "Toda España",
        tiempo: "40 min",
        dificultad: "Media",
        porciones: 4,
        descripcion:
          "Huevo, papa, aceite de oliva y la eterna discusión: ¿con cebolla o sin cebolla? La reina de las tapas, jugosa en el centro y firme por fuera.",
        ingredientes: [
          "6 huevos",
          "700 g de papas en láminas finas",
          "1 cebolla grande (si eres del equipo con cebolla)",
          "300 ml de aceite de oliva suave para confitar",
          "Sal",
        ],
        pasos: [
          "Confita las papas (y la cebolla) a fuego bajo, sin que doren, 20 a 25 minutos.",
          "Escúrrelas muy bien y mézclalas con los huevos batidos y salados.",
          "Deja reposar la mezcla 5 minutos para que la papa absorba el huevo.",
          "Cuaja en sartén a fuego medio-bajo unos 3 minutos, moviendo los bordes.",
          "Dale la vuelta con un plato y cuaja 2 minutos más: el centro debe quedar jugoso.",
          "Reposa 5 minutos antes de cortar en cuñas.",
        ],
        video: "Na6_hxPsPIM",
        tip: "No batas demasiado los huevos y deja reposar la papa en ellos: la jugosidad se decide en esos cinco minutos de paciencia.",
      },
      {
        id: "es-gazpacho",
        nombre: "Gazpacho Andaluz",
        origen: "Andalucía",
        tiempo: "15 min + frío",
        dificultad: "Fácil",
        porciones: 4,
        descripcion:
          "Tomate maduro, pimiento, pepino, pan, aceite y vinagre batidos en frío. El verano andaluz servido en vaso, nacido en los campos del sur.",
        ingredientes: [
          "1 kg de tomates muy maduros",
          "1 pimiento verde italiano",
          "1 pepino pequeño",
          "1 diente de ajo",
          "50 g de pan del día anterior",
          "60 ml de aceite de oliva virgen extra",
          "15 ml de vinagre de Jerez",
          "Sal y hielo",
        ],
        pasos: [
          "Lava y trocea las verduras, sin obsesionarte con el tamaño.",
          "Bate todo junto con el pan, el ajo y la sal durante 2 minutos.",
          "Con la batidora en marcha, añade el aceite en hilo fino para emulsionar.",
          "Prueba y ajusta de vinagre y sal.",
          "Refrigera al menos 2 horas.",
          "Sirve muy frío, con trocitos de verdura picada por encima.",
        ],
        video: "6ml6NE-MW84",
        tip: "La calidad del tomate y del aceite lo decide todo. Si queda espeso, aligera con agua helada, nunca con más pan.",
      },
    ],
  },
  {
    id: "argentina",
    nombre: "Argentina",
    lema: "Fuego, sal gruesa y sobremesa larga: la liturgia del asado.",
    colores: { acc1: "#3e8fc0", acc2: "#f0b429", tinta: "#123a52", fondo: "#eaf2f7", suave: "#d8e7f0" },
    bandera: { bandas: ["#74acdf", "#f4f4f4", "#74acdf"], orient: "h" },
    imagen:
      "https://image.qwenlm.ai/generated-images/e3df267a-b6e2-4b5a-9484-45305c486b80/_result.png",
    recetas: [
      {
        id: "ar-asado",
        nombre: "Asado con Chimichurri",
        origen: "La pampa",
        tiempo: "1 h 30 min",
        dificultad: "Media",
        porciones: 6,
        descripcion:
          "Tira de asado a la brasa de leña con sal gruesa y paciencia. Más que un plato, el ritual del domingo argentino: fuego lento y conversación.",
        ingredientes: [
          "2 kg de tira de asado",
          "Sal gruesa",
          "1 atado de perejil fresco",
          "4 dientes de ajo",
          "1 cucharada de orégano seco",
          "1 cucharadita de ají molido",
          "125 ml de vinagre de vino tinto",
          "250 ml de aceite de girasol o de oliva",
        ],
        pasos: [
          "Prepara el chimichurri: pica el perejil y el ajo, mezcla con orégano, ají, vinagre y aceite, y deja reposar.",
          "Enciende leña o carbón y espera brasas blancas, sin llama.",
          "Sala la tira y colócala del lado del hueso, a fuego medio, 40 a 50 minutos.",
          "Da la vuelta y cocina 15 minutos más, hasta dorar.",
          "Deja reposar 5 minutos sobre tabla de madera.",
          "Corta entre hueso y hueso, y sirve con chimichurri generoso.",
        ],
        video: "tgpigZjojkk",
        tip: "La brasa está lista cuando aguantas la mano sobre la parrilla 4 o 5 segundos. El asado no se apura: se acompaña.",
      },
      {
        id: "ar-empanadas",
        nombre: "Empanadas Salteñas",
        origen: "Salta",
        tiempo: "1 h 30 min",
        dificultad: "Exigente",
        porciones: 12,
        descripcion:
          "Jugosas, de carne cortada a cuchillo con papa y especias, cerradas con el repulgue que distingue a Salta. El orgullo del norte argentino.",
        ingredientes: [
          "12 discos de empanada",
          "500 g de carne de res cortada a cuchillo",
          "2 cebollas picadas y 1 pimiento rojo",
          "2 papas cocidas en cubitos",
          "1 cucharadita de pimentón dulce",
          "1 cucharadita de comino y ½ de ají molido",
          "2 huevos duros y 2 cebollas de verdeo",
          "Grasa de vaca o aceite, y caldo",
        ],
        pasos: [
          "Sofríe la cebolla y el pimiento; agrega la carne y las especias, y cocina apenas.",
          "Suma un cucharón de caldo y deja guisar 15 minutos a fuego suave.",
          "Fuera del fuego, incorpora la papa, el huevo picado y el verdeo.",
          "Enfría el relleno en la heladera: es imprescindible para el armado.",
          "Rellena los discos y ciérralos con el repulgue tradicional.",
          "Hornea a 220 °C unos 15 minutos, hasta dorar.",
        ],
        video: "eWPzfMwVN3w",
        tip: "El relleno debe estar frío y jugoso: ese es el secreto del “jugo” que explota al morder. Cómelas con cuidado y sin culpa.",
      },
      {
        id: "ar-chimichurri",
        nombre: "Chimichurri Casero",
        origen: "Todo el país",
        tiempo: "15 min + reposo",
        dificultad: "Fácil",
        porciones: 1,
        descripcion:
          "La salsa verde que no falta en ninguna parrilla: perejil, ajo, orégano, ají, vinagre y aceite. Simple, pero con reglas que se respetan.",
        ingredientes: [
          "1 atado grande de perejil fresco",
          "4 dientes de ajo",
          "1 cucharada de orégano seco",
          "1 cucharadita de ají molido",
          "1 cucharadita de pimentón dulce",
          "60 ml de vinagre de vino tinto",
          "180 ml de aceite neutro",
          "Sal gruesa y pimienta negra",
        ],
        pasos: [
          "Pica el perejil y el ajo a cuchillo, bien finos (nada de licuadora).",
          "Mezcla con el orégano, el pimentón, el ají y la sal.",
          "Añade el vinagre y deja reposar 10 minutos.",
          "Suma el aceite y mezcla con calma.",
          "Deja macerar 24 horas en la heladera y ajusta la sazón.",
          "Se conserva hasta dos semanas refrigerado.",
        ],
        video: "WSYch4pESw0",
        tip: "Cuchillo y tabla, jamás licuadora: el picado a mano conserva el aroma y evita que el perejil se oxide y amargue.",
      },
    ],
  },
];
