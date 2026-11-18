import "./Boton.css";

function IconoFlecha() {
  return (
    <span className="boton__pictograma" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h9M8 3.5 12.5 8 8 12.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </span>
  );
}

function Boton({
  children,
  tipo = "primario",
  deshabilitado = false,
  onClick,
  type = "button",
  conPictograma = true,
}) {
  const clase =
    tipo === "secundario" ? "boton boton--secundario" : "boton boton--primario";

  return (
    <button
      type={type}
      className={clase}
      disabled={deshabilitado}
      onClick={onClick}
    >
      {conPictograma ? <IconoFlecha /> : null}
      <span className="boton__texto">{children}</span>
    </button>
  );
}

export default Boton;
