---
name: Sudoku
description: A calm, uncluttered Sudoku game where the grid is the hero.
colors:
  focus-blue: "#2F6BFF"
  ink: "#1A1A1A"
  ink-muted: "#686D78"
  app-canvas: "#F2F3F7"
  surface: "#FFFFFF"
  peer-highlight: "#E8EBF2"
  same-value: "#D5DEF7"
  error-red: "#E5484D"
  grid-line: "#D3D6DE"
  grid-line-bold: "#6B7280"
  note-grey: "#6B7280"
  midnight-accent: "#5B8CFF"
  forest-accent: "#2E7D4F"
  sunset-accent: "#E8703A"
typography:
  display:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.15
  numeral:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.04em"
  caption:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: "12px"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.focus-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px 28px"
  list-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
  cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  cell-selected:
    backgroundColor: "{colors.focus-blue}"
    textColor: "{colors.surface}"
  numpad-digit:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
  numpad-digit-active:
    textColor: "{colors.focus-blue}"
    typography: "{typography.numeral}"
  tool-active:
    textColor: "{colors.focus-blue}"
  theme-swatch:
    rounded: "{rounded.md}"
    height: "64px"
    width: "96px"
---

# Design System: Sudoku

## 1. Overview

**Creative North Star: "The Quiet Grid"**

This is a Sudoku game that behaves like a still, orderly surface you think on —
paper-calm, never clamoring. The whole interface is built around a single act of
restraint: the 9×9 grid is the hero of every screen, and everything else (tools,
counts, timer, theme) recedes to the edges until the moment it's needed. The
reference touchstone is NYT Games — generous whitespace, confident typography,
state communicated through quiet tints rather than chrome. Depth is conveyed by
tonal layering (a near-white surface floating on a cool grey canvas) and hairline
rules, never by shadows.

The system explicitly rejects the ad-cluttered free-puzzle-app look (banners,
coins, popups, nag screens) and the loud/gamified look (confetti on every tap,
badges, saturated cartoon color, mascots). It is equally wary of the opposite
failure: calm must not curdle into sterile spreadsheet-grey. Warmth here is
carried by spacing, crisp numerals, and the four selectable palettes — not by
decoration. Color is a signal, not an ornament: a single accent ("Focus Blue" in
the default palette) marks selection, the active digit, and the current tool, and
appears nowhere else.

The product ships **four palettes** (Classic Light, Midnight, Forest, Sunset)
that share one structure: a canvas, a surface, ink, a muted ink, one accent, and
a small fixed set of grid-state tints. Any new screen must read correctly in all
four; design against the *roles*, never a hardcoded hex.

**Key Characteristics:**
- The grid is the hero; every other element earns its place or steps aside.
- Flat by default — tonal layering and hairlines, zero decorative shadow.
- One accent per palette, used only for state (selection / active / focus).
- System font throughout; hierarchy comes from weight and size, not families.
- Four palettes, one role structure — design against roles, never hex.

## 2. Colors

A cool, near-neutral base with a single confident accent and a tightly-scoped
vocabulary of grid-state tints. Values below are the default **Classic Light**
palette; the same roles are re-skinned by Midnight, Forest, and Sunset.

### Primary
- **Focus Blue** (`#2F6BFF`): The lone accent. Used *only* for state — the
  selected cell fill, the active number-pad digit, the active tool, the
  primary/"Continue" button, and the selected theme-swatch border. It never
  decorates and never appears on more than a small fraction of a screen.

### Neutral
- **App Canvas** (`#F2F3F7`): The cool light-grey behind everything. The page
  floor, deliberately *not* pure white, so the surface can float above it.
- **Surface** (`#FFFFFF`): Cells, list buttons, the win/lose card, the paused
  card, theme swatches — anything that lifts off the canvas by tone alone.
- **Ink** (`#1A1A1A`): Primary text and given (clue) digits. The high-contrast
  reading color.
- **Ink Muted** (`#686D78`): Secondary text — section labels, the timer,
  mistakes count, per-digit remaining counts. Tuned to clear WCAG AA (≥4.5:1) on
  the canvas so it stays legible even though it reads as "quiet." Each palette
  carries its own muted tone (Forest `#5C6B5E`, Sunset `#80654F`, Midnight
  `#8A8F98`), all AA-compliant against their backgrounds.
- **Grid Line** (`#D3D6DE`): Hairline borders between cells and around list
  buttons and cards.
- **Grid Line Bold** (`#6B7280`): The 2px separators between 3×3 boxes and the
  grid's outer frame. The structural skeleton of the board.
