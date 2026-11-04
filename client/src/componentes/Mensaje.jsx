import "./Mensaje.css";

function IconoVisto() {
  return (
    <svg
      className="mensaje__icono"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 10.5 8 14.5 16 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoError() {
  return (
    <svg
      className="mensaje__icono"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M10 6v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

function Mensaje({ variante = "carga", children, accion }) {
  const clase = `mensaje mensaje--${variante}`;

  return (
    <div
      className={clase}
      role={
        variante === "error"
          ? "alert"
          : variante === "exito"
            ? "status"
            : undefined
      }
    >
      <div className="mensaje__contenido">
        {variante === "exito" ? <IconoVisto /> : null}
        {variante === "error" ? <IconoError /> : null}
        <div className="mensaje__texto">{children}</div>
      </div>
      {accion ? <div className="mensaje__accion">{accion}</div> : null}
    </div>
  );
}

export default Mensaje;
