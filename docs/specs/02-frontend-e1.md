# Spec 02 · Frontend E1 · Plantas y riegos

- **Historias:** HU-1.5 · Listar plantas, HU-1.1 · Registrar planta, HU-1.4 · Historial de riegos, HU-1.2 · Registrar riego. Ver [docs/backlog/E1-plantas-y-riegos.md](../backlog/E1-plantas-y-riegos.md).
- **API de referencia:** [docs/specs/01-plantas-y-riegos.md](01-plantas-y-riegos.md).
- **Diseño:** [DESIGN.md](../../DESIGN.md).
- **Estado:** borrador. Todavía no se escribe código de `client/`.

## 0. Alcance

Esta spec define la interfaz web del cuidador para la épica E1. Consume los endpoints de la spec 01 a través del proxy de Vite. NO DEBE añadir endpoints nuevos en el backend.

El frontend DEBE vivir en `client/` (React + Vite). DEBE arrancar con `cd client && npm run dev`.

## 1. Pantallas y navegación

Hay **dos pantallas**. El cuidador pasa de una a otra **sin librería de rutas**: el estado de la app guarda qué pantalla se muestra y, si aplica, qué planta está seleccionada. NO DEBE usarse React Router ni ninguna otra librería de routing. NO DEBE haber URLs distintas por pantalla en este sprint.

| Pantalla | Historias | Contenido |
|---|---|---|
| **Plantas** | HU-1.5, HU-1.1 | Lista de plantas + formulario para registrar una planta |
| **Detalle de planta** | HU-1.4, HU-1.2 | Datos de la planta elegida + historial de riegos + formulario para registrar un riego |

### 1.1 Navegación

- Desde **Plantas**, al activar una planta de la lista, la app DEBE mostrar **Detalle de planta** con esa planta.
- Desde **Detalle de planta**, un control de vuelta (enlace o botón secundario) DEBE devolver a **Plantas**.
- Como no existe `GET /api/plantas/:id` (spec 01), el detalle DEBE recibir los datos de la planta desde la selección en la lista (nombre, especie, ubicación, intervalo, `_id`, `createdAt`). NO DEBE pedirse un endpoint nuevo solo para pintar el encabezado del detalle.
- Si al cargar el historial la API responde 404 (planta borrada o inexistente), el detalle DEBE mostrar el error de «planta no encontrada» y ofrecer volver a la lista.

### 1.2 Un botón primario por pantalla

Según DESIGN.md, cada pantalla DEBE tener **un solo botón primario**:

- En **Plantas:** el primario es «Registrar planta» (envío del formulario de alta).
- En **Detalle de planta:** el primario es «Registrar riego» (envío del formulario de riego).
- La vuelta a la lista DEBE ser botón secundario o enlace, nunca un segundo primario.

## 2. Pantalla «Plantas»

### 2.1 Endpoints

| Acción | Método y ruta | Cuándo |
|---|---|---|
| Cargar la lista | `GET /api/plantas` | Al entrar en la pantalla y tras un alta con éxito |
| Registrar una planta | `POST /api/plantas` | Al enviar el formulario |

El cuerpo del `POST` DEBE enviar solo los campos del formulario E1: `nombre`, `especie`, `ubicacion`, `intervaloRiegoDias`. NO DEBE exponer en esta pantalla `enReposo` ni `cuidadosEspeciales` (opcionales de la API; fuera de la UI de E1).

### 2.2 Formulario de alta

Etiquetas visibles (DESIGN.md):

| Campo API | Etiqueta en pantalla | Tipo de control |
|---|---|---|
| `nombre` | Nombre | texto |
| `especie` | Especie | texto |
| `ubicacion` | Ubicación | texto |
| `intervaloRiegoDias` | Riego cada (días) | número |

Cada campo DEBE tener un `<label>` real asociado. La ayuda del intervalo DEBE ir debajo del campo, en tono de DESIGN.md (p. ej. «Escribe cada cuántos días hay que regarla. Mínimo 1.»).

