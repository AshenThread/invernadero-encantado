---
name: Invernadero Encantado
description: Señalética de terminal amarilla para anotar plantas y riegos en segundos
colors:
  shell: "#ffcc00"
  primary: "#0b0b0b"
  on-shell: "#0b0b0b"
  on-primary: "#ffcc00"
  text: "#0b0b0b"
  text-secondary: "#3a3a3a"
  background: "#e6e6e6"
  surface: "#ffffff"
  border: "#bdbdbd"
  border-field: "#6e6e6e"
  success-bg: "#ececec"
  error: "#b3261e"
  error-bg: "#fbecea"
  warning: "#8a5300"
  warning-bg: "#fbf1df"
typography:
  display:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "clamp(2rem, 6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    letterSpacing: "0.04em"
  monument:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  brand-mark:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.02em"
rounded:
  control: "4px"
  card: "6px"
spacing:
  "0": "2px"
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  button-primary:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "8px 16px 8px 8px"
    height: "44px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "8px 16px 8px 8px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "8px 16px 8px 8px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 16px 8px 8px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px"
    height: "44px"
    typography: "{typography.body}"
  message-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "24px"
  message-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
    rounded: "{rounded.card}"
    padding: "24px"
  shell-band:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.on-shell}"
    padding: "16px 24px"
  form-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: Invernadero Encantado

## Overview

**Creative North Star: "Señalética de terminal"**

La interfaz se lee como un tablero de decisión rápida en un aeropuerto: una banda amarilla a sangre dice dónde estás, el trabajo ocurre en negro sobre gris claro, y el intervalo de riego se lee como un número de puerta. El amarillo no decora: orienta. Rechaza el cuaderno botánico suave (verde/violeta) y el inventario SaaS gris.

El producto es un cuaderno compartido de campo para un solo invernadero (`PRODUCT.md`): cuidadores de pie, a menudo en móvil, anotan plantas y riegos en segundos. Tipografía única Source Sans 3 (corte humanista tipo Frutiger), sentence case en contenido y marca, densidades táctiles ≥ 44 px, pictogramas en cuadrado negro, y motion de banda tipo split-flap que se apaga con `prefers-reduced-motion`.

**Key Characteristics:**
- Banda shell amarilla Schiphol (`#ffcc00`) con marca sentence-case y título de pantalla
- Amarillo solo en banda shell y botones primario amarillo-negro (más selección de texto e inversión de hover del primario)
- Intervalo de riego como cifra monumental tabular
- Cabeceras de tabla negro + texto blanco; éxito en gris `#ececec`
- Bordes negros de 2 px, radios cortos (4–6 px), sin sombras
- Voz en español: tuteo, frases cortas, sin jerga técnica

## Colors

Paleta de señalética: amarillo de orientación + negro de lectura + grises de andén. Contraste de texto ≥ 4.5:1.

### Primary
- **Sign black** (`#0b0b0b` / `--color-primario`, `--color-texto`, `--color-sobre-shell`): texto, bordes estructurales, hover invertido de botones, cabeceras de tabla, outline de foco, fondos de pictograma.
- **Schiphol yellow** (`#ffcc00` / `--color-shell`, `--color-acento`, `--color-sobre-primario`): banda shell, relleno del botón primario en reposo, texto/pictograma del primario en hover, selección de texto. No rellena éxito, thead ni hovers de fila.

### Neutral
- **Apron gray** (`#e6e6e6` / `--color-fondo`): fondo de página y hover de fila de tabla.
- **Board white** (`#ffffff` / `--color-superficie`): formularios, filas, vacíos, historial, texto de thead, texto de pictograma sobre negro.
- **Success wash** (`#ececec` / `--color-exito-fondo`): fondo de mensaje de éxito (gris, no amarillo).
- **Secondary ink** (`#3a3a3a` / `--color-texto-secundario`): ayudas, carga, metadatos.
- **Divider gray** (`#bdbdbd` / `--color-borde`): separadores de fila en tabla.
- **Field edge** (`#6e6e6e` / `--color-borde-campo`): borde de inputs en reposo.

### Status
- **Error red** (`#b3261e` / `--color-error`) sobre **Error wash** (`#fbecea` / `--color-error-fondo`): mensajes y campos en error; el error nunca es solo color. Pictograma de error: cuadrado rojo + trazo blanco.
- **Warning amber** (`#8a5300` / `--color-aviso`) y **Warning wash** (`#fbf1df` / `--color-aviso-fondo`): reservados en tokens para E2; la UI E1 no los usa aún.

