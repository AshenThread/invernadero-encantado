import "./Boton.css";

function Boton({
  children,
  tipo = "primario",
  deshabilitado = false,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}) {
  const clase =
    tipo === "secundario" ? "boton boton--secundario" : "boton boton--primario";

  return (
    <button
      type={type}
      className={clase}
      disabled={deshabilitado}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Boton;
