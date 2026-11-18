# Spec 04 · Rediseño visual (mundo nuevo)

- **Fuente:** plan de rediseño visual; flujo Impeccable new-work (modo Operate, code-led).
- **Diseño:** el `DESIGN.md` vigente es anti-referencia hasta el finish; el documenter lo reescribe al cerrar el build.
- **Spec base:** [02-frontend-e1.md](02-frontend-e1.md). Refina/sustituye el freeze visual de [03-pulido-frontend.md](03-pulido-frontend.md).
- **Estado:** en implementación.

## 0. Objetivo

Reemplazar el mundo visual del frontend E1 (paleta, tipografía, densidad, atmósfera e interacción firma) sin cambiar flujos de producto, endpoints ni criterios de comportamiento ya comprometidos en las specs 02 y 03.

## 1. Criterios de aceptación

### CA-V.1 · Comportamiento E1 intacto

DADO el frontend E1 tras el rediseño,
CUANDO el cuidador usa lista, alta de planta, detalle, historial y alta de riego,
ENTONCES DEBEN seguir cumpliéndose los criterios CA-F-* de la spec 02 y los CA-P.1–CA-P.7, CA-P.9 y CA-P.10 de la spec 03 (lista antes que alta; último riego; marca «Invernadero Encantado»; control de riego en fila; restauración de detalle; historial antes que formulario de riego; foco al cambiar de pantalla; espaciados solo con tokens; un solo markup de lista).

### CA-V.2 · Mundo visual nuevo

DADO `client/src/styles/tokens.css` y los estilos de pantallas/componentes,
CUANDO se inspecciona el sistema visual,
ENTONCES la paleta, las fuentes y la atmósfera DEBEN corresponder a la dirección elegida en la ronda Impeccable (no al mundo previo verde/violeta + Bricolage/Atkinson). Los colores y tipografías DEBEN vivir en tokens; contraste de texto ≥ 4.5:1.

### CA-V.3 · Motion con respeto a reduced-motion (sustituye CA-P.8)

DADO interacciones de transición, feedback de éxito/primario u otra firma de motion,
CUANDO el cuidador las percibe,
ENTONCES DEBE haber al menos una interacción firma documentada en el direction contract / DESIGN.md, y TODA animación o scroll suave DEBE respetar `prefers-reduced-motion: reduce` (sin motion o con cambio instantáneo). El scroll hacia formularios desde CTAs vacíos NO DEBE usar `behavior: "smooth"` de forma incondicional. NO DEBE haber spinners genéricos como único indicador de carga (la carga sigue siendo texto, según el tono del producto).

### CA-V.4 · Sin ampliar producto

DADO este rediseño,
CUANDO se revisa el alcance,
ENTONCES NO DEBE haber endpoints nuevos, cambios de backend, UI de E2, React Router, modo oscuro, librerías de UI/CSS, emojis ni assets de marca inventados.

### CA-V.5 · DESIGN.md al finish

DADO el build cerrado y aprobado en finish review,
CUANDO termina la corrida,
ENTONCES `DESIGN.md` DEBE describir el mundo construido (tokens, componentes, motion, a11y), no el sistema anterior.

## 2. Relación con la spec 03

- Esta spec **autoriza** cambios de fuentes, colores, radios, sombras, degradados y motion que la §3 de la spec 03 prohibía.
- El criterio **CA-P.8** de la spec 03 queda **sustituido** por **CA-V.3**.
- El resto de CA-P.* de comportamiento sigue vigente.

## 3. No-alcance

- Backend (`src/`), nuevos endpoints, contratos de la spec 01.
- UI de E2 (plantas que necesitan agua, días de atraso).
- Edición/borrado de plantas o riegos; cuentas; varios invernaderos.
- Pulido del mundo visual viejo en paralelo (no mezclar identidades).

## 4. Dependencias

- Specs 02 y 03 implementadas en comportamiento.
- PRODUCT.md y ronda de dirección Impeccable (`concept-seed --scope direction --mode operate`).
- API de la spec 01 disponible en local para humo de flujos.