### Named Rules
**The Yellow Is Chrome Rule.** El amarillo Schiphol vive solo en la banda shell y en el botón primario amarillo-negro (reposo + inversión de hover). No tiñe éxito, thead, hover de fila ni fondos de página.

**The No Botanical Palette Rule.** Prohibidos el verde invernadero y el violeta mágico del sistema anterior. Sin degradados ornamentales ni glow.

## Typography

**Display Font:** Source Sans 3 (fallback Source Sans Pro, system-ui)
**Body Font:** Source Sans 3 (mismos pesos 400 / 600 / 700 vía Google Fonts en `client/index.html`)
**Data / Monument:** Source Sans 3 con `font-variant-numeric: tabular-nums`

**Character:** Un solo corte humanista de señalética: denso, legible a distancia de brazo, sin serifa display ni mono ornamental.

### Hierarchy
- **Brand mark** (700, 14 px, `letter-spacing: 0.02em`, sentence case): solo «Invernadero Encantado» dentro de la banda shell. Sin `text-transform: uppercase`. No reutilizar como kicker de sección.
- **Display / band title** (700, `clamp(2rem, 6vw, 2.75rem)`, line-height 1.2): título de pantalla en la banda (Plantas, nombre de planta, estados).
- **Headline** (700, 22 px): `h2` de sección (Lista, Historial, formularios).
- **Title (mobile list name)** (700, 24 px): nombre de planta en tarjeta móvil; sin subrayado en reposo.
- **Body** (400, 16 px, line-height 1.5): párrafos, campos, celdas. Mínimo de UI: 14 px.
- **Label / table head** (700, 14 px, uppercase, `letter-spacing: 0.04em`): cabeceras de tabla (texto blanco sobre negro).
- **Monument interval** (700, 28 px, line-height 1, tabular; unidad 14 px / 600): `intervaloRiegoDias` + «días».

### Named Rules
**The Gate Number Rule.** El intervalo de riego se tipografía como número de puerta (`intervalo-monumento`), nunca como chip pastel ni texto corrido del mismo peso que el cuerpo.

**The Sentence Case Rule.** Contenido, CTAs y marca de banda en sentence case. Uppercase solo en cabeceras de tabla.

## Layout

Shell a columna completa: banda amarilla edge-to-edge, luego cuerpo centrado (`max-width: 960px`). Padding de banda: 16×24 móvil, 24×48 desde 768 px. Padding de cuerpo: 24 móvil, 32×48 desde 768 px. Ritmo vertical: `--espacio-4` entre campos, `--espacio-5` dentro de paneles, `--espacio-6` entre secciones.

**Plantas:** lista (o su estado) primero; formulario de alta debajo en panel bordeado. Bajo 768 px la tabla se convierte en tarjetas apiladas con `data-label`.
**Detalle:** Volver → metadatos con intervalo monumental → historial → formulario de riego. Un solo primario por vista.

### Named Rules
**The Band First Rule.** Toda pantalla empieza con banda amarilla (marca + `h1`); el trabajo vive debajo, nunca dentro del amarillo.

## Elevation & Depth

Sistema plano. No hay `box-shadow`. La profundidad viene de contraste tonal (amarillo / negro / blanco / gris) y de bordes negros de 2 px en paneles, tabla, vacíos y mensajes.

### Named Rules
**The Flat Board Rule.** Sin sombras, sin blur, sin elevación material. Separación = borde + espacio.

## Shapes

Radios cortos de señalética: controles y campos a 4 px (`--radio-control`); paneles, mensajes, filas/tarjetas a 6 px (`--radio-tarjeta`). Bordes estructurales 2 px sólidos en negro (o error). Vacíos: borde 2 px dashed negro. Focus visible global: outline 3 px negro, offset 2 px (4 px en el `h1` de banda). Pictogramas de acción/feedback: cuadrados de 28–32 px sin radio (esquina viva).

### Named Rules
**The Short Radius Rule.** Nada de píldoras ni radios grandes; 4–6 px es el techo.

## Components

### Shell band (`.app-banda`)
Banda full-bleed Schiphol yellow, texto negro, borde inferior 4 px negro. Contiene marca sentence-case «Invernadero Encantado» + `h1` de pantalla (`tabIndex={-1}` para foco al navegar). Animación firma `flap-in` (180 ms, `steps(2, end)`, clip-path inset): al montar/cambiar pantalla simula update split-flap. Con `prefers-reduced-motion: reduce`, sin animación (cambio instantáneo).

