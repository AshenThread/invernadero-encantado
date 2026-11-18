# Auditoría del pulido frontend (spec 03)

**Fecha:** 2026-11-09  
**Rama:** `feature/frontend-pulido`  
**Fuentes:** [docs/specs/03-pulido-frontend.md](specs/03-pulido-frontend.md), [docs/diagnostico-diseno.md](diagnostico-diseno.md), [docs/specs/02-frontend-e1.md](specs/02-frontend-e1.md), [DESIGN.md](../DESIGN.md)

## Comparación `detect` vs línea base

| Corrida | Línea base (diagnóstico) | Tras el pulido | Delta |
|---|---|---|---|
| `npx impeccable detect client/src` | **0** hallazgos (exit 0) | **0** hallazgos (exit 0), JSON `[]` | sin cambio |
| `npx impeccable detect http://localhost:5173` | **0** hallazgos (exit 0) | **0** hallazgos (exit 0), JSON `[]` | sin cambio |

Cero hallazgos en detect **antes y después** no prueba el pulido: el detector ya estaba limpio. Los criterios CA-P se cierran con navegador, revisión de código y DESIGN.md.

## `npm test`

```
tests 42 · pass 42 · fail 0
```

## Tabla de criterios CA-P

| Criterio | Evidencia | Resultado |
|---|---|---|
| **CA-P.1** Lista antes que alta | Detect antes/después: 0/0 (no discrimina). Navegador 390×844: `listTop≈147`, fila en viewport (`rowTop≈199`), formulario `formTop≈1471` (`formBelowFold: true`). Orden DOM: «Lista de plantas» → «Registrar planta». DESIGN Principios §1. | **cumple** |
| **CA-P.2** Último riego en lista | Navegador: celdas `Último riego` con p. ej. `4 nov 2026`, `sin riegos`, `9 nov 2026`. Código: `listarRiegos` de spec 01, sin endpoint nuevo ni días de atraso E2. | **cumple** |
| **CA-P.3** Marca en el cuerpo | Navegador: `.app-marca` = «Invernadero Encantado» en Plantas y Detalle. Revisión DESIGN/tokens: `--fuente-titulos`, `--color-primario`, no es `h1` ni botón primario. | **cumple** |
| **CA-P.4** Control riego en fila | Navegador: 4 botones «Registrar riego» (enlace acento) + **1** `.boton--primario` («Registrar planta»). Flujo sigue en Detalle (`focoRiego`); sin rutas nuevas. | **cumple** |
| **CA-P.5** Persistencia tras recarga | Navegador: abrir Mandragora → `sessionStorage` con id → recarga en `/` sin URL distinta → vuelve `h1` Mandragora + historial/formulario. Sin React Router. | **cumple** |
| **CA-P.6** Historial antes que formulario | Navegador Detalle: secciones `['Historial de riegos','Registrar riego']`; 1 primario «Registrar riego». | **cumple** |
| **CA-P.7** Foco al cambiar pantalla | Navegador: al entrar a detalle `activeElement` = `H1 Mandragora` (no `body`). Al volver, foco en `H1 Plantas` (no `body`); si la lista aún no montó refs, cae al encabezado (permitido por el OR del criterio). Audit a11y previo: era P2; mitigado. | **cumple** |
| **CA-P.8** Scroll sin smooth | Revisión de código: `scrollIntoView({ behavior: "auto" })` en Plantas y Detalle; sin `smooth`. Detect 0/0; DESIGN «No hacemos: Animaciones». | **cumple** |
| **CA-P.9** Espacios solo con tokens | Revisión: `--espacio-0: 2px` en `tokens.css`; `outline-offset` e iconos usan `var(--espacio-0)`. Grep sin `margin/padding/gap/outline-offset: 2px` sueltos. DESIGN actualizado. Detect 0/0. *(Bordes de 2 px en error/secundario/vacío siguen literales; el criterio habla de espacios.)* | **cumple** |
| **CA-P.10** Un solo markup de lista | Navegador: `rows: 4`, `tarjetas: 0` (sin `.plantas__tarjeta`). A 390 px `display:block` en filas (tarjeta visual). Una sola `.map` en `Plantas.jsx`. | **cumple** |

**Resumen CA-P:** 10 cumple · 0 no cumple · 0 sin verificar.

## Propuestas de la skill diferidas o rechazadas

| Propuesta (critique / audit / skill) | Decisión | Motivo |
|---|---|---|
| `/impeccable delight` para la marca | **Rechazada** (comando) | Spec 03 no-alcance: delight / animate / overdrive / bolder. Marca hecha con `/impeccable polish` (CA-P.3). |
| `/impeccable animate` u otras animaciones | **Rechazada** | No-alcance + DESIGN «No hacemos: Animaciones». |
| `/impeccable overdrive` / `bolder` | **Rechazada** | No-alcance de la spec 03. |
| Mostrar días de atraso / aviso ámbar (E2) en la lista | **Diferida** | CA-P.2 y no-alcance: E2 fuera de este pulido; solo «último riego» / «sin riegos». |
| Rutas o URLs por planta (React Router) | **Rechazada** | Spec 02 §1.1 sin URLs distintas; CA-P.5 usa `sessionStorage`. |
| Alta de riego inline en la lista (sin Detalle) | **Rechazada** | Rompería el flujo de dos pantallas y el primario único de la spec 02; CA-P.4 navega a Detalle con foco en el formulario. |
| Alcance «solo top 3» del cierre del critique | **Superada** | El usuario pidió implementar la spec 03 completa (CA-P.1…10); se ejecutaron los diez. |
| Comp-first para landings (config Impeccable) | **No aplica** | Superficie Operate: code-first; no se generaron comps. |

## Spec 02 — criterios que se siguen cumpliendo

Comprobación puntual tras el pulido (no se reabrió la batería completa CA-F-* automatizada; no hay tests de frontend):

| Área spec 02 | Estado |
|---|---|
| Dos pantallas sin librería de rutas / sin URLs distintas | Cumple (estado React + `sessionStorage`, URL sigue `/`) |
| Un solo botón primario por pantalla | Cumple (Plantas: alta; Detalle: riego; «Registrar riego» en lista es enlace acento) |
| Lista con nombre, especie, ubicación, riego cada | Cumple; ampliada con último riego y acción (DESIGN actualizado en el mismo cambio) |
| Historial reciente→antiguo, fechas ES, ml, «sin cuidador» | Cumple (sin cambio de reglas) |
| Estados carga / vacío / error / éxito | Cumple |
| Labels reales, errores con icono+texto, tokens, foco visible, táctil 44 px | Cumple (tokens ampliados con `--espacio-0`) |
| Sin Tailwind/MUI/Router; proxy `/api` | Cumple |
| Sin UI de E2, `enReposo` ni `cuidadosEspeciales` en formularios | Cumple |

Ningún criterio CA-F-* de la spec 02 se ha invalidado a propósito; el pulido refina orden, datos visibles, a11y de foco y markup, sin tocar el backend.
