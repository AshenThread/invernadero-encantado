# Spec 07 · Registrar un riego rápido desde la lista

- **Historia:** HU-1.8 · Registrar un riego rápido desde la lista.
- **Objetivo:** desde la lista de plantas, abrir un panel de riego rápido (cantidad sugerida 500 ml, fecha hoy, sin cuidador), guardar con `POST /api/riegos` y ver el resultado sin abrir el detalle.

### Reglas

- **DEBE** mostrar en cada fila/tarjeta de la lista un botón secundario «Regar» con nombre accesible que incluya el de la planta (p. ej. «Regar Mandrágora»).
- **DEBE** abrir bajo esa fila un panel «Riego rápido» con «Cantidad (ml)» precargada en 500, «Guardar riego» (primario) y «Cancelar» (secundario); sin campos de fecha ni cuidador.
- **DEBE** permitir solo un panel abierto a la vez: al abrir otro se cierra el anterior.
- **DEBE** enviar el riego a `POST /api/riegos` con la planta de la fila, la cantidad indicada y la fecha de hoy.
- **DEBE** en éxito cerrar el panel y mostrar en la lista el mensaje «Riego guardado para [nombre].»
- **DEBE** en validación (p. ej. cantidad 0) mantener el panel abierto y mostrar junto al campo «La cantidad de agua debe ser mayor que 0».
- **DEBE** en fallo de red mantener el panel abierto, dejar de mostrar «Guardando…» y mostrar un mensaje de conexión que diga qué pasó y que puede intentarlo de nuevo.
- **DEBE** mientras guarda mostrar «Guardando…» en el botón primario y deshabilitarlo.
- **NO DEBE** cambiar el backend ni el contrato de `POST /api/riegos`.
- **NO DEBE** cambiar el formulario «Registrar una planta».

### Criterios de aceptación

- **CA-07.1** (CA-1.8.1): DADO al menos una planta en la lista, CUANDO el cuidador mira la lista, ENTONCES cada fila muestra «Regar» sin abrir el detalle.
- **CA-07.2** (CA-1.8.2): DADO «Mandrágora» en la lista, CUANDO pulsa «Regar Mandrágora», ENTONCES se abre el panel con 500 ml, «Guardar riego» y «Cancelar»; si había otro panel, se cierra.
- **CA-07.3** (CA-1.8.3): DADO el panel abierto con cantidad válida, CUANDO pulsa «Guardar riego», ENTONCES el botón dice «Guardando…» y queda deshabilitado hasta que termine la petición.
- **CA-07.4** (CA-1.8.4): DADO el panel de Mandrágora con 500 ml, CUANDO la API acepta el riego, ENTONCES el panel se cierra y aparece «Riego guardado para Mandrágora.»
- **CA-07.5** (CA-1.8.5): DADO el panel abierto, CUANDO pone 0 en «Cantidad (ml)» y guarda, ENTONCES el panel sigue abierto y junto al campo aparece «La cantidad de agua debe ser mayor que 0».
- **CA-07.6** (CA-1.8.6): DADO el panel abierto con cantidad válida, CUANDO falla la red o la API, ENTONCES el panel sigue abierto y aparece un error de conexión accionable.
- **CA-07.7** (CA-1.8.7): DADO la lista a 390 px, CUANDO abre el panel, ENTONCES «Regar», el panel, el campo y los botones caben sin scroll horizontal y las zonas táctiles miden al menos 44 px.

### Pantallas

La estructura sale del wireframe, el estilo de DESIGN.md y el comportamiento de los criterios.

| Estado | Wireframe |
| --- | --- |
| Lista con «Regar» | `docs/specs/07-riego-rapido/wireframes/lista-movil.svg`, `lista-escritorio.svg` |
| Panel abierto | `docs/specs/07-riego-rapido/wireframes/panel-abierto-movil.svg`, `panel-abierto-escritorio.svg` |
| Guardando | `docs/specs/07-riego-rapido/wireframes/guardando-movil.svg` |
| Éxito | `docs/specs/07-riego-rapido/wireframes/exito-movil.svg` |
| Error de validación | `docs/specs/07-riego-rapido/wireframes/error-validacion-movil.svg` |
| Error de conexión | `docs/specs/07-riego-rapido/wireframes/error-conexion-movil.svg` |

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-07.1 a CA-07.7 | Capturas a 390 px (y 1280 px donde haya wireframe de escritorio) en `docs/specs/07-riego-rapido/capturas/`, comparadas con su wireframe; comprobación en el navegador. El frontend no tiene tests automáticos (como en la spec 02). |
| Regresión API | `npm test` debe seguir pasando |

### Archivos

`client/src/pantallas/Plantas.jsx` · `client/src/pantallas/Plantas.css` · `client/src/api/riegos.js` (si hace falta reutilizarlo desde la lista) · componentes de formulario/mensaje existentes en `client/src/componentes/` si se reutilizan
