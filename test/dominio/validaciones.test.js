const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { validarPlanta } = require("../../src/dominio/validaciones");

function datosValidos() {
  return {
    nombre: "Mandrágora",
    especie: "Mandragora officinarum",
    ubicacion: "Mesa 2",
    intervaloRiegoDias: 3,
  };
}

describe("validarPlanta", () => {
  test("CA-04.1: una planta con los cuatro datos válidos no tiene detalles", () => {
    assert.deepEqual(validarPlanta(datosValidos()), []);
  });

  test("CA-04.2: sin especie e intervalo 0 devuelve los dos detalles en orden", () => {
    const datos = datosValidos();
    delete datos.especie;
    datos.intervaloRiegoDias = 0;
    assert.deepEqual(validarPlanta(datos), [
      { campo: "especie", mensaje: "La especie es obligatoria" },
      {
        campo: "intervaloRiegoDias",
        mensaje: "El intervalo de riego debe ser de al menos 1 día",
      },
    ]);
  });

  test("CA-04.3: un nombre con solo espacios es obligatorio", () => {
    const detalles = validarPlanta({ ...datosValidos(), nombre: "   " });
    assert.deepEqual(detalles, [
      { campo: "nombre", mensaje: "El nombre es obligatorio" },
    ]);
  });

  for (const intervalo of [2.5, "tres"]) {
    test(`CA-04.4: rechaza el intervalo ${intervalo} por no ser entero`, () => {
      const detalles = validarPlanta({
        ...datosValidos(),
        intervaloRiegoDias: intervalo,
      });
      assert.deepEqual(detalles, [
        {
          campo: "intervaloRiegoDias",
          mensaje: "El intervalo de riego debe ser un número entero de días",
        },
      ]);
    });
  }
});