- **Note Grey** (`#6B7280`): Pencil-note digits inside an unfilled cell.

### Grid-State Tints (the signature vocabulary)
- **Peer Highlight** (`#E8EBF2`): Tints the row, column, and box of the selected
  cell. The faintest of the three tints.
- **Same Value** (`#D5DEF7`): Tints every cell sharing the selected cell's digit.
  A half-step stronger than peer highlight, toward the accent's hue.
- **Error Red** (`#E5484D`): Conflicting / mistaken digits. The only warm color
  in the default palette, reserved exclusively for errors.

### Alternate-Palette Accents (same role as Focus Blue)
- **Midnight Accent** (`#5B8CFF`), **Forest Accent** (`#2E7D4F`), **Sunset
  Accent** (`#E8703A`): each palette's single state color. Midnight is the only
  dark palette; the rest invert the canvas/surface relationship the same way.

### Named Rules
**The One Signal Rule.** Each palette has exactly one accent, and it is reserved
for state — selection, active digit, active tool, primary action. If you reach
for the accent to make something "pop," stop: emphasis comes from weight, size,
and space. An accent used as decoration breaks the calm the whole system exists
to protect.

**The Error-Only Red Rule.** Red is forbidden anywhere except a genuine
conflict or mistake. No red badges, no red dividers, no red "hot" styling. When
a player sees red, it means exactly one thing.

## 3. Typography

**Display / Body / Label Font:** System (SF Pro on iOS, Roboto on Android). One
family throughout — this is product UI, not a brand surface; a display/body
pairing would only add noise.

**Character:** Neutral, legible, native. The font does no talking; hierarchy is
built entirely from weight (400 → 600 → 800) and size. Playing numerals are the
one place type carries personality — large, light-weight, and airy inside the
grid.

