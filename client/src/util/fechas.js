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

export function formatearFechaCorta(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return "Fecha desconocida";
  }
  const dia = fecha.getDate();
  const mes = MESES_CORTO[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} ${mes} ${anio}`;
}
