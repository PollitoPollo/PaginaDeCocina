import { IMAGENES, PLATOS_MARQUESINA } from "../data";
import { IconAji, IconChakana, IconFlecha, IconMaiz, Reveal } from "./ui";

function Postal({
  src,
  alt,
  pie,
  clase,
}: {
  src: string;
  alt: string;
  pie: string;
  clase: string;
}) {
  return (
    <figure
      className={`absolute rounded-md bg-crema p-2 pb-3 shadow-2xl transition-all duration-500 hover:z-30 hover:scale-[1.04] hover:rotate-0 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)] ${clase}`}
    >
      <div className="overflow-hidden rounded-sm">
        <img
          src={src}
          alt={alt}
          loading="eager"
          className="kenburns h-40 w-full object-cover sm:h-48"
        />
      </div>
      <figcaption className="pt-2 text-center font-display text-sm italic text-uva">
        {pie}
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-tinta text-papel">
      {/* Fondo por capas: brillos de chicha y ají */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #d7263d 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f5a31a 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #cfa9c6 0 2px, transparent 2px 26px)",
        }}
      />
      <p
        aria-hidden="true"
        className="text-stroke-papel pointer-events-none absolute -bottom-4 left-0 select-none whitespace-nowrap font-display text-[24vw] font-black leading-none"
      >
        PERÚ
      </p>
      <IconChakana className="floaty absolute right-[8%] top-28 hidden h-10 w-10 text-uva-3 lg:block" />
      <IconAji className="floaty absolute left-[42%] top-24 hidden h-9 w-9 lg:block" style={{ animationDelay: "1.2s" }} />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-28 pt-40 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-44">
        {/* Columna de texto */}
        <div className="lg:col-span-6">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-lila/40 px-4 py-1.5 text-sm font-bold text-lila">
              <IconMaiz className="h-4 w-4 text-aji" />
              Patrimonio Cultural de la Nación, desde 2008
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">
              El sabor que{" "}
              <em className="text-aji">abraza</em>
              <br />
              a todo un país
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-lila sm:text-xl">
              Ceviche, lomo saltado, chicha morada… Recetas paso a paso, videos
              para aprender viendo e historias para leer con hambre. La cocina
              peruana explicada claro, para jóvenes y para abuelos.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#recetas"
                className="group inline-flex items-center gap-3 rounded-lg bg-aji px-7 py-4 text-lg font-bold text-tinta shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-aji-2 hover:shadow-[0_14px_30px_rgba(245,163,26,0.35)]"
              >
                Explorar las recetas
                <IconFlecha className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a
                href="#videos"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-lila/50 px-7 py-[0.85rem] text-lg font-bold text-papel transition-all duration-300 hover:-translate-y-1 hover:border-aji hover:text-aji"
              >
                Cocinar en video
              </a>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-uva-2 pt-8">
              {[
                { cifra: "491", dato: "platos típicos registrados en el país" },
                { cifra: "3", dato: "cocinas hermanas: costa, sierra y selva" },
                { cifra: "2023", dato: "el ceviche, Patrimonio de la Humanidad" },
              ].map(({ cifra, dato }) => (
                <div key={cifra}>
                  <dt className="font-display text-4xl font-black text-aji sm:text-5xl">
                    {cifra}
                  </dt>
                  <dd className="mt-1 max-w-[12rem] text-sm leading-snug text-lila">
                    {dato}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Postales dispersas */}
        <div className="relative min-h-[430px] sm:min-h-[520px] lg:col-span-6">
          <Reveal delay={200} className="absolute inset-0">
            <Postal
              src={IMAGENES.ceviche}
              alt="Ceviche peruano en un plato de cerámica"
              pie="Ceviche — Lima, mediodía"
              clase="left-0 top-8 w-48 -rotate-6 sm:w-60"
            />
            <Postal
              src={IMAGENES.lomo}
              alt="Lomo saltado recién salido del wok"
              pie="Lomo saltado — fuego y sillao"
              clase="right-0 top-0 w-52 rotate-3 sm:w-64"
            />
            <Postal
              src={IMAGENES.chicha}
              alt="Vaso de chicha morada con canela y limón"
              pie="Chicha morada — el morado que refresca"
              clase="bottom-2 left-1/2 z-20 w-56 -translate-x-1/2 -rotate-2 sm:w-72"
            />
          </Reveal>

          {/* Insignia giratoria */}
          <div className="absolute -left-4 bottom-24 z-30 hidden h-32 w-32 md:block">
            <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
              <defs>
                <path id="circulo" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-aji font-display" fontSize="9.5" fontWeight="700" letterSpacing="2.4">
                <textPath href="#circulo">
                  COCINA PERUANA • SABOR DE TODOS •
                </textPath>
              </text>
            </svg>
            <IconAji className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Marquesina de platos */}
      <div className="relative border-y-4 border-aji bg-rojo py-3 text-crema">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copia) => (
            <div key={copia} className="flex shrink-0 items-center">
              {PLATOS_MARQUESINA.map((plato) => (
                <span
                  key={`${copia}-${plato}`}
                  className="flex items-center gap-6 pr-6 font-display text-lg font-bold uppercase tracking-[0.14em]"
                >
                  {plato}
                  <span className="block h-2 w-2 rotate-45 bg-aji" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">
          Platos de la marquesina: {PLATOS_MARQUESINA.join(", ")}.
        </p>
      </div>
    </section>
  );
}
