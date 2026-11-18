# E1 · Plantas y riegos — Historias de usuario

Épica: [epicas.md](epicas.md#e1--plantas-y-riegos). Fuente: [docs/prd/invernadero-mvp.md](../prd/invernadero-mvp.md). Los números de alcance (§4), no-alcance (§5), reglas (§6), supuestos (§7) y puntos abiertos (§8) son los del PRD.

El único rol del MVP es el **cuidador** (§2).

## Decisiones del cliente (2026-10-28)

Estas decisiones resuelven casos borde de HU-1.1 y HU-1.2. Ya están incorporadas al PRD:

| # | Decisión | En el PRD |
|---|---|---|
| D1 | No se puede registrar un riego de una planta que no existe. | Regla 6.9. Confirma CA-1.2.5. |
| D2 | La cantidad de agua de un riego debe ser mayor que 0. | §4.2 y regla 6.10. Se quitó del §7 el supuesto «sin cantidad de agua». |
| D3 | Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta. | §4.1 y regla 6.8. |
| D4 | La cantidad de agua se expresa en mililitros (ml), enteros ≥ 1. (Actualizado 2026-11-04; antes decía litros.) | Regla 6.10. |
| D5 | Un riego puede tener fecha pasada siempre que no sea anterior a la fecha de registro de la planta. Entra ya en este sprint. | Coincide con la regla 6.4. Por eso HU-1.3 se entrega dentro de HU-1.2. |
| D6 | HU-1.5 (listar plantas) entra al MVP. | §4.5. |

## Historias del MVP

### HU-1.1 · Registrar una planta
Como cuidador, quiero registrar una planta con su nombre, especie, ubicación e intervalo de riego en días, para que el invernadero sepa qué planta es, dónde está y cada cuánto hay que regarla.

- **Estado:** refinada. **Sprint:** 2026-10-28.
- **Alcance:** §4.1, ampliado por D3. **Reglas:** 6.1.

**Reglas que aplican:**
- §4.1 + D3: una planta se registra con nombre, especie, ubicación e intervalo de riego en días, y los cuatro son obligatorios.
- 6.1: el intervalo de riego es un número entero de días, mínimo 1.
- 6.2 (efecto en E2): una planta que nunca se ha regado cuenta desde su fecha de registro, así que la fecha de registro debe quedar guardada.

**Criterios de aceptación:**

- **CA-1.1.1 · Registro válido**
  DADO un cuidador que indica el nombre «Mandrágora», la especie «Mandragora officinarum», la ubicación «Mesa 2» y un intervalo de 3 días,
  CUANDO registra la planta,
  ENTONCES la planta queda registrada con esos cuatro datos y con la fecha de hoy como fecha de registro, y el cuidador los ve confirmados.

- **CA-1.1.2 · Intervalo mínimo**
  DADO un cuidador que indica todos los datos obligatorios y un intervalo de 1 día,
  CUANDO registra la planta,
  ENTONCES la planta queda registrada con un intervalo de 1 día.

- **CA-1.1.3 · Intervalo cero o negativo**
  DADO un cuidador que indica un intervalo de 0 días o de −2 días,
  CUANDO intenta registrar la planta,
  ENTONCES el registro se rechaza, se le indica que el intervalo debe ser de al menos 1 día y no se crea ninguna planta.

- **CA-1.1.4 · Intervalo no entero**
  DADO un cuidador que indica un intervalo de 2,5 días,
  CUANDO intenta registrar la planta,
  ENTONCES el registro se rechaza, se le indica que el intervalo debe ser un número entero de días y no se crea ninguna planta.

- **CA-1.1.5 · Falta un dato obligatorio** (D3)
  DADO un cuidador que deja sin indicar uno de estos datos: nombre, especie, ubicación o intervalo,
  CUANDO intenta registrar la planta,
  ENTONCES el registro se rechaza, se le indica qué dato falta y no se crea ninguna planta. Se cumple para cada uno de los cuatro datos por separado.

- **CA-1.1.6 · Faltan varios datos obligatorios** (D3)
  DADO un cuidador que deja sin indicar la especie y la ubicación,
  CUANDO intenta registrar la planta,
  ENTONCES el registro se rechaza, se le indican los dos datos que faltan y no se crea ninguna planta.

### HU-1.2 · Registrar un riego
Como cuidador, quiero anotar que he regado una planta, hoy o en un día pasado, y con cuánta agua, para que su próximo riego se calcule desde el riego más reciente.

- **Estado:** refinada. **Sprint:** 2026-10-28.
- **Alcance:** §4.2 completo, incluido el riego olvidado con fecha pasada (D5), ampliado por D2. **Reglas:** 6.4.

**Reglas que aplican:**
- D1: no se puede registrar un riego de una planta que no existe.
- D2 + D4: la cantidad de agua de un riego se expresa en ml, es un entero ≥ 1.
- 6.4 + D5: un riego no puede tener fecha futura ni anterior a la fecha de registro de la planta. Sí puede tener una fecha pasada dentro de ese margen.
- 6.5: se cuentan días de calendario y se ignora la hora.
- §7 [SUPUESTO]: «hoy» se calcula con la hora local del invernadero.
- 6.3 (efecto en E2): si una planta tiene varios riegos, cuenta el más reciente.

**Criterios de aceptación:**

- **CA-1.2.1 · Riego de hoy**
  DADO una planta registrada hace 5 días,
  CUANDO el cuidador anota que la ha regado hoy con 2 litros de agua,
  ENTONCES queda registrado un riego de esa planta con la fecha de hoy y esa cantidad, y el cuidador lo ve confirmado.

- **CA-1.2.2 · Riego el mismo día del registro**
  DADO una planta registrada hoy,
  CUANDO el cuidador anota que la ha regado hoy con una cantidad válida,
  ENTONCES el riego se acepta, porque su fecha no es anterior a la fecha de registro de la planta.

- **CA-1.2.3 · La hora no cuenta**
  DADO una planta registrada,
  CUANDO el cuidador anota un riego a las 23:59 hora local del invernadero,
  ENTONCES el riego queda registrado con la fecha de ese día, sin hora que afecte al cálculo.

- **CA-1.2.4 · Fecha futura**
  DADO una planta registrada,
  CUANDO el cuidador intenta anotar un riego con la fecha de mañana,
  ENTONCES el riego se rechaza, se le indica que un riego no puede tener fecha futura y la planta no gana ningún riego.

- **CA-1.2.5 · Planta inexistente** (D1)
  DADO una planta que no está registrada en el invernadero,
  CUANDO el cuidador intenta anotar un riego para ella,
  ENTONCES el riego se rechaza, se le indica que la planta no existe y no se registra ningún riego.

- **CA-1.2.6 · Cantidad de agua cero o negativa** (D2)
  DADO una planta registrada,
  CUANDO el cuidador intenta anotar un riego con 0 litros o con −1 litros de agua,
  ENTONCES el riego se rechaza, se le indica que la cantidad de agua debe ser mayor que 0 y la planta no gana ningún riego.

- **CA-1.2.7 · Cantidad de agua con decimales** (D2, D4)
  DADO una planta registrada,
  CUANDO el cuidador anota un riego con 0,5 litros de agua,
  ENTONCES el riego se acepta y queda registrado con 0,5 litros.

- **CA-1.2.8 · Riego olvidado con fecha pasada** (D5)
  DADO una planta registrada hace 10 días,
  CUANDO el cuidador anota un riego con la fecha de hace 3 días,
  ENTONCES el riego se acepta y queda registrado con la fecha de hace 3 días.

- **CA-1.2.9 · Fecha anterior al registro de la planta** (D5)
  DADO una planta registrada hace 10 días,
  CUANDO el cuidador intenta anotar un riego con la fecha de hace 11 días,
  ENTONCES el riego se rechaza, se le indica que un riego no puede ser anterior a la fecha de registro de la planta y la planta no gana ningún riego.

### HU-1.3 · Registrar un riego olvidado
Como cuidador, quiero anotar un riego que hice en un día pasado y olvidé registrar, para que el historial refleje lo que de verdad pasó y la planta no aparezca como atrasada sin estarlo.

- **Estado:** absorbida por HU-1.2 (D5). Sus criterios son CA-1.2.8 y CA-1.2.9, y se entrega en el sprint 2026-10-28.
- **Alcance:** §4.2 («incluido un riego olvidado con fecha pasada»). **Reglas:** 6.4, D1, D2.

### HU-1.4 · Consultar el historial de riegos de una planta
Como cuidador, quiero ver todos los riegos registrados de una planta, para comprobar cuándo se ha regado y detectar si falta alguno.

- **Estado:** refinada (criterios mínimos según spec 01 §2.4). **Sprint:** 2026-10-28.
- **Alcance:** §4.4.

**Criterios de aceptación:**

- **CA-1.4.1 · Historial con riegos**
  DADO una planta con varios riegos registrados,
  CUANDO el cuidador consulta el historial de esa planta,
  ENTONCES ve todos esos riegos ordenados del más reciente al más antiguo.

- **CA-1.4.2 · Planta sin riegos**
  DADO una planta registrada sin ningún riego,
  CUANDO el cuidador consulta su historial,
  ENTONCES ve una lista vacía.

- **CA-1.4.3 · Planta inexistente**
  DADO un identificador que no corresponde a ninguna planta,
  CUANDO el cuidador intenta consultar su historial,
  ENTONCES se le indica que la planta no existe.

### HU-1.5 · Listar las plantas registradas
Como cuidador, quiero ver la lista de todas las plantas registradas, para encontrar la que busco y consultar su historial.

- **Estado:** refinada (criterios mínimos según spec 01 §2.2). **Sprint:** 2026-10-28.
- **Alcance:** §4.5.

**Criterios de aceptación:**

- **CA-1.5.1 · Lista con plantas**
  DADO un invernadero con varias plantas registradas,
  CUANDO el cuidador consulta la lista de plantas,
  ENTONCES ve todas las plantas con sus datos, ordenadas de la más antigua a la más reciente por fecha de registro.

- **CA-1.5.2 · Lista vacía**
  DADO un invernadero sin plantas,
  CUANDO el cuidador consulta la lista de plantas,
  ENTONCES ve una lista vacía.

- **CA-1.5.3 · Tras registrar una planta**
  DADO un cuidador que acaba de registrar una planta,
  CUANDO consulta la lista de plantas,
  ENTONCES esa planta aparece en la lista.

### HU-1.8 · Registrar un riego rápido desde la lista
Como cuidador, quiero registrar un riego desde la lista de plantas sin abrir su detalle, para anotarlo en segundos mientras recorro las mesas.

- **Estado:** refinada. **Sprint:** 2026-11-18.
- **Alcance:** atajo de HU-1.2 desde la lista (HU-1.5). Reutiliza `POST /api/riegos`.

**Decisiones del cliente para esta historia:**
- El panel sugiere 500 ml en «Cantidad (ml)».
- La fecha del riego es hoy; no se muestra campo de fecha.
- No se pide cuidador (para eso está el detalle).
- Tras guardar con éxito, el panel se cierra y el mensaje de éxito queda visible en la lista.
- Solo puede haber un panel de riego rápido abierto a la vez: al abrir otro se cierra el anterior.
- Valida la cantidad igual que el detalle: si es 0 (u otro valor inválido), el error aparece junto al campo.

**Criterios de aceptación:**

- **CA-1.8.1 · Acción Regar en la lista**
  DADO un invernadero con al menos una planta en la lista,
  CUANDO el cuidador mira la lista de plantas,
  ENTONCES cada fila muestra un botón «Regar» (con el nombre de la planta en el nombre accesible, p. ej. «Regar Mandrágora») sin tener que abrir el detalle.

- **CA-1.8.2 · Panel abierto**
  DADO una planta «Mandrágora» en la lista,
  CUANDO el cuidador pulsa «Regar Mandrágora»,
  ENTONCES se abre un panel de riego rápido bajo esa fila con el campo «Cantidad (ml)» precargado en 500, los botones «Guardar riego» y «Cancelar», sin campos de fecha ni cuidador; si había otro panel abierto, ese se cierra.

- **CA-1.8.3 · Guardando**
  DADO el panel de riego rápido abierto con una cantidad válida,
  CUANDO el cuidador pulsa «Guardar riego»,
  ENTONCES el botón pasa a «Guardando…», queda deshabilitado y no se puede enviar otra vez hasta que termine la petición.

- **CA-1.8.4 · Éxito**
  DADO el panel de riego rápido abierto para «Mandrágora» con 500 ml,
  CUANDO el cuidador pulsa «Guardar riego» y la API acepta el riego,
  ENTONCES el panel se cierra y en la lista aparece el mensaje «Riego guardado para Mandrágora.»

- **CA-1.8.5 · Error de validación junto al campo**
  DADO el panel de riego rápido abierto,
  CUANDO el cuidador pone 0 en «Cantidad (ml)» y pulsa «Guardar riego»,
  ENTONCES el riego no se envía (o se rechaza), el panel sigue abierto y junto al campo aparece el mensaje «La cantidad de agua debe ser mayor que 0».

- **CA-1.8.6 · Error de conexión**
  DADO el panel de riego rápido abierto con una cantidad válida,
  CUANDO el cuidador pulsa «Guardar riego» y la API no responde o hay un fallo de red,
  ENTONCES el panel sigue abierto, el botón deja de decir «Guardando…» y aparece un mensaje de error de conexión que indica que no se pudo guardar y que puede intentarlo de nuevo.

- **CA-1.8.7 · Uso en móvil a 390 px**
  DADO la lista de plantas vista a 390 px de ancho,
  CUANDO el cuidador pulsa «Regar» en una tarjeta de planta y abre el panel,
  ENTONCES el botón «Regar», el panel, el campo «Cantidad (ml)» y «Guardar riego» / «Cancelar» caben en el ancho sin desplazamiento horizontal y las zonas táctiles miden al menos 44 px.

## Casos borde sin cubrir (HU-1.1 y HU-1.2)

Los criterios de aceptación todavía no cubren estas situaciones. Hay que decidir cada una antes de escribir la spec, o pasarla a §8 del PRD.

**HU-1.1 · Registrar una planta**
- **Nombre repetido:** ¿se permiten dos plantas con el mismo nombre? Si se permiten, el cuidador no podrá distinguirlas al anotar riegos. ¿Cambia algo si además tienen distinta especie o ubicación?
- **Datos con solo espacios, o con espacios al principio o al final** (en nombre, especie o ubicación): ¿cuentan como dato vacío? ¿Se recortan los espacios?
- **Especie y ubicación:** ¿son texto libre o se eligen de una lista cerrada?
- **Textos muy largos:** ¿hay una longitud máxima para nombre, especie y ubicación?
- **Mayúsculas y acentos:** ¿«mandrágora» y «Mandrágora» son la misma planta a efectos de duplicados?
- **Intervalo muy grande** (p. ej. 10 000 días): ¿hay un máximo razonable?
- **Intervalo escrito como «3,0» o como texto «tres»:** ¿«3,0» se acepta como 3 y «tres» se rechaza?

**HU-1.2 · Registrar un riego**
- **Precisión de la cantidad** (D4): ¿con cuántos decimales se guarda? ¿Qué pasa con 0,001 litros: se acepta, se redondea a 0 y se rechaza, o se rechaza por tener demasiados decimales?
- **Cantidad obligatoria** (D2): ¿se puede anotar un riego sin indicar la cantidad, o es obligatoria como los datos de la planta?
- **Cantidad muy grande** (D2): ¿hay un máximo razonable por riego?
- **Dos riegos el mismo día:** ¿se aceptan dos riegos de la misma planta en el mismo día? ¿Se guardan los dos o el segundo se ignora?
- **Riego sin fecha:** si el cuidador no indica la fecha, ¿se toma la de hoy o se le pide?
- **Riego olvidado anterior al último riego:** si una planta tiene un riego de ayer y se anota uno olvidado de hace 3 días, se acepta (D5), pero la referencia para E2 sigue siendo el de ayer (regla 6.3). ¿Hay que avisar al cuidador?
- **Cambio de día:** un riego anotado justo alrededor de la medianoche, o por un cuidador cuyo dispositivo está en otra zona horaria. Según el supuesto del §7 manda la hora local del invernadero, pero hay que confirmarlo.
- **Riego anotado justo después de registrar la planta:** si la fecha de registro guarda la hora y el riego no (o al revés), la comparación de la regla 6.4 podría rechazar por error un riego del mismo día. CA-1.2.2 exige que se acepte.

## Tickets del sprint (2026-10-28)

**Requisito previo:** según las reglas del repo, ninguna funcionalidad se implementa sin una spec en `docs/specs/`. Antes de empezar T-02 tiene que existir la spec de HU-1.1, y antes de empezar T-05, la de HU-1.2.

**Bloqueos:** no queda ninguno. El tratamiento de las fechas pasadas se resolvió con D5.

### HU-1.1 · Registrar una planta

#### T-01 · Proyecto base
- **Historia:** HU-1.1 (lo reutilizan todos los tickets). **Tipo:** Configuración.
- **Descripción:** preparar el proyecto Node con Express y Mongoose, separando la app (`src/app.js`) del arranque y la conexión a MongoDB (`src/index.js`), con los comandos `npm run dev` y `npm test` funcionando.
- **Definition of Done:**
  - [x] Existe `package.json` con los scripts `dev` y `test`, y `npm test` se ejecuta sin errores aunque todavía no haya tests.
  - [x] `src/app.js` exporta la app sin llamar a `listen`.
  - [x] `src/index.js` conecta a MongoDB y arranca el servidor con valores tomados de variables de entorno.
  - [x] No hay credenciales en el código ni en el repo, y `.env` está ignorado por git.
  - [ ] Prettier está configurado y el código pasa el formato.
  - [ ] Los tests pueden usar una base de datos aislada que no sea la de desarrollo.
- **Dependencias:** ninguna.
- **Estado:** pendiente. Falta formatear `.claude/hooks/formatear.js` con Prettier. El punto de la base de datos aislada ya no aplica según la spec (X9) y hay que quitarlo de la DoD.

#### T-02 · Planta y sus validaciones
- **Historia:** HU-1.1. **Tipo:** Modelo/Dominio.
- **Descripción:** crear el modelo de planta (en `src/models/`) y las validaciones de negocio de los datos de una planta nueva: campos obligatorios, intervalo entero de al menos 1 día y fecha de registro.
- **Definition of Done:**
  - [x] La spec de HU-1.1 existe en `docs/specs/`.
  - [x] Se exige nombre, especie, ubicación e intervalo (regla 6.8).
  - [x] Se rechaza un intervalo que no sea un número entero o que sea menor que 1 (regla 6.1).
  - [x] Cada planta guarda su fecha de registro (regla 6.2).
  - [x] Los errores indican qué dato falla, y si faltan varios datos se informa de todos.
  - [ ] Las reglas que no dependen de la base de datos están en `src/dominio/` como funciones puras y tienen tests unitarios.
  - [x] `npm test` pasa.
- **Dependencias:** T-01.
- **Estado:** pendiente. Las validaciones de la planta están en el modelo de Mongoose, no en `src/dominio/` como funciones puras.

#### T-03 · Registrar una planta por la API
- **Historia:** HU-1.1. **Tipo:** Endpoint/API.
- **Descripción:** exponer bajo `/api/plantas` la operación de registrar una planta, usando el modelo y las validaciones de T-02 y devolviendo la planta creada o los errores de validación.
- **Definition of Done:**
  - [x] Un registro válido crea la planta y devuelve sus datos y su fecha de registro.
  - [x] Un registro no válido no crea nada y devuelve los errores de T-02 de forma comprensible.
  - [x] Los errores de validación se distinguen de los errores inesperados del servidor.
  - [x] El router está en `src/routes/` y montado en `src/app.js`.
  - [x] `npm test` pasa.
- **Dependencias:** T-02.
- **Estado:** hecho.

#### T-04 · Tests de aceptación de HU-1.1
- **Historia:** HU-1.1. **Tipo:** Test.
- **Descripción:** automatizar los criterios CA-1.1.1 a CA-1.1.6 contra la API, con `node --test`.
- **Definition of Done:**
  - [x] Hay al menos un test por cada criterio, de CA-1.1.1 a CA-1.1.6.
  - [x] CA-1.1.5 se comprueba por separado para cada uno de los cuatro datos obligatorios.
  - [ ] Los tests que esperan un rechazo comprueban también que no se ha creado ninguna planta.
  - [ ] Los tests usan la base de datos aislada de T-01 y la dejan limpia entre tests.
  - [x] `npm test` pasa.
- **Dependencias:** T-03.
- **Estado:** pendiente. Los tests automáticos no comprueban que no se crea la planta (solo se comprobó una vez con curl). El punto de la base de datos aislada ya no aplica según la spec (X9).

### HU-1.2 · Registrar un riego

#### T-05 · Riego y sus validaciones
- **Historia:** HU-1.2. **Tipo:** Modelo/Dominio.
- **Descripción:** crear el modelo de riego (en `src/models/`), asociado a una planta, y las validaciones de negocio de un riego nuevo: cantidad de agua y fecha en días de calendario según la hora local del invernadero.
- **Definition of Done:**
  - [x] La spec de HU-1.2 existe en `docs/specs/`.
  - [x] Cada riego pertenece a una planta y guarda su fecha y su cantidad de agua en ml.
  - [x] Se aceptan cantidades enteras en ml y se rechaza una cantidad de 0 o negativa (regla 6.10).
  - [x] Se acepta una fecha pasada desde el día de registro de la planta, y se rechaza una fecha futura o anterior a ese día (regla 6.4, D5).
  - [x] Las fechas se comparan como días de calendario y se ignora la hora (regla 6.5), así que un riego el mismo día del registro de la planta se acepta.
  - [ ] Las reglas de fechas y cantidad están en `src/dominio/` como funciones puras y tienen tests unitarios, incluidos los casos alrededor de la medianoche.
  - [x] `npm test` pasa.
- **Dependencias:** T-01, T-02.
- **Estado:** pendiente. La validación de cantidad está en el modelo, no en `src/dominio/` (deuda técnica).

#### T-06 · Registrar un riego por la API
- **Historia:** HU-1.2. **Tipo:** Endpoint/API.
- **Descripción:** exponer `POST /api/riegos` (la planta va en el cuerpo) para registrar un riego, usando el modelo y las validaciones de T-05. El historial sigue en `GET /api/plantas/:id/riegos`.
- **Definition of Done:**
  - [x] Un riego válido, de hoy o con fecha pasada, queda registrado con su fecha y la cantidad indicada, y se devuelven sus datos.
  - [x] Un riego de una planta que no existe se rechaza con un error distinto al de validación y no registra nada (regla 6.9).
  - [x] Un riego no válido no registra nada y devuelve los errores de T-05 de forma comprensible.
  - [x] No se pide responsable.
  - [x] El router está en `src/routes/` y montado en `src/app.js`.
  - [x] `npm test` pasa.
- **Dependencias:** T-05. Si el router comparte archivo con el de plantas, también T-03.
- **Estado:** hecho.

#### T-07 · Tests de aceptación de HU-1.2
- **Historia:** HU-1.2. **Tipo:** Test.
- **Descripción:** automatizar los criterios CA-1.2.1 a CA-1.2.9 contra la API, con `node --test`.
- **Definition of Done:**
  - [ ] Hay al menos un test por cada criterio, de CA-1.2.1 a CA-1.2.9.
  - [x] Los tests de fechas («hoy», 23:59, mañana, hace 3 días, antes del registro) no dependen del día ni de la hora en que se ejecutan.
  - [ ] Los tests que esperan un rechazo comprueban también que la planta no ha ganado ningún riego.
  - [ ] Los tests usan la base de datos aislada de T-01 y la dejan limpia entre tests.
  - [x] `npm test` pasa.
- **Dependencias:** T-06.
- **Estado:** pendiente. CA-1.2.5 no tiene test automático (solo curl), y los tests no comprueban que la planta no gana riegos. El punto de la base de datos aislada ya no aplica según la spec (X9).

### Orden de ejecución sugerido

1. **T-01** · Proyecto base. Desbloquea todo lo demás.
2. **T-02** · Planta y sus validaciones.
3. **T-03** · Registrar una planta por la API.
4. **T-04** · Tests de aceptación de HU-1.1. Con esto HU-1.1 queda entregable aunque HU-1.2 se retrase.
5. **T-05** · Riego y sus validaciones. Se puede empezar en paralelo con T-03 y T-04.
6. **T-06** · Registrar un riego por la API.
7. **T-07** · Tests de aceptación de HU-1.2.

El camino crítico es T-01 → T-02 → T-05 → T-06 → T-07. Si ese camino se retrasa, HU-1.1 se puede cerrar igualmente.

## Historias fuera de alcance

Estas historias aparecen de forma natural al descomponer la épica, pero el PRD las excluye o no las incluye en el MVP. Se dejan anotadas para no perderlas.

### HU-1.6 · Cambiar el intervalo de riego de una planta — fuera de alcance (punto abierto)
Como cuidador, quiero cambiar el intervalo de riego de una planta ya registrada, para ajustarlo si me equivoqué o si la planta necesita otro ritmo.

- **Motivo:** el §8 deja sin decidir si el intervalo se puede modificar y cómo afecta al cálculo.

### HU-1.7 · Corregir o borrar un riego erróneo — fuera de alcance
Como cuidador, quiero corregir o borrar un riego mal registrado, para que un error no oculte una planta que necesita agua.

- **Motivo:** el §5 excluye explícitamente corregir o borrar riegos. El §8 lo mantiene como punto abierto por el riesgo que supone.

## Comprobación INVEST

- **Independientes:** las historias del MVP se pueden implementar y entregar por separado. HU-1.2, HU-1.3 y HU-1.4 necesitan que exista alguna planta, pero para probarlas basta con datos de prueba; no dependen del código de HU-1.1. HU-1.3 se ha absorbido en HU-1.2 (D5), porque registrar un riego con fecha pasada es la misma operación con otra fecha.
- **Pequeñas:** cada historia es una sola operación (un alta, un registro o una consulta).
- **Comprobables:** cada una tiene un resultado observable y, cuando aplica, una regla del §6 o una decisión del cliente contra la que escribir los criterios.

## Cobertura del alcance de E1

| Alcance (§4) | Historias |
|---|---|
| 4.1 Registrar planta | HU-1.1 |
| 4.2 Registrar riego (incluido olvidado) | HU-1.2 (absorbe HU-1.3); HU-1.8 (atajo desde la lista) |
| 4.4 Historial de riegos | HU-1.4 |
| 4.5 Lista de plantas | HU-1.5 |

## Deuda técnica

- Spec 01: X2, X3, X4, X7, X8 y X9 sin confirmar.
- Las respuestas JSON incluyen `__v`.
- No hay `GET /api/plantas/:id`.
- Los nombres de planta no son únicos.
- Tests de aceptación API incompletos (T-04/T-07); parte curl de CA-1.2.9 sin verificar.
- DoD de T-01, T-02 y T-05 desalineada (validaciones en modelo vs `dominio/`).
- `app.listen` sin host `0.0.0.0` (despliegue en Render).
- Puntos abiertos del PRD: editar/borrar riego, máximo de cantidad, especie/ubicación cerradas, cambio de intervalo.
- Criterios de HU-1.2 aún mencionan «litros» en varios sitios; el contrato vigente es ml.
