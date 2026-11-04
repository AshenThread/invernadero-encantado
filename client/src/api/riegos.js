async function leerRespuesta(respuesta) {
  let cuerpo = null;
  const texto = await respuesta.text();
  if (texto) {
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      cuerpo = { error: texto };
    }
  }
  return { ok: respuesta.ok, status: respuesta.status, cuerpo };
}

export async function listarRiegos(plantaId) {
  const respuesta = await fetch(`/api/plantas/${plantaId}/riegos`);
  return leerRespuesta(respuesta);
}

export async function crearRiego(body) {
  const respuesta = await fetch("/api/riegos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return leerRespuesta(respuesta);
}