### Hierarchy
- **Display** (800, 40px, line-height 1.1): The "Sudoku" home title only.
- **Headline** (800, 28px): The win/lose result text ("Solved! 🎉", "Out of
  mistakes").
- **Numeral** (400, 34px in the pad / 26px in a cell, line-height 1): The playing
  digits. Light weight at large size keeps the board breathing rather than dense.
  Notes render at 9px in a 3×3 micro-grid inside the cell.
- **Title** (600, 18px): Difficulty list-button labels.
- **Body** (400, 15px; primary-button label 700, 17px): Stats row, in-card
  messages, secondary actions.
- **Label** (600, 13px, uppercase, letter-spacing 0.04em): Section headers
  ("New game", "Theme"). The only uppercase in the system.
- **Caption** (400, 12px): Per-digit remaining counts and other micro-text.

### Named Rules
**The Light-Numeral Rule.** Playing digits stay at weight 400 no matter how
large. Given clues and player entries are distinguished by *color* (ink vs.
accent) and never by making one bold — bold numerals read as "error" or
"emphasis" and muddy the board.

**The One-Family Rule.** No second typeface, ever. If a screen needs more
hierarchy, it gets there with weight and size, not a new font.

## 4. Elevation

**This system has no shadows.** Depth is built entirely from *tonal layering* and
*hairline rules*: the white surface sits visibly above the cool-grey canvas, and
1px grid lines plus 2px box separators give the board its structure. This is a
deliberate flat-by-tone aesthetic, not an oversight — shadows would add a soft,
"floating card" quality at odds with the precise, paper-calm North Star.

### Named Rules
**The Flat-By-Tone Rule.** Never add `box-shadow`, elevation, or drop shadows to
lift an element. Separate it by putting it on `surface` over `app-canvas`, or by
a hairline border in `grid-line`. If two surfaces need distinguishing and tone
isn't enough, the layout is too crowded — remove something instead.

**The Hairline Rule.** Borders are 1px (`grid-line`) by default. The only heavier
stroke is the 2px `grid-line-bold` that marks 3×3 box boundaries and the board's
outer frame — structural, never decorative.

## 5. Components

Components are **refined and restrained**: minimal chrome, flat surfaces, color
only to signal state. Controls recede until the player needs them.

### Buttons
- **Shape:** Generously rounded (14px / `rounded.lg`).
- **Primary** ("Continue game", "New game" in the win/lose card): solid
  `focus-blue` fill, white label (700, 17px / 16px), vertical padding 16px,
  full-width or hugging.
- **List button** (difficulty rows): `surface` fill, 1px `grid-line` border,
  14px radius, ink label (600, 18px) left, muted chevron (›) right, padding
  18px × 20px. The standard "tap to go" affordance.
- **States:** Pressed state is the platform default (opacity dip via
  `Pressable`); no custom hover. Keep it that way — these are touch targets.

### Number Pad
- **Style:** Text-only. No button chrome, no borders, no fills — just the digit
  (34px, weight 400) with its remaining count (12px, muted) tucked beneath.
- **States:** Default = ink. **Active** (the selected fast-mode digit) = Focus
  Blue. **Exhausted** (zero remaining) = muted grey at 0.35 opacity and disabled.
- This is the purest expression of the system: a control that is almost entirely
  typography.

### Tools (Undo / Erase / Fast Pencil / Pencil)
- **Style:** Icon (24px) above a 13px label, ~64px min target, centered.
- **States:** Default = ink. **Active** (Pencil on) = Focus Blue, with a small
  pill badge ("ON"/"OFF") top-right. **Disabled** (Undo with empty history) =
  muted grey.

### Cards / Containers
- **Win/Lose & Paused cards:** `surface` fill, 1px `grid-line` border, 12–16px
  radius, centered content. No shadow (see Elevation).
- **Theme swatch:** 96×64, 12px radius, the palette's own `background` as fill
  with a `primary` dot and theme name inside. Selected = 3px `primary` border;
  unselected = 1px `grid-line`.

### Navigation / Header
- **Game header:** A back arrow (←) left, a fast-mode toggle pill (⚡) right; a
  muted stats row beneath (mistakes · difficulty · timer-with-pause). Tapping the
  timer pauses. The fast toggle fills with `primary` when on, `highlight` when
  off. All secondary text is muted; the header never competes with the board.

### The Board (Signature Component)
- A flat 9×9 grid filling the available width (`aspect-ratio: 1`). Cells are
  `surface` by default and re-tint by state, in this precedence: **selected**
  (`focus-blue`, white digit) > **peer** (`peer-highlight`) > **same-value**
  (`same-value`). Conflicts render the digit in `error-red`. Hairline `grid-line`
  borders separate cells; 2px `grid-line-bold` separates the nine boxes and
  frames the board. This component *is* the product — it gets the most space, the
  most contrast, and the most care.

## 6. Do's and Don'ts

### Do:
- **Do** treat the grid as the hero. Give it the most space and contrast on any
  screen; everything else recedes to the edges.
- **Do** design against color *roles* (`surface`, `ink`, `primary`, …), never a
  hardcoded hex. Every screen must read correctly in all four palettes including
  the dark Midnight one.
- **Do** convey depth with tone and hairlines: `surface` over `app-canvas`, 1px
  `grid-line` borders, 2px `grid-line-bold` for box structure.
- **Do** reserve the accent for state — selection, active digit, active tool,
  primary action — and nothing else (The One Signal Rule).
- **Do** distinguish given clues from player entries by color (ink vs. accent),
  keeping both numerals at weight 400 (The Light-Numeral Rule).
- **Do** pair every error signal with more than color — position, an icon, or a
  shape — so conflicts are legible to color-blind players (WCAG AA is the floor).
- **Do** keep all text at AA contrast (≥4.5:1; ≥3:1 for large/bold), `ink-muted`
  included — it carries must-read secondary info (mistakes, remaining counts,
  timer), so it is tuned per palette to clear AA. If you re-skin a palette, hold
  every text role to that bar; "quiet" never means "low-contrast."

### Don't:
- **Don't** add `box-shadow`, glassmorphism, or any "floating card" elevation.
  This system is flat by tone (The Flat-By-Tone Rule).
- **Don't** use the accent — or any saturated color — as decoration. If you're
  reaching for color to make something "pop," use weight, size, or space instead.
- **Don't** use red for anything but a genuine conflict or mistake (The
  Error-Only Red Rule). No red badges, dividers, or "hot" styling.
- **Don't** introduce a second typeface or bold the playing numerals for
  emphasis. One family, weight-and-size hierarchy only.
- **Don't** drift toward the ad-cluttered free-puzzle-app look: no banners,
  coin/streak bait, interstitials, popups, or nag screens.
- **Don't** drift toward the loud/gamified look: no confetti on routine actions,
  badges, cartoon mascots, or saturated full-bleed color. Celebration is reserved
  for a genuine solve.
- **Don't** over-correct into sterile spreadsheet-grey. Calm is not joyless —
  warmth comes from generous spacing, airy numerals, and the palette, not noise.
- **Don't** use side-stripe accent borders (`border-left`/`border-right` > 1px as
  a colored stripe) on cards or list rows. Use full hairline borders or tone.