### 2.3 Lista

- DEBE mostrar nombre, especie, ubicación y «Riego cada» (días), en el orden que devuelve la API (`createdAt` ascendente).
- En escritorio DEBE ser una tabla con encabezado en `--color-primario`.
- En el móvil cada fila DEBE convertirse en una tarjeta con el nombre arriba (DESIGN.md).
- Cada planta DEBE ser activable (enlace o botón) para ir al detalle. NO DEBE usarse un `div` con `onClick` como único control de navegación.

### 2.4 Estados

| Estado | Cuándo | Cómo se muestra |
|---|---|---|
| **Cargando** | Mientras responde `GET /api/plantas` | Solo texto, p. ej. «Cargando plantas…». Sin spinner ni animación. |
| **Vacío** | `GET` responde 200 con `[]` | Borde discontinuo y una acción que lleve al formulario de alta (p. ej. «Registrar la primera planta»). |
| **Error de carga** | `GET` falla (p. ej. 500 o red) | Mensaje con fondo `--color-error-fondo`, texto `--color-error` e icono. Dice qué pasó y qué hacer (p. ej. reintentar). |
| **Lista con datos** | `GET` responde 200 con una o más plantas | Tabla / tarjetas según el ancho. |
| **Enviando** | Mientras responde `POST /api/plantas` | El botón primario DEBE quedar deshabilitado para no enviar dos veces. |
| **Éxito de alta** | `POST` responde 201 | Mensaje con fondo `--color-exito-fondo` e icono de visto, que nombra lo guardado (p. ej. «Planta guardada: Mandrágora.»). La lista DEBE recargarse y mostrar la planta nueva. El formulario DEBE limpiarse. |
| **Error de validación** | `POST` responde 400 con `detalles` | Ver sección 4. |
| **Error de alta no validación** | `POST` responde 500 u otro fallo | Mensaje de error general arriba del formulario (mismo estilo de mensaje de error). |

## 3. Pantalla «Detalle de planta»

### 3.1 Endpoints

| Acción | Método y ruta | Cuándo |
|---|---|---|
| Cargar historial | `GET /api/plantas/:id/riegos` | Al entrar en el detalle de esa planta y tras un riego con éxito |
| Registrar un riego | `POST /api/riegos` | Al enviar el formulario |

El cuerpo del `POST` DEBE incluir `planta` con el `_id` de la planta del detalle, más los campos del formulario. NO DEBE pedirse al cuidador que escriba el id a mano.

### 3.2 Encabezado

DEBE mostrar al menos el nombre de la planta como título de pantalla. DEBE poder mostrar especie, ubicación e intervalo como datos de apoyo en `--color-texto-secundario`, tomados de la planta seleccionada en la lista.

### 3.3 Formulario de riego

| Campo API | Etiqueta en pantalla | Obligatorio en UI | Tipo de control |
|---|---|---|---|
| `cantidadMl` | Cantidad (ml) | Sí | número |
| `fecha` | Fecha | No | fecha (`AAAA-MM-DD`). Si se deja vacío, la API usa ahora (spec 01 X8). |
| `cuidador` | Cuidador | No | texto |

### 3.4 Historial

- DEBE ser una lista vertical con el más reciente primero (orden de la API).
- Cada riego DEBE mostrar la fecha en negrita, formato corto en español (p. ej. «28 oct 2026»), y debajo cantidad y cuidador en `--color-texto-secundario`.
- La cantidad DEBE mostrarse como mililitros (p. ej. «500 ml»).
- Si falta `cuidador`, DEBE mostrarse «sin cuidador».

### 3.5 Estados

