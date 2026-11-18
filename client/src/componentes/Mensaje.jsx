import "./Mensaje.css";

function Pictograma({ children, variante }) {
  return (
    <span
      className={`mensaje__pictograma mensaje__pictograma--${variante}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function IconoVisto() {
  return (
    <Pictograma variante="exito">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8.5 6.5 12 13 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </Pictograma>
  );
}

function IconoError() {
  return (
    <Pictograma variante="error">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </Pictograma>
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
