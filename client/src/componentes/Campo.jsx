import "./Campo.css";

function IconoError() {
  return (
    <svg
      className="campo__icono"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 4.5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function Campo({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onChange,
  ayuda,
  error,
  min,
  step,
  required,
  autoComplete,
}) {
  const errorId = error ? `${id}-error` : undefined;
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const descritoPor = [ayudaId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`campo${error ? " campo--error" : ""}`}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <input
        id={id}
        className="campo__control"
        type={tipo}
        value={valor}
        onChange={onChange}
        min={min}
        step={step}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor}
      />
      {ayuda ? (
        <p id={ayudaId} className="campo__ayuda">
          {ayuda}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="campo__error" role="alert">
          <IconoError />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export default Campo;
