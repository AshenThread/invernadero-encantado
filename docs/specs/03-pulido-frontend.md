# Spec 03 · Pulido frontend E1

- **Fuente:** [docs/diagnostico-diseno.md](../diagnostico-diseno.md) (hallazgos H-1 … H-10).
- **Diseño:** [DESIGN.md](../../DESIGN.md).
- **Spec base:** [docs/specs/02-frontend-e1.md](02-frontend-e1.md) — esta spec la refina; NO DEBE contradecirla.
- **Estado:** borrador. Todavía no se escribe código de `client/` bajo esta spec.

## 0. Objetivo

Corregir en el frontend los hallazgos del diagnóstico (jerarquía, datos en lista, marca, fricción de riego, persistencia ligera, foco, scroll, tokens y markup de lista) sin romper los criterios CA-F-* de la spec 02 ni ampliar el backend.

## 1. Criterios de aceptación

### CA-P.1 · Lista antes que alta (H-1)

DADO la pantalla «Plantas» en un viewport de 390 px de ancho con al menos una planta cargada,
CUANDO el cuidador ve el primer viewport sin hacer scroll,
ENTONCES la lista de plantas (o su estado de carga / vacío / error) DEBE ser visible en ese primer viewport, y el formulario «Registrar planta» NO DEBE ocupar por completo el primer viewport por encima de la lista.

### CA-P.2 · Último riego en la lista (H-2)

DADO la lista de plantas con datos cargados,
CUANDO el cuidador mira cada fila o tarjeta,
ENTONCES DEBE ver, además de nombre, especie, ubicación e intervalo, la fecha del riego más reciente en formato corto en español, o el texto «sin riegos» si la planta no tiene historial. Esos datos DEBEN obtenerse solo con los endpoints de la spec 01 (p. ej. `GET /api/plantas/:id/riegos`). NO DEBE exigirse un endpoint nuevo ni cambios en el backend. NO DEBE mostrarse aún el cálculo de días de atraso de E2 (reservado a otra spec).

### CA-P.3 · Marca en el cuerpo (H-3)

DADO cualquier pantalla de E1 montada,
CUANDO el cuidador mira el encabezado de la página (no solo la pestaña del navegador),
ENTONCES el texto «Invernadero Encantado» DEBE aparecer en el cuerpo del documento, con tipografía y color de `tokens.css` / DESIGN.md, sin competir como botón primario ni como único `h1` de la planta en el detalle.

### CA-P.4 · Menos fricción para regar (H-4)

DADO la lista con al menos una planta,
CUANDO el cuidador quiere registrar un riego de esa planta,
ENTONCES DEBE existir un control en la fila o tarjeta (además del acceso al detalle) que lleve al flujo de riego de esa planta. Ese control NO DEBE ser un segundo botón primario en «Plantas» (el primario DEBE seguir siendo «Registrar planta»). NO DEBE añadir pantallas ni rutas nuevas respecto a la spec 02: el alta de riego DEBE seguir ocurriendo en «Detalle de planta».

### CA-P.5 · Recuperar el detalle tras interrupción (H-5)

DADO el cuidador en «Detalle de planta» de una planta concreta,
CUANDO recarga la página en el mismo origen sin cambiar de URL (sigue sin haber URLs distintas por pantalla, spec 02 §1.1),
ENTONCES la app DEBE volver a mostrar el detalle de esa misma planta si sigue existiendo en la lista cargada, o la lista «Plantas» con un mensaje claro si ya no existe. NO DEBE introducirse React Router ni rutas por planta en este sprint.

### CA-P.6 · Historial antes que formulario de riego (H-6)

DADO la pantalla «Detalle de planta» en un viewport de 390 px de ancho,
CUANDO el cuidador ve el contenido principal sin hacer scroll (tras el encabezado de la planta y el control de volver),
ENTONCES el historial de riegos (o su estado de carga / vacío / error) DEBE aparecer antes que el formulario «Registrar riego» en el orden del documento. El único botón primario DEBE seguir siendo «Registrar riego».

### CA-P.7 · Foco al cambiar de pantalla (H-7)

DADO el cuidador que navega de «Plantas» a «Detalle de planta» activando una planta, o de «Detalle» a «Plantas» con el control de volver,
CUANDO termina la transición de pantalla,
ENTONCES el foco NO DEBE quedar en `body`. DEBE moverse al `h1` de la pantalla de destino (con `tabIndex={-1}` si hace falta) o, al volver a la lista, al control de la planta que se activó o al encabezado de la lista. El nuevo destino DEBE ser anunciable por teclado / lector de pantalla.

### CA-P.8 · Scroll sin animación prohibida (H-8)

