import { useCallback, useEffect, useState } from "react";
import Nav, { type Escala } from "./components/Nav";
import Hero from "./components/Hero";
import Recipes from "./components/Recipes";
import Videos from "./components/Videos";
import Blog from "./components/Blog";
import LinksFooter from "./components/LinksFooter";
import { Toast } from "./components/ui";

const TAMANOS: Record<Escala, string> = {
  S: "90%",
  M: "100%",
  G: "118%",
};

export default function App() {
  const [escala, setEscala] = useState<Escala>("M");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.fontSize = TAMANOS[escala];
  }, [escala]);

  const avisar = useCallback((mensaje: string) => {
    setToast(mensaje);
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#recetas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-aji focus:px-5 focus:py-3 focus:font-bold focus:text-tinta"
      >
        Saltar a las recetas
      </a>
      <Nav escala={escala} onEscala={setEscala} />
      <main>
        <Hero />
        <Recipes />
        <Videos />
        <Blog />
        <LinksFooter onToast={avisar} />
      </main>
      <div className="noise-layer" aria-hidden="true" />
      <Toast mensaje={toast} />
    </div>
  );
}
