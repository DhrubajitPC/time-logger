<!-- Migrated 2026-07-10: the codebase now implements this spec (tokens in src/index.css, components aligned). Existing synced category colors keep their saved values until recolored in Manage categories. -->

---
name: Time Pop
description: A calm, warm time-tracking PWA — Things-like focus with a sunlit undertone.
colors:
  clay: "#B4543B"
  clay-deep: "#9A4630"
  clay-wash: "#F5E6DF"
  ink: "#2E2A24"
  text-muted: "#6B635A"
  bg-warm: "#FAF7F2"
  surface: "#FFFFFF"
  line: "#E7E1D8"
  cat-ochre: "#B98A2E"
  cat-ochre-tint: "#F1E8D4"
  cat-moss: "#4E9569"
  cat-moss-tint: "#DDEBE1"
  cat-indigo: "#6470B8"
  cat-indigo-tint: "#E3E6F4"
  cat-rose: "#C05C86"
  cat-rose-tint: "#F3E0E9"
typography:
  display:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Nunito, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.clay-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.clay}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  chip-category:
    backgroundColor: "{colors.cat-moss-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: Time Pop

## 1. Overview

**Creative North Star: "The Sunlit Desk"**

A tidy desk in morning light: warm-tinted surfaces, calm order, everything in its place. The interface is a quiet plane of warm off-white on which white cards sit like sheets of paper, separated by hairlines and soft, neutral light — never by loud color. One clay accent marks the single thing that matters right now (the running timer, the primary action); four muted category colors identify data and nothing else. This is a rework target: the system deliberately retires the original candy-pop skin — display fonts, coral glow shadows, bubble radii — while keeping its warmth in quieter forms.

The system explicitly rejects the corporate SaaS dashboard (navy/gray KPI density), the childish kids app (mascots, bounce, crayon primaries), the dark techy tracker (terminal monospace), and cluttered data-dense UI. Familiar affordances — tabs, sheets, lists — rendered with warmth and care, so a fluent Things or Apple Reminders user feels at home in one glance.

