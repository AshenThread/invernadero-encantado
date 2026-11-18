import { Fragment, useEffect, useRef, useState } from "react";
import { crearPlanta, listarPlantas } from "../api/plantas.js";
import { crearRiego } from "../api/riegos.js";
import Boton from "../componentes/Boton.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
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

const MENSAJE_CANTIDAD = "La cantidad de agua debe ser mayor que 0";
const MENSAJE_CONEXION_RIEGO =
  "No pudimos guardar el riego. Comprueba la conexión e inténtalo de nuevo.";

function mensajeCuidado(mensaje, respaldo) {
  if (!mensaje || typeof mensaje !== "string") {
    return respaldo;
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

function validarCantidadRapida(valor) {
  if (valor === "" || valor === null || valor === undefined) {
    return MENSAJE_CANTIDAD;
  }
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1) {
    return MENSAJE_CANTIDAD;
  }
  return "";
}

function Plantas({ onSeleccionarPlanta }) {
  const [plantas, setPlantas] = useState([]);
  const [estadoLista, setEstadoLista] = useState("cargando");
  const [errorLista, setErrorLista] = useState("");

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [errorAlta, setErrorAlta] = useState("");
  const [erroresCampo, setErroresCampo] = useState({});

  const [panelPlantaId, setPanelPlantaId] = useState(null);
  const [cantidadRapida, setCantidadRapida] = useState("500");
  const [guardandoRiego, setGuardandoRiego] = useState(false);
  const [errorCantidadRapida, setErrorCantidadRapida] = useState("");
  const [errorRiego, setErrorRiego] = useState("");
  const [exitoRiego, setExitoRiego] = useState("");

  const formularioRef = useRef(null);
  const [esMovil, setEsMovil] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const consulta = window.matchMedia("(max-width: 767px)");
    function actualizar() {
      setEsMovil(consulta.matches);
    }
    actualizar();
    consulta.addEventListener("change", actualizar);
    return () => consulta.removeEventListener("change", actualizar);
  }, []);

  async function cargarLista() {
    setEstadoLista("cargando");
    setErrorLista("");
    try {
      const { ok, cuerpo } = await listarPlantas();
      if (!ok) {
        setPlantas([]);
        setEstadoLista("error");
        setErrorLista(
          "No pudimos cargar las plantas. Comprueba la conexión e inténtalo de nuevo.",
        );
        return;
      }
      const lista = Array.isArray(cuerpo) ? cuerpo : [];
      setPlantas(lista);
      setEstadoLista(lista.length === 0 ? "vacio" : "ok");
    } catch {
      setPlantas([]);
      setEstadoLista("error");
      setErrorLista(
        "No pudimos cargar las plantas. Comprueba la conexión e inténtalo de nuevo.",
      );
    }
  }

  useEffect(() => {
    cargarLista();
  }, []);

  function actualizarCampo(campo) {
    return (evento) => {
      setFormulario((previo) => ({ ...previo, [campo]: evento.target.value }));
    };
  }

  function irAlFormulario() {
    formularioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const input = formularioRef.current?.querySelector("input");
    input?.focus();
  }

  function abrirPanel(plantaId) {
    if (guardandoRiego) {
      return;
    }
    setPanelPlantaId(plantaId);
    setCantidadRapida("500");
    setErrorCantidadRapida("");
    setErrorRiego("");
    setExitoRiego("");
  }

  function cerrarPanel() {
    setPanelPlantaId(null);
    setCantidadRapida("500");
    setErrorCantidadRapida("");
    setErrorRiego("");
    setGuardandoRiego(false);
  }

  async function guardarRiegoRapido(evento, planta) {
    evento.preventDefault();
    setErrorCantidadRapida("");
    setErrorRiego("");
    setExitoRiego("");

    const errorLocal = validarCantidadRapida(cantidadRapida);
    if (errorLocal) {
      setErrorCantidadRapida(errorLocal);
      return;
    }

    setGuardandoRiego(true);
    try {
      const { status, cuerpo: respuesta } = await crearRiego({
        planta: planta._id,
        cantidadMl: Number(cantidadRapida),
      });

      if (status === 201) {
        cerrarPanel();
        setExitoRiego(`Riego guardado para ${planta.nombre}.`);
        return;
      }

      if (status === 400 && Array.isArray(respuesta?.detalles)) {
        const porCantidad = respuesta.detalles.find(
          (detalle) => detalle.campo === "cantidadMl",
        );
        const generales = [];
        for (const detalle of respuesta.detalles) {
          const mensaje = mensajeCuidado(detalle.mensaje, MENSAJE_CANTIDAD);
          if (detalle.campo === "cantidadMl") {
            setErrorCantidadRapida(mensaje);
          } else {
            generales.push(mensaje);
          }
        }
        if (!porCantidad && generales.length === 0) {
          setErrorCantidadRapida(MENSAJE_CANTIDAD);
        }
        if (generales.length > 0) {
          setErrorRiego(generales.join(" "));
        }
        return;
      }

      setErrorRiego(
        mensajeCuidado(
          respuesta?.error,
          "No pudimos guardar el riego. Inténtalo de nuevo en un momento.",
        ),
      );
    } catch {
      setErrorRiego(MENSAJE_CONEXION_RIEGO);
    } finally {
      setGuardandoRiego(false);
    }
  }

  function panelRiego(planta, sufijoId) {
    if (panelPlantaId !== planta._id) {
      return null;
    }

    return (
      <form
        className="plantas__riego-rapido"
        onSubmit={(evento) => guardarRiegoRapido(evento, planta)}
        noValidate
      >
        <h3 className="plantas__riego-titulo">Riego rápido</h3>
        {errorRiego ? <Mensaje variante="error">{errorRiego}</Mensaje> : null}
        <Campo
          id={`riego-rapido-${sufijoId}-${planta._id}`}
          etiqueta="Cantidad (ml)"
          tipo="number"
          min="1"
          step="1"
          valor={cantidadRapida}
          onChange={(evento) => {
            setCantidadRapida(evento.target.value);
            setErrorCantidadRapida("");
          }}
          error={errorCantidadRapida}
        />
        <div className="plantas__riego-acciones">
          <Boton type="submit" tipo="primario" deshabilitado={guardandoRiego}>
            {guardandoRiego ? "Guardando…" : "Guardar riego"}
          </Boton>
          <Boton
            tipo="secundario"
            deshabilitado={guardandoRiego}
            onClick={cerrarPanel}
          >
            Cancelar
          </Boton>
        </div>
      </form>
    );
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    setExito("");
    setErrorAlta("");
    setErroresCampo({});
    setEnviando(true);

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
      const { status, cuerpo: respuesta } = await crearPlanta(cuerpo);

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
          const mensaje = mensajeCuidado(
            detalle.mensaje,
            "No pudimos guardar la planta. Revisa los datos e inténtalo de nuevo.",
          );
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
        mensajeCuidado(
          respuesta?.error,
          "No pudimos guardar la planta. Inténtalo de nuevo en un momento.",
        ),
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
    <main className="plantas">
      <h1>Plantas</h1>

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

      <section className="plantas__seccion" aria-labelledby="titulo-lista">
        <h2 id="titulo-lista">Lista de plantas</h2>

        {exitoRiego ? <Mensaje variante="exito">{exitoRiego}</Mensaje> : null}

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

        {estadoLista === "ok" && !esMovil ? (
          <div className="plantas__tabla-envoltorio">
            <table className="plantas__tabla">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Especie</th>
                  <th scope="col">Ubicación</th>
                  <th scope="col">Riego cada</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {plantas.map((planta) => (
                  <Fragment key={planta._id}>
                    <tr>
                      <td>
                        <button
                          type="button"
                          className="plantas__enlace"
                          onClick={() => onSeleccionarPlanta?.(planta)}
                        >
                          {planta.nombre}
                        </button>
                      </td>
                      <td>{planta.especie}</td>
                      <td>{planta.ubicacion}</td>
                      <td>{planta.intervaloRiegoDias} días</td>
                      <td>
                        <Boton
                          tipo="secundario"
                          aria-label={`Regar ${planta.nombre}`}
                          deshabilitado={guardandoRiego}
                          onClick={() => abrirPanel(planta._id)}
                        >
                          Regar
                        </Boton>
                      </td>
                    </tr>
                    {panelPlantaId === planta._id ? (
                      <tr className="plantas__fila-panel">
                        <td colSpan={5}>{panelRiego(planta, "tabla")}</td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {estadoLista === "ok" && esMovil ? (
          <div className="plantas__tarjetas">
            {plantas.map((planta) => (
              <article key={planta._id} className="plantas__tarjeta">
                <h3 className="plantas__tarjeta-nombre">
                  <button
                    type="button"
                    className="plantas__enlace"
                    onClick={() => onSeleccionarPlanta?.(planta)}
                  >
                    {planta.nombre}
                  </button>
                </h3>
                <p className="plantas__tarjeta-dato">
                  Especie: {planta.especie}
                </p>
                <p className="plantas__tarjeta-dato">
                  Ubicación: {planta.ubicacion}
                </p>
                <p className="plantas__tarjeta-dato">
                  Riego cada: {planta.intervaloRiegoDias} días
                </p>
                <div className="plantas__tarjeta-accion">
                  <Boton
                    tipo="secundario"
                    aria-label={`Regar ${planta.nombre}`}
                    deshabilitado={guardandoRiego}
                    onClick={() => abrirPanel(planta._id)}
                  >
                    Regar
                  </Boton>
                </div>
                {panelRiego(planta, "tarjeta")}
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default Plantas;
