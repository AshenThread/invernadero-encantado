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

export async function listarPlantas() {
  const respuesta = await fetch("/api/plantas");
  return leerRespuesta(respuesta);
}

export async function crearPlanta(body) {
  const respuesta = await fetch("/api/plantas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return leerRespuesta(respuesta);
}
