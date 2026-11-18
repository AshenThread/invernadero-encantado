import { useEffect, useRef, useState } from "react";
import { crearPlanta, listarPlantas } from "../api/plantas.js";
import { listarRiegos } from "../api/riegos.js";
import Boton from "../componentes/Boton.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import { formatearFechaCorta } from "../util/fechas.js";
import "./Plantas.css";

const CAMPOS_FORMULARIO = [
  "nombre",
  "especie",
  "ubicacion",
  "intervaloRiegoDias",
];

const FORMULARIO_VACIO = {
  nombre: "",
  especie: "",
  ubicacion: "",
  intervaloRiegoDias: "",
};

function mensajeCuidado(mensaje) {
  if (!mensaje || typeof mensaje !== "string") {
    return "No pudimos guardar la planta. Revisa los datos e inténtalo de nuevo.";
  }
  const tecnico =
    /\b400\b/i.test(mensaje) ||
    /ObjectId/i.test(mensaje) ||
    /payload/i.test(mensaje) ||
    /CastError/i.test(mensaje);
  if (tecnico) {
    return "Hay un dato que no encaja. Revisa el formulario e inténtalo de nuevo.";
  }
  return mensaje;
}

function textoUltimoRiego(estado) {
  if (estado === undefined) {
    return "Cargando…";
  }
  if (estado === null) {
    return "sin riegos";
  }
  return formatearFechaCorta(estado);
}

async function cargarUltimosRiegos(lista) {
  const entradas = await Promise.all(
    lista.map(async (planta) => {
      try {
        const { ok, cuerpo } = await listarRiegos(planta._id);
        if (!ok || !Array.isArray(cuerpo) || cuerpo.length === 0) {
          return [planta._id, null];
        }
        return [planta._id, cuerpo[0].fecha];
      } catch {
        return [planta._id, null];
      }
    }),
  );
  return Object.fromEntries(entradas);
}