| Estado | Cuándo | Cómo se muestra |
|---|---|---|
| **Cargando historial** | Mientras responde `GET /api/plantas/:id/riegos` | Solo texto, p. ej. «Cargando riegos…». |
| **Vacío** | `GET` responde 200 con `[]` | Borde discontinuo y una acción hacia el formulario de riego (p. ej. «Registrar el primer riego»). |
| **Error de carga** | `GET` falla con 500 o red | Mensaje de error general (fondo e icono de error). |
| **Planta no encontrada** | `GET` responde 404 (o 400 por id inválido) | Mensaje en tono de DESIGN.md («No encontramos esa planta. Puede que se haya borrado.») y forma de volver a la lista. |
| **Historial con datos** | `GET` responde 200 con uno o más riegos | Lista vertical descrita arriba. |
| **Enviando** | Mientras responde `POST /api/riegos` | Botón primario deshabilitado. |
| **Éxito de riego** | `POST` responde 201 | Mensaje de éxito que nombra la planta (p. ej. «Riego guardado para Mandrágora.»). El historial DEBE recargarse. El formulario DEBE limpiarse (o dejar la fecha vacía para «hoy»). |
| **Error de validación** | `POST` responde 400 con `detalles` | Ver sección 4. |
| **Planta inexistente al regar** | `POST` responde 404 | Mensaje general de error (no junto a un campo): la planta no existe. |
| **Error de alta no validación** | `POST` responde 500 u otro fallo | Mensaje de error general arriba del formulario. |

## 4. Errores de validación de la API

Cuando un `POST` responde **400** con el cuerpo de la spec 01:

```json
{
  "error": "Datos no válidos",
  "detalles": [
    { "campo": "especie", "mensaje": "La especie es obligatoria" },
    { "campo": "ubicacion", "mensaje": "La ubicación es obligatoria" }
  ]
}
```

el frontend DEBE:

1. Recorrer **todos** los elementos de `detalles` (no solo el primero).
2. Para cada elemento cuyo `campo` coincida con un campo del formulario visible, mostrar el `mensaje` **junto a ese campo** (debajo del control).
3. En ese campo con error: borde de 2 px `--color-error`, y el mensaje en `--color-error` **con icono y texto** (nunca solo color).
4. Si un `campo` de `detalles` no se puede asociar a un control visible (p. ej. `planta` en el detalle, o un campo desconocido), mostrar ese mensaje **arriba del formulario**, con el estilo de mensaje de error.

Los textos mostrados DEBEN usar el `mensaje` que envía la API si ya está en tono de cuidador; si el mensaje de la API fuera técnico, el frontend DEBE sustituirlo por una frase del tono de DESIGN.md. En cualquier caso NO DEBE mostrarse «400», «ObjectId» ni «payload».

Tras un nuevo envío, los errores de validación anteriores DEBEN limpiarse antes de aplicar los nuevos (o el resultado de éxito).

## 5. Criterios de aceptación (navegador)

Se comprueban a mano en el navegador con la API en marcha y `cd client && npm run dev`. Formato DADO / CUANDO / ENTONCES.

### 5.1 Pantalla «Plantas» · Lista (HU-1.5)

- **CA-F-1.5.1 · Lista con plantas**
  DADO un invernadero con varias plantas registradas,
  CUANDO el cuidador abre la pantalla «Plantas»,
  ENTONCES DEBE ver todas las plantas con nombre, especie, ubicación e intervalo, en el orden de la API, y DEBE poder activar una para ir al detalle.

- **CA-F-1.5.2 · Lista vacía**
  DADO un invernadero sin plantas,
  CUANDO el cuidador abre «Plantas»,
  ENTONCES DEBE ver el estado vacío con borde discontinuo y una acción para registrar la primera planta. NO DEBE verse una tabla vacía sin mensaje.

- **CA-F-1.5.3 · Cargando lista**
  DADO que la petición de lista aún no ha respondido,
  CUANDO el cuidador acaba de abrir «Plantas»,
  ENTONCES DEBE ver solo un texto de carga (p. ej. «Cargando plantas…») y NO DEBE ver un spinner ni una animación.