**Key Characteristics:**
- One hero per screen; everything else recedes
- Warm-tinted neutral ground (#FAF7F2), white paper surfaces, hairline structure
- A single clay accent used sparingly; category colors carry meaning, never decoration
- One typeface (Nunito) at a fixed rem scale; no display font
- Flat by default, gently layered; shadows are neutral light, never brand-colored

## 2. Colors

A restrained warm-neutral ground with one clay accent and four muted category colors used strictly as data.

### Primary
- **Baked Clay** (#B4543B, canonically oklch(0.55 0.12 35)): the only action color. Primary buttons, the live-timer surface, the active tab indicator, links. White text on clay holds ≥4.5:1; clay text on the warm ground holds ≥4.5:1.
- **Shadowed Clay** (#9A4630): hover/pressed shift of Baked Clay.
- **Clay Wash** (#F5E6DF): quiet selected-state fill (e.g. the chosen category in a picker). Never a decorative background.

### Neutral
- **Warm Ink** (#2E2A24): all headings and body text. A warm near-black, not gray — text is never lightened for elegance.
- **Field Stone** (#6B635A): secondary text — timestamps, durations in lists, helper copy. Holds ≥4.5:1 on both ground and surface.
- **Morning Ground** (#FAF7F2): the app background. A whisper of warmth (chroma ~0.006 toward the clay hue), far quieter than the old cream #FFF6EC.
- **Paper Surface** (#FFFFFF): cards, sheets, inputs — the planes that sit on the ground.
- **Hairline** (#E7E1D8): 1px borders and dividers; the primary tool for structure.

### Tertiary (category data colors)
Muted descendants of the original candy palette; each pairs a solid (dots, bars, ring) with a tint (row/chip fills within that category only):
- **Ochre** (#B98A2E / tint #F1E8D4) — Work
- **Moss** (#4E9569 / tint #DDEBE1) — Exercise
- **Dusk Indigo** (#6470B8 / tint #E3E6F4) — Reading
- **Rose Clay** (#C05C86 / tint #F3E0E9) — Chores

### Named Rules
**The One Clay Rule.** Baked Clay appears on at most ~10% of any screen: the primary action and the live timer. Its rarity is the signal — if clay stops standing for "the thing happening now," it has been overused.

**The Color-Is-Data Rule.** Category colors appear only where they identify a category (dot, chip, stat bar, entry row tint). They never decorate empty space, headers, or chrome.

## 3. Typography

**Body Font:** Nunito (with -apple-system, sans-serif fallback)

**Character:** One rounded humanist sans carries everything — its soft terminals supply the warmth the retired display font used to shout. Hierarchy comes from weight and a tight 1.2 scale, not from switching voices. Timer digits always set `font-variant-numeric: tabular-nums`.

### Hierarchy
- **Display** (700, 2.25rem/36px, 1.1, tabular-nums): the running-timer readout only. Nothing else earns this size.
- **Headline** (700, 1.375rem/22px, 1.25): screen titles.
- **Title** (700, 1.125rem/18px, 1.3): section headers ("Today"), sheet titles, card headings.
- **Body** (400, 0.9375rem/15px, 1.5; 600 for emphasis): entry rows, copy, form values. Prose capped at 65–75ch (rarely relevant on phone widths).
- **Label** (700, 0.8125rem/13px, sentence case): timestamps, durations, helper text, tab labels.

### Named Rules
**The Single Family Rule.** Fredoka is retired. New work never introduces a second family; hierarchy is weight and size within Nunito.

**The Sentence Case Rule.** No uppercase-tracked labels ("TRACKING · WORK" becomes "Tracking · Work"). Uppercase tracking left with the candy-pop skin.

## 4. Elevation

Flat by default, gently layered. Depth is conveyed by planes — white paper surfaces on the warm ground, separated by 1px Hairline borders — not by shadow. Shadows exist only where a layer genuinely floats above the page, and they read as soft neutral morning light.

### Shadow Vocabulary
- **Raised** (`box-shadow: 0 2px 8px rgba(46, 42, 36, 0.06)`): the live-timer card, at most one element per screen.
- **Overlay** (`box-shadow: 0 12px 32px rgba(46, 42, 36, 0.14)`): bottom sheets, menus, dialogs — layers that float.

### Named Rules
**The Morning Light Rule.** Shadows are cast by light, not by brand: always neutral warm-gray, never colored. The old coral glow (`rgba(255,107,87,0.35)`) is forbidden.

## 5. Components

### Buttons
- **Shape:** gently rounded (12px radius); comfortable ≥44px touch height
- **Primary:** Baked Clay fill, white text, 700 weight (14px 20px padding); one per screen
- **Hover / Focus:** darkens to Shadowed Clay over 150ms ease-out; 2px Baked Clay focus ring offset 2px
- **Ghost:** transparent fill, Baked Clay text at 700 — for secondary actions ("Manage", "Add entry"); no borders, no underline

### Chips (category pickers, range toggles)
- **Style:** pill-shaped (999px), category tint fill with Warm Ink text; unselected chips sit on Paper Surface with a Hairline border
- **State:** selected = tint fill + solid category-color dot; never a full-saturation fill

### Cards / Containers
- **Corner Style:** 16px radius — calm, not bubbly (28px is retired)
- **Background:** Paper Surface on Morning Ground
- **Shadow Strategy:** none at rest (see Elevation); Hairline border does the separating
- **Internal Padding:** 20px

### Inputs / Fields
- **Style:** Paper Surface fill, 1px Hairline border, 12px radius, Warm Ink text (12px 14px padding)
- **Focus:** border shifts to Baked Clay with a 2px soft ring; 150ms ease-out
- **Placeholder:** Field Stone — never lighter

### Navigation (tab bar)
- **Style:** bottom tab bar on Paper Surface with a top Hairline; two tabs (Track / Stats) plus swipe navigation between them
- **States:** active tab in Baked Clay (icon + 13px label at 700), inactive in Field Stone; transition 150ms ease-out; safe-area inset respected

### The Live Timer Card (signature)
The one place the system commits: a Baked Clay surface (16px radius, Raised shadow), white Display digits in tabular-nums, a small pulsing dot (crossfading to a static dot under reduced motion), and a white circular stop control. It is the hero of the Track screen — everything else on the screen stays on the neutral ground so the running timer owns the eye.

## 6. Do's and Don'ts

### Do:
- **Do** keep Baked Clay ≤10% of any screen — primary action and live timer only (The One Clay Rule).
- **Do** use category tints only inside that category's own row, chip, or bar (The Color-Is-Data Rule).
- **Do** separate surfaces with 1px Hairline (#E7E1D8) borders before reaching for shadows.
- **Do** keep motion 150–250ms ease-out, state-driven, with a `prefers-reduced-motion` alternative for every animation.
- **Do** set timer digits in tabular-nums at every size.
- **Do** keep touch targets ≥44px — this is a phone-first PWA.

### Don't:
- **Don't** look like a "corporate SaaS dashboard": no navy/gray KPI cards, no hero-metric blocks, no dashboard chrome (PRODUCT.md anti-reference).
- **Don't** tip into a "childish kids app": no mascots, no bounce or elastic easing, no crayon-primary palettes (PRODUCT.md anti-reference).
- **Don't** drift toward the "dark techy tracker": no dark mode, no monospace UI text (PRODUCT.md anti-reference).
- **Don't** build "cluttered data-dense UI": Stats shows one view at a time; no walls of numbers or chart overload (PRODUCT.md anti-reference).
- **Don't** use Fredoka or any second typeface in new work.
- **Don't** use colored shadows, 28px bubble radii, or uppercase-tracked labels — all retired with the candy-pop skin.
- **Don't** use side-stripe borders (`border-left` > 1px as accent), gradient text, or glassmorphism — banned outright.
