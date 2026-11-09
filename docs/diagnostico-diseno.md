# Diagnóstico de diseño — pantallas E1

**Fecha:** 2026-11-09  
**Objetivo:** `client/src/pantallas` (Plantas + Detalle de planta)  
**Contexto:** cliente Vite en `http://localhost:5173` y API en `http://localhost:3000` (API arrancada para la inspección live).  
**Código de producto:** no modificado en esta corrida.

## Nota metodológica

| Origen | Qué mide |
|---|---|
| **detect** | Reglas fijas del detector Impeccable. Cero hallazgos ≠ diseño bueno: solo significa que no rompe esas reglas. |
| **critique** | Juicio de diseño (jerarquía, IA, heurísticas, carga cognitiva, adecuación al cuidador). |
| **audit** | Calidad técnica medible (a11y, rendimiento, tokens, responsive, integridad de implementación). |

## Línea base `detect`

| Corrida | Comando | Hallazgos | Exit |
|---|---|---|---|
| Fuente | `npx impeccable detect client/src` | **0** | 0 |
| URL | `npx impeccable detect http://localhost:5173` | **0** | 0 |

JSON de ambas corridas: `[]`.  
Nota del detector en fuente: 16 archivos escaneados con matching regex (`.css`, `.js`, `.jsx`); reglas que necesitan página parseada (p. ej. contraste) no corren ahí — por eso también se escaneó la URL. Overlay live (Assessment B): «No anti-patterns found.» en Plantas y Detalle.

## Conteos por origen (tabla unificada)

| Origen | Filas en la tabla |
|---|---|
| detect | 0 |
| critique | 5 |
| audit | 5 |
| **Total** | **10** |

H-1 también lo confirmó el audit (mismo hecho: formulario de alta encima de la lista); se deja origen primario `critique` y se anota la repetición.

## Tabla unificada de hallazgos

| id | hallazgo | pantalla | origen | regla DESIGN.md / criterio spec 02 |
|---|---|---|---|---|
| H-1 | El formulario «Registrar planta» ocupa el primer viewport; la lista queda ~debajo del pliegue (también en móvil). *Confirmado por audit.* | Plantas | critique | DESIGN Principios §1 «Lo importante primero»; PRODUCT «Lo urgente primero»; spec 02 §1 / §2 (lista + formulario) |
| H-2 | La lista no muestra cuándo se regó ni si va atrasada; solo intervalo. Obliga a abrir el detalle y recordar. | Plantas | critique | DESIGN Principios §1 «qué planta es y cuándo se regó»; propósito del PRD/PRODUCT (saber qué regar); E2 aún no UI |
| H-3 | El nombre «Invernadero Encantado» no aparece en el cuerpo de la UI (solo en `document.title`). | ambas / transversal | critique | PRODUCT Brand Commitments; Operate: marca en detalles precisos |
| H-4 | Registrar un riego exige abrir el detalle completo; no hay acción rápida desde la lista. | ambas | critique | DESIGN / PRODUCT contexto de uso (móvil, de pie, segundos); — (spec 02 define el flujo en dos pantallas) |
| H-5 | El detalle vive solo en estado SPA; refresco o atrás del navegador pierde la planta seleccionada. | Detalle | critique | spec 02 §1.1 (sin URLs distintas en este sprint — restricción consciente); fricción de interrupción |
| H-6 | En Detalle, el formulario de riego va encima del historial; el historial (lectura) queda secundario. | Detalle | audit | DESIGN Principios §1; spec 02 §1 / §3 (historial + formulario) |
| H-7 | Al pasar de Plantas ↔ Detalle, el foco queda en `body`; no se anuncia el nuevo `h1`. | ambas | audit | DESIGN Accesibilidad (teclado); spec 02 §1.1 navegación; WCAG 2.4.3 (buena práctica SPA) |
| H-8 | `scrollIntoView({ behavior: "smooth" })` en CTAs de vacío sin respetar `prefers-reduced-motion`. | ambas | audit | DESIGN «No hacemos: Animaciones»; Accesibilidad; WCAG 2.3.3 |
| H-9 | Valores `2px` sueltos (`margin-top` en iconos, `outline-offset`) fuera de tokens de espacio. | transversal | audit | DESIGN Tokens / «solo variables»; spec 02 §5.6 CA-F-DIS.1 |
| H-10 | Lista duplicada en DOM (tabla + tarjetas); una se oculta con CSS. Correcto para a11y (`display: none`), coste 2N nodos. | Plantas | audit | DESIGN Componentes «Lista de plantas»; spec 02 §2.3 |

## Resumen critique (síntesis)

- **Método:** dual-agent (A: `290d8d79-ad6f-4d75-9530-ae86c550ca03` · B: `7c59e967-1716-4f88-b9e4-fa16e3bdd823`)
- **Design Health Score:** 24/40 (Acceptable)
- **Especificidad:** parcialmente propia del producto (tokens y voz sí; composición CRUD genérica)
- **Detector:** 0 hallazgos; overlay live sin anti-patterns
- **Prioridades critique:** H-1, H-2 (P1); H-3, H-4 (P2); H-5 (P3)

## Resumen audit

- **Audit Health Score:** 18/20 (Excellent)
- **Integridad de implementación:** pass (sistema coherente; detector limpio), con deuda de orden lectura/escritura (H-1, H-6)
- **Severidades audit:** P0: 0 · P1: 1 (H-1/H-6 patrón) · P2: 2 (H-7, H-8) · P3: 2 (H-9, H-10)

## No hallazgos / fuera de alcance

- Modo oscuro ausente: DESIGN lo prohíbe; no se penaliza.
- `--color-aviso` sin uso: reservado para E2.
- Contraste y zonas táctiles ≥ 44 px: verificados en audit (sin fila de hallazgo).