DADO un CTA de estado vacío que desplaza la vista hacia un formulario (en Plantas o Detalle),
CUANDO el cuidador lo activa,
ENTONCES el desplazamiento NO DEBE usar `behavior: "smooth"`. DEBE ser instantáneo (`auto`) o, si se mantiene smooth, solo cuando `prefers-reduced-motion: no-preference`. NO DEBE introducirse ninguna otra animación, transición decorativa ni spinner.

### CA-P.9 · Espaciados solo con tokens (H-9)

DADO los estilos de `client/src` usados por la UI E1,
CUANDO se inspeccionan márgenes, gaps, paddings y offsets de espacio (incluido el ajuste de iconos en errores y el `outline-offset` del foco),
ENTONCES DEBEN resolverse solo mediante variables de `client/src/styles/tokens.css` (añadiendo un token micro si hace falta, p. ej. alineado a 2 px). NO DEBE quedar un `2px` (u otro valor de espacio) escrito a mano fuera de `tokens.css`.

### CA-P.10 · Una sola representación de la lista (H-10)

DADO la pantalla «Plantas» con N plantas en estado ok,
CUANDO se inspecciona el DOM de la lista,
ENTONCES NO DEBE haber a la vez una tabla completa y un juego completo de tarjetas montados para las mismas N plantas. DEBE haber un único markup de lista que, en escritorio, se presente como tabla con encabezado `--color-primario` y, en móvil (≤767 px), como tarjetas con el nombre arriba, según DESIGN.md y spec 02 §2.3.

## 2. Tabla de verificación e implementación

| Criterio | Cómo se verifica | Comando Impeccable |
|---|---|---|
| CA-P.1 | Navegador a 390 px: primer viewport muestra lista (o su estado), no solo el alta. Revisión contra DESIGN.md Principios §1. | `/impeccable layout` |
| CA-P.2 | Navegador: cada fila/tarjeta muestra fecha de último riego o «sin riegos». Audit de copy/datos; sin endpoint nuevo. | `/impeccable clarify` |
| CA-P.3 | Navegador + revisión contra DESIGN.md / PRODUCT: «Invernadero Encantado» visible en el cuerpo. | `/impeccable polish` |
| CA-P.4 | Navegador: control en fila hacia riego; un solo primario en Plantas; alta de riego sigue en Detalle (spec 02). | `/impeccable distill` |
| CA-P.5 | Navegador: abrir detalle → recargar → mismo detalle (o lista si la planta desapareció); sin rutas nuevas. | `/impeccable harden` |
| CA-P.6 | Navegador a 390 px: historial (o su estado) antes del formulario de riego en el DOM. DESIGN.md Principios §1. | `/impeccable layout` |
| CA-P.7 | Navegador + teclado: tras ida/vuelta, `document.activeElement` no es `body`; foco en `h1` o control restaurado. Audit a11y. | `/impeccable harden` |
| CA-P.8 | Navegador + revisión de código: sin `scrollIntoView({ behavior: "smooth" })` incondicional. `detect` / audit; DESIGN «No hacemos: Animaciones». | `/impeccable polish` |
| CA-P.9 | Revisión contra DESIGN.md Tokens + `detect` / audit: ningún espacio hard-coded fuera de `tokens.css`. | `/impeccable polish` |
| CA-P.10 | Navegador + inspección DOM (escritorio y 390 px): una sola estructura de lista; tabla o tarjetas según ancho. Audit / `detect`. | `/impeccable optimize` |

Tras implementar un bloque, re-ejecutar `npx impeccable detect client/src` y `npx impeccable detect http://localhost:5173` como humo (cero hallazgos del detector no cierra el criterio: mandan la columna «Cómo se verifica»).

## 3. No-alcance

Esta spec NO DEBE incluir:

- Comandos o trabajo de **`/impeccable animate`**, **`/impeccable delight`**, **`/impeccable overdrive`** o **`/impeccable bolder`**.
- Fuentes, colores, radios, sombras, degradados, emojis, imágenes o efectos fuera de [DESIGN.md](../../DESIGN.md) / `tokens.css`.
- Cambios en el backend (`src/`), nuevos endpoints, o alterar contratos de la [spec 01](01-plantas-y-riegos.md).
- Cualquier cambio que haga dejar de cumplirse un criterio CA-F-* de la [spec 02](02-frontend-e1.md) (un primario por pantalla, sin librería de rutas, estados, tokens, labels, historial, etc.).
- UI de E2 (plantas que necesitan agua, días de retraso, `--color-aviso` en producto).
- Edición o borrado de plantas o riegos; cuentas; varios invernaderos.

## 4. Dependencias

- Spec 02 implementada en `client/`.
- Diagnóstico vigente en [docs/diagnostico-diseno.md](../diagnostico-diseno.md).
- API de la spec 01 disponible en local para verificar CA-P.2 y los flujos de riego.
