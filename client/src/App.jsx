import { useEffect, useState } from "react";
import { listarPlantas } from "./api/plantas.js";
import DetallePlanta from "./pantallas/DetallePlanta.jsx";
import Plantas from "./pantallas/Plantas.jsx";

const CLAVE_DETALLE = "invernadero.detallePlantaId";

function App() {
  const [pantalla, setPantalla] = useState("plantas");
  const [plantaSeleccionada, setPlantaSeleccionada] = useState(null);
  const [focoRiego, setFocoRiego] = useState(false);
  const [plantaIdParaFoco, setPlantaIdParaFoco] = useState(null);
  const [avisoRestauracion, setAvisoRestauracion] = useState("");
  const [restaurando, setRestaurando] = useState(() =>
    Boolean(
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(CLAVE_DETALLE),
    ),
  );

  useEffect(() => {
    const idGuardado = sessionStorage.getItem(CLAVE_DETALLE);
    if (!idGuardado) {
      setRestaurando(false);
      return;
    }

    let cancelado = false;

    async function restaurar() {
      try {
        const { ok, cuerpo } = await listarPlantas();
        if (cancelado) {
          return;
        }
        if (!ok || !Array.isArray(cuerpo)) {
          sessionStorage.removeItem(CLAVE_DETALLE);
          setAvisoRestauracion(
            "No pudimos recuperar la planta que estabas viendo. Aquí tienes la lista.",
          );
          setRestaurando(false);
          return;
        }
        const planta = cuerpo.find((item) => item._id === idGuardado);
        if (planta) {
          setPlantaSeleccionada(planta);
          setPantalla("detalle");
        } else {
          sessionStorage.removeItem(CLAVE_DETALLE);
          setAvisoRestauracion(
            "No encontramos esa planta. Puede que se haya borrado.",
          );
        }
      } catch {
        if (!cancelado) {
          sessionStorage.removeItem(CLAVE_DETALLE);
          setAvisoRestauracion(
            "No pudimos recuperar la planta que estabas viendo. Aquí tienes la lista.",
          );
        }
      } finally {
        if (!cancelado) {
          setRestaurando(false);
        }
      }
    }

    restaurar();
    return () => {
      cancelado = true;
    };
  }, []);

  function onSeleccionarPlanta(planta, opciones = {}) {
    setAvisoRestauracion("");
    setPlantaSeleccionada(planta);
    setFocoRiego(Boolean(opciones.focoRiego));
    setPantalla("detalle");
    sessionStorage.setItem(CLAVE_DETALLE, planta._id);
  }

  function onVolver() {
    const id = plantaSeleccionada?._id ?? null;
    setPantalla("plantas");
    setPlantaSeleccionada(null);
    setFocoRiego(false);
    setPlantaIdParaFoco(id);
    sessionStorage.removeItem(CLAVE_DETALLE);
  }

  if (restaurando) {
    return (
      <div className="app-shell">
        <header className="app-banda">
          <p className="app-marca">Invernadero Encantado</p>
          <h1>Cargando</h1>
        </header>
        <main className="app-cuerpo">
          <p>Recuperando la planta que estabas viendo…</p>
        </main>
      </div>
    );
  }

  if (pantalla === "detalle" && plantaSeleccionada) {
    return (
      <DetallePlanta
        planta={plantaSeleccionada}
        onVolver={onVolver}
        focoRiego={focoRiego}
      />
    );
  }

  return (
    <Plantas
      onSeleccionarPlanta={onSeleccionarPlanta}
      plantaIdParaFoco={plantaIdParaFoco}
      onFocoRestaurado={() => setPlantaIdParaFoco(null)}
      avisoRestauracion={avisoRestauracion}
      onDescartarAviso={() => setAvisoRestauracion("")}
    />
  );
}

export default App;