- **CA-F-1.5.4 · Error al cargar la lista**
  DADO que `GET /api/plantas` falla,
  CUANDO el cuidador abre «Plantas»,
  ENTONCES DEBE ver un mensaje de error con fondo `--color-error-fondo`, texto `--color-error` e icono, que diga qué pasó y qué puede hacer.

- **CA-F-1.5.5 · Tras registrar una planta**
  DADO un cuidador que acaba de registrar una planta con éxito,
  CUANDO mira la lista,
  ENTONCES esa planta DEBE aparecer en la lista sin recargar la página a mano.

### 5.2 Pantalla «Plantas» · Alta (HU-1.1)

- **CA-F-1.1.1 · Registro válido**
  DADO un cuidador en «Plantas» que rellena Nombre «Mandrágora», Especie «Mandragora officinarum», Ubicación «Mesa 2» y Riego cada (días) «3»,
  CUANDO pulsa el botón primario «Registrar planta»,
  ENTONCES DEBE ver un mensaje de éxito con fondo `--color-exito-fondo` e icono de visto que nombre la planta, la lista DEBE incluirla y el formulario DEBE quedar limpio.

- **CA-F-1.1.2 · Falta un dato obligatorio**
  DADO un cuidador que deja vacío un campo obligatorio (p. ej. Especie),
  CUANDO intenta registrar la planta y la API responde 400 con un detalle en `especie`,
  ENTONCES el mensaje DEBE aparecer junto al campo Especie, con icono y color `--color-error`, el borde del campo DEBE ser de 2 px `--color-error`, y NO DEBE crearse la planta en la lista.

- **CA-F-1.1.3 · Faltan varios datos**
  DADO un cuidador que deja vacíos Especie y Ubicación,
  CUANDO intenta registrar y la API responde 400 con detalles en ambos campos,
  ENTONCES DEBE ver un mensaje de error junto a Especie y otro junto a Ubicación a la vez.

- **CA-F-1.1.4 · Intervalo no válido**
  DADO un cuidador que indica un intervalo de 0 (o no entero) y el resto de datos válidos,
  CUANDO intenta registrar y la API responde 400 con detalle en `intervaloRiegoDias`,
  ENTONCES el error DEBE mostrarse junto a «Riego cada (días)» con icono y color de error, y la planta NO DEBE aparecer en la lista.

- **CA-F-1.1.5 · Un solo primario**
  DADO la pantalla «Plantas»,
  CUANDO el cuidador la mira,
  ENTONCES DEBE haber un único botón con estilo primario (fondo `--color-primario`), el de registrar planta.

### 5.3 Navegación

- **CA-F-NAV.1 · Ida al detalle**
  DADO la lista con al menos una planta,
  CUANDO el cuidador activa esa planta,
  ENTONCES DEBE ver la pantalla «Detalle de planta» con el nombre de esa planta, sin librería de rutas y sin cambiar de aplicación.

- **CA-F-NAV.2 · Vuelta a la lista**
  DADO el cuidador en «Detalle de planta»,
  CUANDO activa el control de volver,
  ENTONCES DEBE volver a «Plantas» y DEBE seguir viendo la lista.

### 5.4 Pantalla «Detalle de planta» · Historial (HU-1.4)

- **CA-F-1.4.1 · Historial con riegos**
  DADO una planta con varios riegos,
  CUANDO el cuidador abre su detalle,
  ENTONCES DEBE ver todos los riegos del más reciente al más antiguo, con fecha en negrita (formato corto en español), cantidad en ml y cuidador (o «sin cuidador») debajo en `--color-texto-secundario`.

- **CA-F-1.4.2 · Historial vacío**
  DADO una planta sin riegos,
  CUANDO el cuidador abre su detalle,
  ENTONCES DEBE ver el estado vacío con borde discontinuo y una acción para registrar el primer riego.

- **CA-F-1.4.3 · Planta no encontrada**
  DADO un detalle cuya planta ya no existe en la API,
  CUANDO falla la carga del historial con 404,
  ENTONCES DEBE ver un mensaje claro de que no se encontró la planta (sin tecnicismos) y poder volver a la lista.