### Buttons (`Boton`)
- **Shape:** radio 4 px; min-height 44 px; padding 8×16×8×8; peso 700; 18 px; gap 12 px.
- **Pictogram:** cuadrado negro 32×32 con flecha stroke square/miter (amarillo sobre negro en primario; blanco sobre negro en secundario). En hover del primario el cuadrado se invierte (amarillo + flecha negra); en secundario, blanco + flecha negra.
- **Primary:** relleno amarillo, borde 2 px negro, texto negro. Hover: fondo negro + texto amarillo. Active: `translateY(1px)`.
- **Secondary:** transparente, borde 2 px negro, texto negro. Hover: fondo negro + texto blanco (sin amarillo).
- **Disabled:** opacity 0.45. Transición 120 ms; off bajo reduced-motion.

### Inputs / Fields (`Campo`)
Etiqueta 16 px / 700 encima del control. Control blanco, borde 1 px `#6e6e6e`, radio 4 px, min-height 44 px. Focus: borde 2 px negro (padding compensado). Error: borde 2 px rojo + texto de error con icono SVG stroke circular (inline, no cuadrado). Ayuda en secondary ink 14 px. Etiquetas reales (`htmlFor` / `id`); `aria-invalid` / `aria-describedby` cuando aplica.

### Messages (`Mensaje`)
- **Carga:** texto secondary, sin caja ni animación («Cargando…»). Sin spinners.
- **Éxito:** fondo `#ececec`, borde 2 px negro, pictograma cuadrado negro 28×28 con check stroke blanco square/miter, `role="status"`.
- **Error:** fondo error-wash, borde/texto rojo, pictograma cuadrado rojo 28×28 con cruz stroke blanca, `role="alert"`; slot opcional de acción (Reintentar).
- Entrada 160 ms con easing steps; off bajo reduced-motion.

### List / table (Plantas)
Tabla blanca con borde 2 px negro. Thead negro + texto blanco uppercase. Hover de fila: apron gray (`#e6e6e6`), sin amarillo. Enlaces de nombre: 700, underline 2 px. Intervalo en celda con monumento. Móvil: thead oculto; cada fila es tarjeta bordeada; nombre a 24 px sin underline en reposo.

### Detail cards (Detalle)
Ítems de historial en grid (fecha tabular 18/700 + detalle 14 secondary). Formularios y vacíos: panel blanco, borde 2 px (dashed en vacío). CTAs de vacío/reintento: texto 700 subrayado, zona ≥ 44 px, sin botón relleno.

### Interval monument
Patrón global `.intervalo-monumento` + unidad «días». Usado en lista y detalle. Es el dato de wayfinding del dominio.

## Do's and Don'ts

### Do:
- **Do** poner marca sentence-case «Invernadero Encantado» + título de pantalla en la banda amarilla de cada vista.
- **Do** tipografiar el intervalo con `.intervalo-monumento` (28 px tabular + unidad).
- **Do** usar pictogramas en cuadrado negro (flecha en `Boton`; visto/error en `Mensaje`).
- **Do** usar solo tokens de `client/src/styles/tokens.css` para color, tipo, espacio y radio.
- **Do** respetar `prefers-reduced-motion` en banda, botones, campos, mensajes y hovers.
- **Do** escribir UI en español con tuteo y frases cortas; errores con texto accionable.
- **Do** mantener zonas táctiles ≥ 44 px y foco `:focus-visible` negro de 3 px.

### Don't:
- **Don't** reintroducir verde botánico, violeta mágico, Bricolage Grotesque ni Atkinson Hyperlegible.
- **Don't** usar el amarillo fuera de banda shell y botón primario amarillo-negro (ni en thead, hover de fila ni éxito).
- **Don't** poner uppercase en la marca de banda; la marca va en sentence case.
- **Don't** añadir sombras, glows, píldoras full-radius, emojis ni librerías de UI/CSS.
- **Don't** poner kickers uppercase de contenido fuera de las cabeceras de tabla.
- **Don't** mostrar códigos HTTP, ObjectId ni jerga de API al cuidador.
- **Don't** usar `scroll-behavior: smooth` incondicional ni spinners como único estado de carga.
