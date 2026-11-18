# Wireframes · Spec 07 · Riego rápido

Historia: **HU-1.8 · Registrar un riego rápido desde la lista**.

## Estados

| Estado | Archivos | Criterios |
|---|---|---|
| Lista con «Regar» | `lista-movil.svg`, `lista-escritorio.svg` | CA-1.8.1 |
| Panel abierto | `panel-abierto-movil.svg`, `panel-abierto-escritorio.svg` | CA-1.8.2, CA-1.8.7 |
| Guardando | `guardando-movil.svg` | CA-1.8.3 |
| Éxito | `exito-movil.svg` | CA-1.8.4 |
| Error de validación | `error-validacion-movil.svg` | CA-1.8.5 |
| Error de conexión | `error-conexion-movil.svg` | CA-1.8.6 |

## Cobertura de criterios

| Criterio | Wireframe(s) |
|---|---|
| CA-1.8.1 | lista-movil, lista-escritorio |
| CA-1.8.2 | panel-abierto-movil, panel-abierto-escritorio |
| CA-1.8.3 | guardando-movil |
| CA-1.8.4 | exito-movil |
| CA-1.8.5 | error-validacion-movil |
| CA-1.8.6 | error-conexion-movil |
| CA-1.8.7 | panel-abierto-movil (ancho 390 px) |

Todos los criterios CA-1.8.1–CA-1.8.7 aparecen en al menos un wireframe.

## Decisiones

Estas decisiones las toman los wireframes; los criterios no las fijan:

1. **Dónde va «Regar»:** en móvil, dentro de cada tarjeta de planta, debajo de ubicación/intervalo; en escritorio, columna «Acción» a la derecha de la fila.
2. **Botón primario:** «Regar» es **secundario** (borde, sin relleno) en cada fila, para no tener varios primarios a la vez. El único primario del panel es **«Guardar riego»**. En la página, el primario del alta sigue siendo «Registrar planta» (fuera del alcance visual de estos estados de lista/panel).
3. **Título del panel:** «Riego rápido», bajo la fila/tarjeta de la planta abierta.
4. **Éxito:** el mensaje «Riego guardado para Mandrágora.» va **arriba de la lista**, no dentro de la fila; el panel ya está cerrado.
5. **Error de conexión:** mensaje arriba dentro del panel (sigue abierto), con el texto de tono DESIGN.md: qué pasó y qué hacer.
6. **Error de validación:** borde del campo más marcado y mensaje justo debajo de «Cantidad (ml)»; el panel no se cierra.
7. **Un solo panel:** en «panel abierto» solo Mandrágora muestra el formulario; Aconito solo tiene «Regar».