- **CA-F-1.4.4 · Cargando historial**
  DADO que el historial aún no ha respondido,
  CUANDO el cuidador acaba de abrir el detalle,
  ENTONCES DEBE ver solo texto de carga (p. ej. «Cargando riegos…»).

### 5.5 Pantalla «Detalle de planta» · Alta de riego (HU-1.2)

- **CA-F-1.2.1 · Riego de hoy**
  DADO una planta en el detalle y un cuidador que indica Cantidad (ml) válida y deja la fecha vacía,
  CUANDO pulsa «Registrar riego»,
  ENTONCES DEBE ver el mensaje de éxito que nombre la planta, el riego DEBE aparecer en el historial y el formulario DEBE limpiarse.

- **CA-F-1.2.2 · Riego con fecha pasada**
  DADO una planta registrada hace varios días,
  CUANDO el cuidador registra un riego con una fecha pasada válida y una cantidad válida,
  ENTONCES el riego DEBE aceptarse y mostrarse en el historial con esa fecha.

- **CA-F-1.2.3 · Error de cantidad**
  DADO un cuidador que indica cantidad 0 o negativa,
  CUANDO intenta registrar y la API responde 400 con detalle en `cantidadMl`,
  ENTONCES el error DEBE aparecer junto a «Cantidad (ml)» con icono y `--color-error`, y el historial NO DEBE ganar ese riego.

- **CA-F-1.2.4 · Error de fecha**
  DADO un cuidador que indica una fecha futura o anterior al registro de la planta,
  CUANDO intenta registrar y la API responde 400 con detalle en `fecha`,
  ENTONCES el error DEBE aparecer junto al campo Fecha con icono y color de error.

- **CA-F-1.2.5 · Cuidador opcional**
  DADO un riego válido sin cuidador,
  CUANDO se guarda con éxito,
  ENTONCES en el historial DEBE leerse «sin cuidador» en ese riego.

- **CA-F-1.2.6 · Un solo primario**
  DADO la pantalla «Detalle de planta»,
  CUANDO el cuidador la mira,
  ENTONCES DEBE haber un único botón primario, el de registrar riego; el control de volver NO DEBE ser primario.

### 5.6 Diseño y accesibilidad (DESIGN.md)

- **CA-F-DIS.1 · Tokens**
  DADO cualquier pantalla de E1,
  CUANDO se inspeccionan estilos de color, espacio, radio o tipografía de la UI,
  ENTONCES DEBEN usarse solo variables de `client/src/styles/tokens.css`. NO DEBE haber colores hex ni tamaños de espacio escritos a mano fuera de ese archivo de tokens.

- **CA-F-DIS.2 · Tipografía**
  DADO el título de una pantalla,
  CUANDO se muestra,
  ENTONCES DEBE usar `--fuente-titulos` a 32 px; el texto general y los campos DEBEN usar `--fuente-texto` a 16 px como mínimo; ningún texto DEBE quedar por debajo de 14 px.

- **CA-F-DIS.3 · Foco y táctil**
  DADO un campo o botón,
  CUANDO el cuidador navega con teclado o pulsa en móvil,
  ENTONCES el foco DEBE verse con contorno de 3 px en `--color-acento`, y botones y controles primarios DEBEN tener altura mínima de 44 px.

- **CA-F-DIS.4 · Errores no solo por color**
  DADO un campo con error de validación,
  CUANDO se muestra el error,
  ENTONCES DEBE haber icono y texto además del color `--color-error`.

- **CA-F-DIS.5 · Acento no en botones**
  DADO los botones de la app,
  CUANDO se miran sus colores,
  ENTONCES `--color-acento` NO DEBE usarse como fondo ni borde de botón; DEBE reservarse a enlaces y foco.

- **CA-F-DIS.6 · Sin elementos prohibidos**
  DADO la UI de E1,
  CUANDO el cuidador la usa,
  ENTONCES NO DEBE haber sombras, degradados, animaciones, modo oscuro, emojis ni imágenes decorativas.

