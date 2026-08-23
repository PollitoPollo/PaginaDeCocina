import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ControlAuth, ModalAuth, type ModoAuth } from "./components/Auth";
import Blog from "./components/Blog";
import Hero from "./components/Hero";
import LinksFooter from "./components/LinksFooter";
import Nav from "./components/Nav";
import RecipeForm from "./components/RecipeForm";
import Recipes from "./components/Recipes";
import Videos from "./components/Videos";
import { Toast } from "./components/ui";
import CocinaBasica from "./pages/CocinaBasica";
import Internacional from "./pages/Internacional";
import {
  aprendidasDeUsuario,
  alternarAprendida as alternarEnDisco,
  cerrarSesion,
  nivelPara,
  todasLasRecetas,
  usuarioDeSesion,
  type Usuario,
} from "./lib/store";

function ScrollAlInicio() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Portada(props: {
  recetas: ReturnType<typeof todasLasRecetas>;
  aprendidas: string[];
  logueado: boolean;
  esAdmin: boolean;
  onAlternarAprendida: (recetaId: string) => void;
  onAgregarReceta: () => void;
}) {
  return (
    <main>
      <Hero />
      <Recipes {...props} />
      <Videos />
      <Blog />
    </main>
  );
}

export default function App() {
  const [sesion, setSesion] = useState<Usuario | null>(() => usuarioDeSesion());
  const [aprendidas, setAprendidas] = useState<string[]>(() => {
    const u = usuarioDeSesion();
    return u ? aprendidasDeUsuario(u.id) : [];
  });
  const [recetas, setRecetas] = useState(() => todasLasRecetas());
  const [modalAuth, setModalAuth] = useState<ModoAuth | null>(null);
  const [formReceta, setFormReceta] = useState(false);
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  useEffect(() => {
    if (!mensajeToast) return;
    const t = setTimeout(() => setMensajeToast(null), 4200);
    return () => clearTimeout(t);
  }, [mensajeToast]);

  const avisar = (mensaje: string) => setMensajeToast(mensaje);

  const manejarExito = (usuario: Usuario) => {
    setSesion(usuario);
    setAprendidas(aprendidasDeUsuario(usuario.id));
    setModalAuth(null);
  };

  const manejarCierre = () => {
    cerrarSesion();
    setSesion(null);
    setAprendidas([]);
    avisar("Sesión cerrada. ¡Vuelve pronto a cocinar!");
  };

  const alternarAprendida = (recetaId: string) => {
    if (!sesion) {
      avisar("Inicia sesión o crea una cuenta para marcar tus recetas aprendidas.");
      setModalAuth("login");
      return;
    }
    const nivelAntes = nivelPara(aprendidas.length).indice;
    const quedoAprendida = alternarEnDisco(sesion.id, recetaId);
    const lista = aprendidasDeUsuario(sesion.id);
    setAprendidas(lista);
    if (quedoAprendida) {
      const nivel = nivelPara(lista.length);
      avisar(
        nivel.indice > nivelAntes
          ? `¡Receta aprendida! Subiste a nivel ${nivel.indice + 1}: ${nivel.actual.nombre}.`
          : "¡Bien hecho! Receta marcada como aprendida."
      );
    } else {
      avisar("Receta quitada de tus aprendidas.");
    }
  };

  return (
    <HashRouter>
      <ScrollAlInicio />
      <div>
        <div className="noise-layer" aria-hidden="true" />

        <Nav
          auth={
            <ControlAuth
              sesion={sesion}
              aprendidas={aprendidas}
              recetas={recetas}
              onAbrirAuth={(modo) => setModalAuth(modo)}
              onCerrarSesion={manejarCierre}
              onAgregarReceta={() => setFormReceta(true)}
            />
          }
        />

        <Routes>
          <Route
            path="/"
            element={
              <Portada
                recetas={recetas}
                aprendidas={aprendidas}
                logueado={!!sesion}
                esAdmin={!!sesion?.esAdmin}
                onAlternarAprendida={alternarAprendida}
                onAgregarReceta={() => setFormReceta(true)}
              />
            }
          />
          <Route
            path="/cocina-basica"
            element={<CocinaBasica esAdmin={!!sesion?.esAdmin} avisar={avisar} />}
          />
          <Route path="/internacional" element={<Internacional />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <LinksFooter onToast={avisar} />

        {modalAuth && (
          <ModalAuth
            modoInicial={modalAuth}
            onCerrar={() => setModalAuth(null)}
            onExito={manejarExito}
            onToast={avisar}
          />
        )}

        {formReceta && (
          <RecipeForm
            onCerrar={() => setFormReceta(false)}
            onAgregada={() => setRecetas(todasLasRecetas())}
            onToast={avisar}
          />
        )}

        <Toast mensaje={mensajeToast} />
      </div>
    </HashRouter>
  );
}
