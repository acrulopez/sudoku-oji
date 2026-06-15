# Product

## Register

product

## Users

Casual everyday players reaching for a few quiet minutes — on a commute, over
coffee, winding down before bed. They are not competitive solvers chasing
leaderboards; they want a calm, frictionless puzzle they can pick up and put
down. Context is mobile, often one-handed, frequently interrupted. The job to be
done: a clean, distraction-free place to solve a Sudoku and feel a small,
satisfying sense of progress.

## Product Purpose

A cross-platform (iOS + Android) Sudoku game that is offline-first and built to
last. It exists to be the calm, no-nonsense Sudoku app a casual player keeps —
no ads, no coins, no popups, no dark patterns. Success looks like an interface
that disappears into the task: the grid is the hero, the tools (validated notes,
fast mode, fast pencil, undo) are there when wanted and invisible when not, and
nothing competes for attention. The architecture deliberately leaves room for
later additions (smart hints, technique catalog, score, streak) without
compromising the core calm.

## Brand Personality

Quiet, considered, trustworthy. Three words: **calm, precise, uncluttered.**
The reference touchstone is **NYT Games** (Sudoku/Wordle) — clean editorial
calm, generous whitespace, confident and legible typography, restraint over
decoration. The app should feel like a well-made everyday object: it earns trust
by being predictable and getting out of the way, not by demanding attention.
Delight is reserved for small, earned moments (a solve), never sprayed across
the surface.

## Anti-references

- **Ad-cluttered free puzzle games** — banners, interstitials, coin economies,
  "watch an ad to continue," nag popups, dark patterns. None of it, ever.
- **Loud / gamified UI** — confetti on every action, badges, aggressive
  saturated color, cartoon mascots, dopamine-bait. Calm is the whole point.
- **Generic AI/SaaS template look** — gradient blobs, decorative glassmorphism,
  identical icon-heading-text card grids, purple-on-white scaffold.
- Calm must not curdle into **sterile/corporate grey**: quiet ≠ joyless. Warmth
  comes from typography, spacing, and tactile feedback, not from noise.

## Design Principles

1. **The grid is the hero.** Every other element earns its place by serving the
   solve or steps aside. When in doubt, remove it.
2. **Tools disappear until wanted.** Notes, fast mode, fast pencil, undo, and
   erase are precise and discoverable, never clamoring. Familiar affordances
   over invented ones.
3. **Calm by default, feedback by exception.** Motion and color convey state
   (selection, conflict, completion) — never decorate. A solve can celebrate;
   a tap should not.
4. **Trust through predictability.** Same control vocabulary everywhere, no
   surprises, no ads, no friction. The app behaves the same way every time.
5. **Built to grow without getting louder.** New features (hints, technique
   catalog, score, streak) must fit the calm, not break it.

## Accessibility & Inclusion

Target **WCAG AA** as the floor. Two priorities baked in from the start:

- **Color-blind safe.** Conflicts, mistakes, and given-vs-entered digits must
  never be distinguished by color alone — pair color with weight, shape, an
  icon, or position. This is critical for a game whose error state is red.
- **High contrast & readability.** Strong text/background contrast (AA+ for body
  and digits), large legible numerals that hold up for older eyes and in bright
  outdoor light. Comfortable one-handed tap targets follow from the same intent.

Also honor `prefers-reduced-motion` as the calm-by-default posture extends
naturally to motion.