## 6. Archivos que se crean en `client/`

Al implementar esta spec DEBEN crearse al menos estos archivos (nombres orientativos; se pueden repartir estilos por pantalla si se mantiene la misma responsabilidad):

| Archivo | Responsabilidad |
|---|---|
| `client/package.json` | Dependencias React + Vite; script `dev`. |
| `client/vite.config.js` | Proxy de `/api` hacia el backend. |
| `client/index.html` | Entrada HTML; carga de Google Fonts (Bricolage Grotesque y Atkinson Hyperlegible). |
| `client/src/main.jsx` | Montaje de React; importa los tokens una sola vez. |
| `client/src/App.jsx` | Estado de pantalla (lista / detalle) y planta seleccionada; sin librería de rutas. |
| `client/src/styles/tokens.css` | Variables de DESIGN.md (colores, fuentes, espacios, radios). |
| `client/src/styles/global.css` | Estilos base de página (fondo, tipografía por defecto, foco). |
| `client/src/api/plantas.js` | Cliente de `GET` y `POST /api/plantas`. |
| `client/src/api/riegos.js` | Cliente de `POST /api/riegos` y `GET /api/plantas/:id/riegos`. |
| `client/src/pantallas/Plantas.jsx` | Pantalla lista + formulario de alta. |
| `client/src/pantallas/DetallePlanta.jsx` | Pantalla detalle + historial + formulario de riego. |
| `client/src/componentes/Campo.jsx` | Campo con etiqueta, ayuda y hueco para error con icono. |
| `client/src/componentes/Mensaje.jsx` | Mensajes de éxito, error y (si aplica) carga reutilizables. |
| `client/src/componentes/Boton.jsx` | Botón primario y secundario según tokens. |

También DEBEN crearse los CSS asociados a pantallas o componentes que haga falta, **siempre** consumiendo tokens. NO DEBE añadirse Tailwind, Bootstrap, MUI ni hojas con valores de diseño duplicados fuera de `tokens.css`.

Archivos de configuración menores de Vite (`client/.gitignore` del paquete, etc.) se permiten si el andamiaje de Vite los genera.

## 7. No-alcance

Esta spec NO DEBE incluir:

- Librerías de UI o de CSS (Tailwind, Bootstrap, MUI, etc.).
- Librerías de rutas (React Router u otras).
- Estilos con colores, espacios o fuentes que no salgan de las variables de `tokens.css`.
- Tests automáticos del frontend (ni unitarios ni e2e). La verificación es manual en el navegador según la sección 5.
- Pantallas o consultas de E2 (plantas que necesitan agua, retraso, aviso ámbar).
- Edición o borrado de plantas o riegos.
- Campos de UI para `enReposo` o `cuidadosEspeciales`.
- Autenticación, varios invernaderos o notificaciones.
- Cambiar la API de la spec 01 (salvo un bug bloqueante descubierto al integrar; eso iría en otra spec).

## 8. Verificación

| Qué | Cómo |
|---|---|
| Criterios CA-F-* | Manual en el navegador (sección 5), con backend (`npm run dev` en la raíz) y frontend (`cd client && npm run dev`). |
| Proxy | Las peticiones del navegador a `/api/...` DEBEN llegar al backend sin CORS manual en el cliente. |
| Diseño | Contraste, tokens, un primario por pantalla, estados vacíos/carga/error/éxito según DESIGN.md. |

NO DEBE exigirse `npm test` del frontend: no hay batería de tests en `client/` en este sprint. Los tests del backend (`npm test` en la raíz) siguen siendo obligatorios si se toca código de `src/`, pero esta spec no los modifica.

## 9. Dependencias

- Spec 01 implementada y API disponible en local.
- `DESIGN.md` vigente; si al implementar esta spec hubiera que contradecirlo, DEBE actualizarse `DESIGN.md` en el mismo cambio.
