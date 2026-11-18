const MENSAJE_INTERVALO_ENTERO =
  "El intervalo de riego debe ser un número entero de días";

function textoVacio(valor) {
  return typeof valor !== "string" || valor.trim() === "";
}

function validarPlanta(datos = {}) {
  const detalles = [];
  const { nombre, especie, ubicacion, intervaloRiegoDias } = datos;

  if (textoVacio(nombre)) {
    detalles.push({ campo: "nombre", mensaje: "El nombre es obligatorio" });
  }
  if (textoVacio(especie)) {
    detalles.push({ campo: "especie", mensaje: "La especie es obligatoria" });
  }
  if (textoVacio(ubicacion)) {
    detalles.push({
      campo: "ubicacion",
      mensaje: "La ubicación es obligatoria",
    });
  }

  if (intervaloRiegoDias === undefined || intervaloRiegoDias === null) {
    detalles.push({
      campo: "intervaloRiegoDias",
      mensaje: "El intervalo de riego es obligatorio",
    });
  } else if (
    typeof intervaloRiegoDias !== "number" ||
    !Number.isInteger(intervaloRiegoDias)
  ) {
    detalles.push({
      campo: "intervaloRiegoDias",
      mensaje: MENSAJE_INTERVALO_ENTERO,
    });
  } else if (intervaloRiegoDias < 1) {
    detalles.push({
      campo: "intervaloRiegoDias",
      mensaje: "El intervalo de riego debe ser de al menos 1 día",
    });
  }

  return detalles;
}

module.exports = { validarPlanta };
