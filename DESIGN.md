---
name: "Saathi"
description: "A patient, bilingual workbook for building digital confidence."
colors:
  warm-ivory: "#FFF9F0"
  white: "#FFFFFF"
  deep-teal: "#174F4B"
  deep-teal-hover: "#123D3A"
  soft-sage: "#DCEBE1"
  sage-dark: "#C1D7CA"
  warm-orange: "#F2A65A"
  charcoal: "#263238"
  muted-text: "#435456"
  sage-divider: "#C7D9CE"
  promise-surface: "#F5F8F2"
typography:
  display:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "clamp(2.35rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "clamp(2.1rem, 4vw, 3.2rem)"
    fontWeight: 700
    lineHeight: 1.12
  title:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1.4
  action:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.45
rounded:
  control: "9px"
  button: "12px"
  notice: "14px"
  card: "16px"
  illustration: "22px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
    height: "58px"
  button-primary-hover:
    backgroundColor: "{colors.deep-teal-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.deep-teal}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
    height: "58px"
  language-select:
    backgroundColor: "transparent"
    textColor: "{colors.deep-teal}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
    height: "44px"
---

# Design System: Saathi

## Overview

**Creative North Star: "The Wide-Margin Learning Workbook"**

Saathi makes digital learning feel like a calm, well-spaced workbook: warm paper holds the page, deep teal gives the learner a clear next action, and sage margins give progress room to breathe. The system is friendly and practical rather than technical; large readable type, clear labels, and generous touch-sized controls make every step feel approachable.

On the shipped desktop home screen, a broad two-column lesson introduction balances copy with a drawn practice-phone scene, then resolves into three benefit columns and a quiet safety promise. At 390px, the Urdu experience switches to right-to-left Nastaliq and replaces that desktop hero with a stacked welcome and prominent lesson card; its full-width continue action and six-step path stay together in the first viewport. Across the lesson flow, the current instruction and its labelled fictional-phone action remain distinct but connected, and mistakes receive reassuring, actionable recovery.

**Key Characteristics:**
- Warm ivory reading canvas with restrained, functional teal emphasis.
- Visible progress steps, with orange reserved for the current step.
- Bilingual Noto Sans / Noto Nastaliq Urdu typography and true RTL flow.
- Safe, fictional practice screens with plain-language guidance and recoverable states.

## Colors

The palette pairs paper-warm neutrals with calm botanical greens; orange is a small, legible annotation for the active step rather than a competing action color.

### Primary
- **Deep Teal** (`deep-teal`): The brand mark, headings, primary actions, selected progress, and reassurance cues.
- **Deep Teal Hover** (`deep-teal-hover`): The darker resting response when a primary action is hovered.

### Secondary
- **Soft Sage** (`soft-sage`): Icon tiles, supportive backgrounds, and the unhurried visual margin around the lesson.

### Tertiary
- **Warm Orange** (`warm-orange`): The active numbered step, outlined in teal so its state is not conveyed by color alone.

### Neutral
- **Warm Ivory** (`warm-ivory`): The site canvas and unselected progress markers.
- **White** (`white`): Lesson cards and instruction panels that need clear separation from the page.
- **Charcoal** (`charcoal`): Primary reading text and high-contrast type.
- **Muted Text** (`muted-text`): Supporting descriptions and secondary copy.
- **Sage Divider** (`sage-divider`): Fine borders, rules, and card outlines.
- **Sage Dark** (`sage-dark`): A supporting green tone for tonal variation where a softer sage needs more weight.
- **Promise Surface** (`promise-surface`): The lightly tinted safe-practice notice.

**The Workbook Accent Rule.** Teal carries the action and the learning structure; orange marks the current step only. Keep the two roles distinct.

## Typography

**Display Font:** Noto Sans (with sans-serif fallback)  
**Body Font:** Noto Sans (with sans-serif fallback); Noto Nastaliq Urdu for Urdu content  
**Label/Mono Font:** Noto Sans; no separate mono face is used.

**Character:** Noto Sans keeps English directions open and familiar, while Noto Nastaliq Urdu gives Urdu its own natural cadence. Urdu uses a taller line rhythm so connected Nastaliq forms remain legible instead of being compressed into the Latin layout.

### Hierarchy
- **Display** (400, responsive `clamp(2.35rem, 5vw, 4rem)`, 1.09 line-height): The large desktop landing headline.
- **Headline** (700, responsive `clamp(2.1rem, 4vw, 3.2rem)`, 1.12 line-height): Lesson titles and major page headings.
- **Title** (700, 1.2rem, 1.3 line-height): Supporting section headings and family-support titles.
- **Body** (400, 1rem / 18px root size, 1.6 line-height): Instructions and explanations; keep reading measures constrained (usually 50–68ch).
- **Label** (800, 0.8rem, 1.4 line-height): Compact section labels and progress context.
- **Action** (700, 1rem, 1.45 line-height): Buttons and key interactive labels.

**The Urdu Line-Breath Rule.** Urdu content uses the Noto Nastaliq Urdu stack, 2 line-height for general content, and 1.9 for headings, buttons, and selects. Preserve enough vertical space for the script's descending forms.

## Layout

The layout uses wide, calm margins rather than dense dashboard grids. Desktop pages sit in a centered reading area up to 1100px wide, with the shared header extending to 1180px; the landing hero pairs copy and a practice illustration, and dashboards pair the lesson card with a narrow progress/achievement rail. Thin sage rules divide benefits, progress, and support content without boxing every section.