function Plantas({
  onSeleccionarPlanta,
  plantaIdParaFoco,
  onFocoRestaurado,
  avisoRestauracion,
  onDescartarAviso,
}) {
  const [plantas, setPlantas] = useState([]);
  const [ultimosRiegos, setUltimosRiegos] = useState({});
  const [estadoLista, setEstadoLista] = useState("cargando");
  const [errorLista, setErrorLista] = useState("");

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [errorAlta, setErrorAlta] = useState("");
  const [erroresCampo, setErroresCampo] = useState({});

  const formularioRef = useRef(null);
  const tituloRef = useRef(null);
  const plantaRefs = useRef({});
  const focoAplicadoRef = useRef(false);

  async function cargarLista() {
    setEstadoLista("cargando");
    setErrorLista("");
    try {
      const { ok, cuerpo } = await listarPlantas();
      if (!ok) {
        setPlantas([]);
        setUltimosRiegos({});
        setEstadoLista("error");
        setErrorLista(
          "No pudimos cargar las plantas. Comprueba la conexión e inténtalo de nuevo.",
        );
        return;
      }
      const lista = Array.isArray(cuerpo) ? cuerpo : [];
      setPlantas(lista);
      setUltimosRiegos({});
      setEstadoLista(lista.length === 0 ? "vacio" : "ok");
      if (lista.length > 0) {
        const mapa = await cargarUltimosRiegos(lista);
        setUltimosRiegos(mapa);
      }
    } catch {
      setPlantas([]);
      setUltimosRiegos({});
      setEstadoLista("error");
      setErrorLista(
        "No pudimos cargar las plantas. Comprueba la conexión e inténtalo de nuevo.",
      );
    }
  }

  useEffect(() => {
    cargarLista();
  }, []);

  useEffect(() => {
    if (focoAplicadoRef.current && !plantaIdParaFoco) {
      return;
    }
    if (plantaIdParaFoco) {
      const control = plantaRefs.current[plantaIdParaFoco];
      if (control) {
        control.focus();
      } else {
        tituloRef.current?.focus();
      }
      focoAplicadoRef.current = true;
      onFocoRestaurado?.();
      return;
    }
    tituloRef.current?.focus();
    focoAplicadoRef.current = true;
  }, [plantaIdParaFoco, onFocoRestaurado]);

  function actualizarCampo(campo) {
    return (evento) => {
      setFormulario((previo) => ({ ...previo, [campo]: evento.target.value }));
    };
  }

  function irAlFormulario() {
    formularioRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
    const input = formularioRef.current?.querySelector("input");
    input?.focus();
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setExito("");
    setErrorAlta("");
    setErroresCampo({});
    setEnviando(true);
    onDescartarAviso?.();

    const cuerpo = {
      nombre: formulario.nombre,
      especie: formulario.especie,
      ubicacion: formulario.ubicacion,
      intervaloRiegoDias:
        formulario.intervaloRiegoDias === ""
          ? formulario.intervaloRiegoDias
          : Number(formulario.intervaloRiegoDias),
    };

    try {
      const { ok, status, cuerpo: respuesta } = await crearPlanta(cuerpo);

      if (status === 201) {
        const nombreGuardado = respuesta?.nombre ?? formulario.nombre;
        setExito(`Planta guardada: ${nombreGuardado}.`);
        setFormulario(FORMULARIO_VACIO);
        await cargarLista();
        return;
      }

      if (status === 400 && Array.isArray(respuesta?.detalles)) {
        const porCampo = {};
        const generales = [];
        for (const detalle of respuesta.detalles) {
          const mensaje = mensajeCuidado(detalle.mensaje);
          if (CAMPOS_FORMULARIO.includes(detalle.campo)) {
            porCampo[detalle.campo] = mensaje;
          } else {
            generales.push(mensaje);
          }
        }
        setErroresCampo(porCampo);
        if (generales.length > 0) {
          setErrorAlta(generales.join(" "));
        }
        return;
      }

      setErrorAlta(
        mensajeCuidado(respuesta?.error) ||
          "No pudimos guardar la planta. Inténtalo de nuevo en un momento.",
      );
    } catch {
      setErrorAlta(
        "No pudimos guardar la planta. Comprueba la conexión e inténtalo de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="app-shell plantas">
      <header className="app-banda">
        <p className="app-marca">Invernadero Encantado</p>
        <h1 ref={tituloRef} tabIndex={-1}>
          Plantas
        </h1>
      </header>

      <main className="app-cuerpo">
        {avisoRestauracion ? (
          <Mensaje variante="error">{avisoRestauracion}</Mensaje>
        ) : null}

        <section className="plantas__seccion" aria-labelledby="titulo-lista">
          <h2 id="titulo-lista">Lista de plantas</h2>

          {estadoLista === "cargando" ? (
            <Mensaje variante="carga">Cargando plantas…</Mensaje>
          ) : null}

          {estadoLista === "error" ? (
            <Mensaje
              variante="error"
              accion={
                <button
                  type="button"
                  className="plantas__reintentar"
                  onClick={cargarLista}
                >
                  Reintentar
                </button>
              }
            >
              {errorLista}
            </Mensaje>
          ) : null}

          {estadoLista === "vacio" ? (
            <div className="plantas__vacio">
              <p>Todavía no hay plantas en el invernadero.</p>
              <button
                type="button"
                className="plantas__vacio-accion"
                onClick={irAlFormulario}
              >
                Registrar la primera planta
              </button>
            </div>
          ) : null}

          {estadoLista === "ok" ? (
            <div className="plantas__tabla-envoltorio">
              <table className="plantas__tabla">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Especie</th>
                    <th scope="col">Ubicación</th>
                    <th scope="col">Riego cada</th>
                    <th scope="col">Último riego</th>
                    <th scope="col">
                      <span className="plantas__visually-hidden">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plantas.map((planta) => (
                    <tr key={planta._id}>
                      <td data-label="Nombre">
                        <button
                          type="button"
                          className="plantas__enlace"
                          ref={(nodo) => {
                            if (nodo) {
                              plantaRefs.current[planta._id] = nodo;
                            } else {
                              delete plantaRefs.current[planta._id];
                            }
                          }}
                          onClick={() => onSeleccionarPlanta?.(planta)}
                        >
                          {planta.nombre}
                        </button>
                      </td>
                      <td data-label="Especie">{planta.especie}</td>
                      <td data-label="Ubicación">{planta.ubicacion}</td>
                      <td data-label="Riego cada">
                        <span className="intervalo-monumento">
                          {planta.intervaloRiegoDias}
                          <span className="intervalo-monumento__unidad">
                            días
                          </span>
                        </span>
                      </td>
                      <td data-label="Último riego">
                        {textoUltimoRiego(ultimosRiegos[planta._id])}
                      </td>
                      <td data-label="Acciones">
                        <Boton
                          tipo="secundario"
                          onClick={() =>
                            onSeleccionarPlanta?.(planta, { focoRiego: true })
                          }
                        >
                          Registrar riego
                        </Boton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section
          className="plantas__seccion"
          aria-labelledby="titulo-alta"
          ref={formularioRef}
        >
          <h2 id="titulo-alta">Registrar planta</h2>
          <form className="plantas__formulario" onSubmit={alEnviar} noValidate>
            {exito ? <Mensaje variante="exito">{exito}</Mensaje> : null}
            {errorAlta ? <Mensaje variante="error">{errorAlta}</Mensaje> : null}

            <Campo
              id="planta-nombre"
              etiqueta="Nombre"
              valor={formulario.nombre}
              onChange={actualizarCampo("nombre")}
              error={erroresCampo.nombre}
              autoComplete="off"
            />
            <Campo
              id="planta-especie"
              etiqueta="Especie"
              valor={formulario.especie}
              onChange={actualizarCampo("especie")}
              error={erroresCampo.especie}
              autoComplete="off"
            />
            <Campo
              id="planta-ubicacion"
              etiqueta="Ubicación"
              valor={formulario.ubicacion}
              onChange={actualizarCampo("ubicacion")}
              error={erroresCampo.ubicacion}
              autoComplete="off"
            />
            <Campo
              id="planta-intervalo"
              etiqueta="Riego cada (días)"
              tipo="number"
              min="1"
              step="1"
              valor={formulario.intervaloRiegoDias}
              onChange={actualizarCampo("intervaloRiegoDias")}
              ayuda="Escribe cada cuántos días hay que regarla. Mínimo 1."
              error={erroresCampo.intervaloRiegoDias}
            />

            <Boton type="submit" tipo="primario" deshabilitado={enviando}>
              Registrar planta
            </Boton>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Plantas;
