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
import Donaciones from "./pages/Donaciones";
import Internacional from "./pages/Internacional";
import Top10 from "./pages/Top10";
import {
  aprendidasDeUsuario,
  alternarAprendida as alternarEnDisco,
  calificacionesDeUsuario,
  calificar as calificarEnDisco,
  cerrarSesion,
  completosDeUsuario,
  alternarNivelCompletado as alternarNivelEnDisco,
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
  calificaciones: Record<string, number>;
  onAlternarAprendida: (recetaId: string) => void;
  onAgregarReceta: () => void;
  onCalificar: (recetaId: string, estrellas: number) => void;
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
  const [nivelesCompletos, setNivelesCompletos] = useState<string[]>(() => {
    const u = usuarioDeSesion();
    return u ? completosDeUsuario(u.id) : [];
  });
  const [calificaciones, setCalificaciones] = useState<Record<string, number>>(() => {
    const u = usuarioDeSesion();
    return u ? calificacionesDeUsuario(u.id) : {};
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
    setNivelesCompletos(completosDeUsuario(usuario.id));
    setCalificaciones(calificacionesDeUsuario(usuario.id));
    setModalAuth(null);
  };

  const manejarCierre = () => {
    cerrarSesion();
    setSesion(null);
    setAprendidas([]);
    setNivelesCompletos([]);
    setCalificaciones({});
    avisar("Sesión cerrada. ¡Vuelve pronto a cocinar!");
  };

  const avisarSubida = (mensajeBase: string, nivelAntes: number, totalAhora: number) => {
    const nivel = nivelPara(totalAhora);
    avisar(
      nivel.indice > nivelAntes
        ? `${mensajeBase} ¡Subiste a nivel ${nivel.indice + 1}: ${nivel.actual.nombre}!`
        : mensajeBase
    );
  };

  const alternarAprendida = (recetaId: string) => {
    if (!sesion) {
      avisar("Inicia sesión o crea una cuenta para marcar tus recetas aprendidas.");
      setModalAuth("login");
      return;
    }
    const nivelAntes = nivelPara(aprendidas.length + nivelesCompletos.length).indice;
    const quedoAprendida = alternarEnDisco(sesion.id, recetaId);
    const lista = aprendidasDeUsuario(sesion.id);
    setAprendidas(lista);
    if (quedoAprendida) {
      avisarSubida(
        "¡Bien hecho! Receta marcada como aprendida.",
        nivelAntes,
        lista.length + nivelesCompletos.length
      );
    } else {
      avisar("Receta quitada de tus aprendidas.");
    }
  };

  const alternarNivelCompletado = (nivelId: string) => {
    if (!sesion) {
      avisar("Inicia sesión para marcar niveles como completados.");
      setModalAuth("login");
      return;
    }
    const nivelAntes = nivelPara(aprendidas.length + nivelesCompletos.length).indice;
    const quedoCompletado = alternarNivelEnDisco(sesion.id, nivelId);
    const lista = completosDeUsuario(sesion.id);
    setNivelesCompletos(lista);
    if (quedoCompletado) {
      avisarSubida(
        "¡Nivel de cocina básica completado!",
        nivelAntes,
        aprendidas.length + lista.length
      );
    } else {
      avisar("Nivel quitado de tus completados.");
    }
  };

  const calificarReceta = (recetaId: string, estrellas: number) => {
    if (!sesion) {
      avisar("Inicia sesión para calificar tus recetas aprendidas.");
      setModalAuth("login");
      return;
    }
    calificarEnDisco(sesion.id, recetaId, estrellas);
    setCalificaciones(calificacionesDeUsuario(sesion.id));
    avisar(
      estrellas >= 4
        ? `¡Gracias! La calificaste con ${estrellas} estrellas.`
        : `Gracias por tu calificación de ${estrellas} ${estrellas === 1 ? "estrella" : "estrellas"}.`
    );
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
              nivelCompletos={nivelesCompletos.length}
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
                calificaciones={calificaciones}
                onAlternarAprendida={alternarAprendida}
                onAgregarReceta={() => setFormReceta(true)}
                onCalificar={calificarReceta}
              />
            }
          />
          <Route
            path="/cocina-basica"
            element={
              <CocinaBasica
                esAdmin={!!sesion?.esAdmin}
                logueado={!!sesion}
                completos={nivelesCompletos}
                onCompletar={alternarNivelCompletado}
                avisar={avisar}
              />
            }
          />
          <Route
            path="/internacional"
            element={
              <Internacional
                esAdmin={!!sesion?.esAdmin}
                logueado={!!sesion}
                aprendidas={aprendidas}
                onAlternarAprendida={alternarAprendida}
                avisar={avisar}
              />
            }
          />
          <Route path="/top10" element={<Top10 esAdmin={!!sesion?.esAdmin} avisar={avisar} />} />
          <Route
            path="/donaciones"
            element={<Donaciones esAdmin={!!sesion?.esAdmin} avisar={avisar} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <LinksFooter onToast={avisar} />

        {modalAuth && (
          <ModalAuth
            modoInicial={modalAuth}
            esAdmin={!!sesion?.esAdmin}
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
