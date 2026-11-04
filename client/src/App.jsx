import { useState } from "react";
import DetallePlanta from "./pantallas/DetallePlanta.jsx";
import Plantas from "./pantallas/Plantas.jsx";

function App() {
  const [pantalla, setPantalla] = useState("plantas");
  const [plantaSeleccionada, setPlantaSeleccionada] = useState(null);

  function onSeleccionarPlanta(planta) {
    setPlantaSeleccionada(planta);
    setPantalla("detalle");
  }

  function onVolver() {
    setPantalla("plantas");
    setPlantaSeleccionada(null);
  }

  if (pantalla === "detalle" && plantaSeleccionada) {
    return <DetallePlanta planta={plantaSeleccionada} onVolver={onVolver} />;
  }

  return <Plantas onSeleccionarPlanta={onSeleccionarPlanta} />;
}

export default App;
