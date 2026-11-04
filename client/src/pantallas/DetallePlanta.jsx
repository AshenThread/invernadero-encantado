import { useEffect, useRef, useState } from "react";
import { crearRiego, listarRiegos } from "../api/riegos.js";
import Boton from "../componentes/Boton.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import "./DetallePlanta.css";

const CAMPOS_FORMULARIO = ["cantidadMl", "fecha", "cuidador"];

const FORMULARIO_VACIO = {
  cantidadMl: "",
  fecha: "",
  cuidador: "",
};

const MESES_CORTO = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function formatearFechaCorta(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return "Fecha desconocida";
  }
  const dia = fecha.getDate();
  const mes = MESES_CORTO[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} ${mes} ${anio}`;
}

function mensajeCuidado(mensaje) {
  if (!mensaje || typeof mensaje !== "string") {
    return "No pudimos guardar el riego. Revisa los datos e inténtalo de nuevo.";
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

function DetallePlanta({ planta, onVolver }) {
  const [riegos, setRiegos] = useState([]);
  const [estadoHistorial, setEstadoHistorial] = useState("cargando");
  const [errorHistorial, setErrorHistorial] = useState("");

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [errorAlta, setErrorAlta] = useState("");
  const [erroresCampo, setErroresCampo] = useState({});

  const formularioRef = useRef(null);

  async function cargarHistorial() {
    setEstadoHistorial("cargando");
    setErrorHistorial("");
    try {
      const { ok, status, cuerpo } = await listarRiegos(planta._id);

      if (status === 404 || status === 400) {
        setRiegos([]);
        setEstadoHistorial("no-encontrada");
        return;
      }

      if (!ok) {
        setRiegos([]);
        setEstadoHistorial("error");
        setErrorHistorial(
          "No pudimos cargar los riegos. Comprueba la conexión e inténtalo de nuevo.",
        );
        return;
      }

      const lista = Array.isArray(cuerpo) ? cuerpo : [];
      setRiegos(lista);
      setEstadoHistorial(lista.length === 0 ? "vacio" : "ok");
    } catch {
      setRiegos([]);
      setEstadoHistorial("error");
      setErrorHistorial(
        "No pudimos cargar los riegos. Comprueba la conexión e inténtalo de nuevo.",
      );
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, [planta._id]);

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

  async function alEnviar(evento) {
    evento.preventDefault();
    setExito("");
    setErrorAlta("");
    setErroresCampo({});
    setEnviando(true);

    const cuerpo = {
      planta: planta._id,
      cantidadMl:
        formulario.cantidadMl === ""
          ? formulario.cantidadMl
          : Number(formulario.cantidadMl),
    };
    if (formulario.fecha) {
      cuerpo.fecha = formulario.fecha;
    }
    if (formulario.cuidador.trim()) {
      cuerpo.cuidador = formulario.cuidador;
    }

    try {
      const { status, cuerpo: respuesta } = await crearRiego(cuerpo);

      if (status === 201) {
        setExito(`Riego guardado para ${planta.nombre}.`);
        setFormulario(FORMULARIO_VACIO);
        await cargarHistorial();
        return;
      }

      if (status === 404) {
        setErrorAlta("No encontramos esa planta. Puede que se haya borrado.");
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
          "No pudimos guardar el riego. Inténtalo de nuevo en un momento.",
      );
    } catch {
      setErrorAlta(
        "No pudimos guardar el riego. Comprueba la conexión e inténtalo de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (estadoHistorial === "no-encontrada") {
    return (
      <main className="detalle">
        <div className="detalle__volver">
          <Boton tipo="secundario" onClick={onVolver}>
            Volver a plantas
          </Boton>
        </div>
        <Mensaje
          variante="error"
          accion={
            <button
              type="button"
              className="detalle__enlace-volver"
              onClick={onVolver}
            >
              Volver a la lista
            </button>
          }
        >
          <p className="detalle__no-encontrada">
            No encontramos esa planta. Puede que se haya borrado.
          </p>
        </Mensaje>
      </main>
    );
  }

  return (
    <main className="detalle">
      <div className="detalle__volver">
        <Boton tipo="secundario" onClick={onVolver}>
          Volver a plantas
        </Boton>
      </div>

      <h1>{planta.nombre}</h1>
      <div className="detalle__apoyo">
        <p>Especie: {planta.especie}</p>
        <p>Ubicación: {planta.ubicacion}</p>
        <p>Riego cada {planta.intervaloRiegoDias} días</p>
      </div>

      <section
        className="detalle__seccion"
        aria-labelledby="titulo-riego"
        ref={formularioRef}
      >
        <h2 id="titulo-riego">Registrar riego</h2>
        <form className="detalle__formulario" onSubmit={alEnviar} noValidate>
          {exito ? <Mensaje variante="exito">{exito}</Mensaje> : null}
          {errorAlta ? <Mensaje variante="error">{errorAlta}</Mensaje> : null}

          <Campo
            id="riego-cantidad"
            etiqueta="Cantidad (ml)"
            tipo="number"
            min="1"
            step="1"
            valor={formulario.cantidadMl}
            onChange={actualizarCampo("cantidadMl")}
            error={erroresCampo.cantidadMl}
          />
          <Campo
            id="riego-fecha"
            etiqueta="Fecha"
            tipo="date"
            valor={formulario.fecha}
            onChange={actualizarCampo("fecha")}
            ayuda="Si la dejas vacía, se registra con la fecha de hoy."
            error={erroresCampo.fecha}
          />
          <Campo
            id="riego-cuidador"
            etiqueta="Cuidador"
            valor={formulario.cuidador}
            onChange={actualizarCampo("cuidador")}
            error={erroresCampo.cuidador}
            autoComplete="name"
          />

          <Boton type="submit" tipo="primario" deshabilitado={enviando}>
            Registrar riego
          </Boton>
        </form>
      </section>

      <section className="detalle__seccion" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de riegos</h2>

        {estadoHistorial === "cargando" ? (
          <Mensaje variante="carga">Cargando riegos…</Mensaje>
        ) : null}

        {estadoHistorial === "error" ? (
          <Mensaje
            variante="error"
            accion={
              <button
                type="button"
                className="detalle__reintentar"
                onClick={cargarHistorial}
              >
                Reintentar
              </button>
            }
          >
            {errorHistorial}
          </Mensaje>
        ) : null}

        {estadoHistorial === "vacio" ? (
          <div className="detalle__vacio">
            <p>Todavía no hay riegos para esta planta.</p>
            <button
              type="button"
              className="detalle__vacio-accion"
              onClick={irAlFormulario}
            >
              Registrar el primer riego
            </button>
          </div>
        ) : null}

        {estadoHistorial === "ok" ? (
          <ul className="detalle__historial">
            {riegos.map((riego) => (
              <li key={riego._id} className="detalle__riego">
                <strong className="detalle__riego-fecha">
                  {formatearFechaCorta(riego.fecha)}
                </strong>
                <p className="detalle__riego-detalle">
                  {riego.cantidadMl} ml ·{" "}
                  {riego.cuidador?.trim() ? riego.cuidador : "sin cuidador"}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

export default DetallePlanta;