At 900px, header actions wrap and dashboard content becomes a single main column. At 680px, page gutters contract to 16px, the landing desktop hero gives way to the mobile learning start, the lesson card stacks its action above its progress strip, and secondary dashboard content becomes a single column. At the observed 390px Urdu width, the welcome, full-width continue button, reversed six-step row, and help link remain clearly ordered in the first viewport. Use logical inline/block spacing so RTL mirrors naturally.

The core spacing rhythm is 8 / 12 / 16 / 24 / 32px, with occasional tighter control-specific gaps. Keep the lesson instruction and its corresponding simulated-phone action together; do not make a learner hunt between dense columns.

## Elevation & Depth

Depth is mostly tonal and structural: white cards sit on warm ivory, sage tiles identify supportive controls, and fine borders define the workbook's columns and panels. A restrained teal-tinted shadow (`0 12px 30px rgb(23 79 75 / 10%)`) is reserved for the illustrated practice phone and its floating note; ordinary cards remain flat.

**The Quiet Lift Rule.** Reserve the soft shadow for the hero illustration; use paper, sage, and fine dividers to distinguish routine learning surfaces.

## Shapes

Controls and cards use gently rounded, familiar corners rather than a pill-heavy or sharp-edged language. Buttons use 12px corners, common cards 16px, notices 14px, and the hero illustration has a larger 22px frame; compact controls sit around 9px. The practice-phone illustration and simulator use a rounded device silhouette with a substantial teal rim. Dividers are one-pixel sage strokes; keep them subtle and let spacing do most of the separating.

## Components

### Buttons
- **Character:** Calm, generous actions that read clearly at a glance and remain easy to tap.
- **Shape:** Softly rounded corners (12px).
- **Primary:** Deep teal fill, white text, 13px × 22px padding, and a 58px minimum height; use for the next learning action.
- **Hover / Focus:** Hover darkens to deep teal-hover and lifts by 1px. Keyboard focus receives a double ring: 3px warm-ivory separation and a 3px warm-orange outer ring.
- **Secondary / Ghost:** Secondary actions are transparent with a 1px teal outline and sage hover fill. Text buttons use teal text, a 44px minimum height, and a sage hover wash.
- **Disabled:** Keep the label readable and reduce opacity rather than hiding the control.

### Cards / Containers
- **Corner Style:** Lesson cards use 16px corners; notices use 14px.
- **Background:** White for lesson and instruction cards; promise surfaces use a light sage-neutral tint.
- **Shadow Strategy:** Flat at rest; see the single hero-illustration exception in Elevation & Depth.
- **Border:** One-pixel sage-divider outline on primary cards and notices.
- **Internal Padding:** 30px on desktop lesson cards, tightening to 22px × 18px on narrow screens; the mobile landing lesson uses 20px × 18px.

### Inputs / Fields
- **Style:** The language picker is a native select with a transparent background, teal text, sage outline, 9px corners, and a 44px minimum height.
- **Focus:** Use the shared visible ivory-and-orange focus ring. Keep the browser's native selection affordance.
- **Error / Disabled:** Disabled controls remain legible at reduced opacity; service errors use a warm tinted notice with readable text and a retry action.

### Navigation
- **Style:** The header keeps the Saathi mark and tagline at the leading edge, with Home, My learning, language selection, and accessibility controls grouped at the opposite edge. Links are teal and bold without persistent filled tabs; hover uses a sage wash.
- **Mobile:** The header stacks its brand above wrapping controls. In RTL, the order and alignment follow document direction rather than fixed left/right positioning.

### Six-Step Progress Path
The progress path is the workbook's signature index: six 31px circular markers, with completed steps filled teal and the current step filled orange with a thicker teal outline and slight scale emphasis. Each step also has a number, check, accessible label, and current-step semantics; never rely on color alone. On narrow cards the path sits below a dividing rule and remains visible directly beneath the main action.

### Simulated Phone
The fictional phone is a teal-rimmed, paper-white practice surface with large, directly labelled choices. It changes screen by lesson step—app grid, sample contacts, call controls, simulated permissions, and practice call—while status feedback explains mistakes without penalty. Keep the explicit “practice only” framing visible and never style this simulation as a real device permission dialog.

### Safety Notice
The safe-practice promise is a bordered, softly tinted horizontal panel with a sage icon tile, teal title, and readable charcoal/muted copy. In the mobile practice layout it yields space to the main instruction and the simulated phone while remaining prominent on the lesson and landing pages.

## Do's and Don'ts

### Do:
- **Do** use the documented warm-ivory, deep-teal, soft-sage, warm-orange, charcoal, and white palette for their established roles.
- **Do** keep primary learning actions at least 44px high; the canonical primary button is 58px high.
- **Do** show step number or completion mark as well as color, and keep the active step visibly outlined.
- **Do** use Noto Nastaliq Urdu with the documented taller line-height and true RTL direction for Urdu.
- **Do** use plain, reassuring feedback and label simulated phone actions as practice.

### Don't:
- **Don't** compress the interface into dense dashboard rows or small-print instructions.
- **Don't** use orange as a second competing primary-action color.
- **Don't** indicate progress, permission state, or errors by color alone.
- **Don't** present fictional practice as a real call, real contact list, or real camera/microphone permission prompt.
- **Don't** flatten Nastaliq line-height to the Latin rhythm.
