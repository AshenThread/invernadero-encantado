# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Cuidadores voluntarios del invernadero. Trabajan de pie entre las mesas, a menudo desde el móvil, y necesitan encontrar y anotar algo en segundos: registrar plantas y riegos, y saber qué toca regar.

## Product Purpose

Dar una forma fiable de saber qué plantas mágicas necesitan agua, en lugar de depender de la memoria o de notas sueltas. El objetivo del MVP es que un cuidador sepa en una sola consulta qué plantas regar hoy y cuáles van más atrasadas. Éxito orientativo (supuesto del PRD): ≥ 90 % de plantas regadas en su día o antes durante el primer mes de uso.

## Positioning

Un cuaderno compartido de campo para un único invernadero de plantas mágicas: registro de plantas y riegos sin cuentas de usuario, sin sensores y sin automatismos. La magia es el marco del dominio, no un sistema de alertas ni de IoT.

## Operating Context

- Un solo invernadero; todos los cuidadores ven todas las plantas.
- «Hoy» y los días de calendario se calculan con la hora local del invernadero (`TZ` del proceso).
- Flujo actual del frontend (épica E1): lista/alta de plantas → detalle con historial y alta de riego.
- Épica E2 (consulta de plantas que necesitan agua, ordenadas por retraso) es el cierre del objetivo del MVP y aún no está en la UI.
- El trabajo de producto se gobierna con PRD, backlog y specs en `docs/`; no se implementa funcionalidad sin spec en `docs/specs/`.

## Capabilities and Constraints

**Confirmado en el MVP:**
- Registrar planta: nombre, especie, ubicación, intervalo de riego en días (entero ≥ 1).
- Registrar riego: cantidad en ml (entero ≥ 1), fecha opcional (por defecto ahora; no futura ni anterior al registro de la planta), cuidador opcional.
- Listar plantas e historial de riegos de una planta.
- Consultar plantas que necesitan agua con días de retraso, ordenadas de más a menos urgente (E2; reglas de negocio en el PRD).
- Sin cuentas, permisos, varios invernaderos, notificaciones automáticas ni sensores.
- Terminología de dominio en español: `planta`, `riego`, `invernadero`, `intervaloRiegoDias`, `cantidadMl`, `cuidador`.
- API REST bajo `/api`; frontend en `client/` (React + Vite) que habla con la API vía proxy.
- La API admite campos opcionales `enReposo` y `cuidadosEspeciales` que la UI de E1 no expone.

**No decidido (no inventar en trabajo futuro):**
- Si un riego erróneo se puede editar o borrar.
- Criterio de desempate entre plantas con el mismo retraso.
- Si hay un máximo de ml por riego.
- Si especie y ubicación son texto libre o lista cerrada.
- Si se puede cambiar el intervalo de una planta ya registrada y cómo afecta al cálculo.
- Qué significa «reposo» para el producto (mencionado en E2 sin definición en el PRD).

## Brand Commitments

- Nombre del producto: **Invernadero Encantado**.
- Voz: español, tuteo, frases cortas, sin tecnicismos (nada de códigos HTTP, ObjectId ni jerga de API en la UI).
- Identidad visual y tokens viven en `DESIGN.md` / `client/src/styles/tokens.css`; este archivo no los redefine.

## Evidence on Hand

- PRD: `docs/prd/invernadero-mvp.md`
- Épicas y backlog: `docs/backlog/`
- Specs: `docs/specs/01-plantas-y-riegos.md`, `docs/specs/02-frontend-e1.md`
- Sistema de diseño documentado: `DESIGN.md`
- Frontend E1 implementado en `client/`
- No hay testimonios, métricas reales de uso ni assets de marca externos; no fabricarlos.

## Product Principles

1. **Lo urgente primero:** el cuidador debe ver qué planta es y cuándo se regó (o si le toca) sin ruido.
2. **Anotación en segundos:** cada pantalla sirve a una acción clara; un solo camino primario por vista.
3. **Estados honestos:** carga, vacío, error y éxito siempre explican qué pasó y qué hacer.
4. **Un invernadero compartido:** sin cuentas ni fragmentación; la verdad es la misma para todos los cuidadores.
5. **Spec antes de código:** el PRD y las specs mandan; los puntos abiertos se registran, no se improvisan.

## Accessibility & Inclusion

Uso frecuente en móvil, de pie, con poco tiempo. Requisitos de producto ya comprometidos: contraste de texto ≥ 4.5:1, etiquetas reales en campos, errores con texto (no solo color), zonas táctiles ≥ 44 px, foco de teclado visible.
