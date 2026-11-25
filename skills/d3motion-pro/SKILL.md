---
name: d3motion-pro
description: >-
  Build polished, physics-driven UI components, micro-interactions, and deterministic 60/120 FPS motion graphics
  using the D3 Motion (d3motion.pro) design system and motion engine. Use whenever asked to create interactive UI,
  spring-physics components (magnetic buttons, morph islands, jelly sliders, gooey menus, command palettes,
  odometer counters), bento motion grids, cursor-refine product demos, or HTML/CSS/Canvas animations that export
  cleanly to MP4 via d3motion.pro.
---

# D3 Motion Pro — UI, Interaction & Motion System

Use this skill to craft **high-taste, physics-driven UI, micro-interactions, and deterministic animations** that feel tactile in the browser and export frame-accurately at 60/120 FPS on [d3motion.pro](https://d3motion.pro/web).

## When to Use What

Pick the right mode for the user's request:

1. **Interactive UI & Micro-Interactions** (buttons, docks, sliders, modals, inputs, cards)
   - Use **Spring Physics** (`stiffness` / `damping`) + **Concentric Radii** + **Zero-Slop Tokens**.
   - Read [Design Tokens](./references/design-tokens.md) and [Interactions Catalog](./references/interactions.md).
2. **Deterministic Motion Graphics & Product Demos** (bento grids, AI widget showcases, promo films, HTML-to-MP4)
   - Drive every visual property from a pure function of time `t` (no `Math.random()`, no `Date.now()`, no CSS `@keyframes` that drift).
   - Expose `window.d3Motion = { renderAt(t, canvas), duration, fps, width, height }` for 0-dropped-frame export on `d3motion.pro`.
   - Read [Motion Engine](./references/motion-engine.md) and [UI & Motion Patterns](./references/ui-patterns.md).
3. **Drop-in Runtime Kit**
   - Copy or inline [d3motion-core.js](./scripts/d3motion-core.js) for both interactive springs (`createSpring`) and deterministic time helpers (`spring`, `soft`, `expo`, `roll`, `tw`, `kf`).
   - **Standalone HTML rule (`file://` safety):** When outputting a standalone `.html` file, inline the helpers inside a regular `<script>` instead of `<script type="module">` with `import ... from './...'`, because browsers block local ES module imports over `file://` due to CORS.

---

## Core Workflow

### Step 1: Set the Visual Foundation
- **Neutral Surfaces (Zero Blue Tint on Cards)**:
  - Dark mode: `--bg-app: #09090B`, `--bg-window: #0F0F12`, `--bg-card: #141417`, `--bg-elevated: #1C1C20`.
  - Light mode: `--bg-app: #F7F7F5`, `--bg-tray: #EEEEEA`, `--bg-card: #FFFFFF`.
- **Single Hero Accent**: Royal Signal Blue (`#2563EB` / `#3B82F6`) or one chosen brand accent. Never scatter competing neon colors.
- **Typography**: `Plus Jakarta Sans` or `Inter` with `font-variant-numeric: tabular-nums` (`tnum`) on every number that animates, tight negative tracking (`-0.02em` to `-0.03em`) on display headings.
- **Concentric Radius Rule**: `innerRadius = max(4, outerRadius - padding)`. If a card is `28px` with `10px` padding, inner tiles must be `18px` (or `14px` with `14px` padding).

### Step 2: Choose the Motion Language
- **Never use linear or generic `ease` for physical UI.** Use spring presets from [Motion Engine](./references/motion-engine.md):
  - `follow` (`900, 50`): Pointer-tracking elements (no overshoot, no lag).
  - `settle` (`280, 22`): Releasing a drag, landing on a value (1 subtle overshoot).
  - `soft` (`260, 24`): Large panels, sheets, layout shifts.
  - `lead` (`620, 36`) + `trail` (`190, 19`): Stretchy/rubber-band pills and docks.
  - `pop` (`520, 16`): Icon or badge pop on selection.
- **For time-driven / video exports**:
  - Use the **from-rest damped spring** `spring(p)` (zero initial velocity so frame 1 never jerks at 120 FPS).
  - Use `soft(p)` for opacity/color crossfades (never `expo(p)` on large color areas—it flashes).
  - **Crossfade state swaps (`xswap`)**: Never swap text or icon fills at a hard `p > 0.5` threshold. Layer both states and crossfade opacity.

### Step 3: Wire Deterministic Export (When Building Animations/Videos)
If the output is an animation, promo, or motion scene, always attach the D3 Motion Tier-1 hook:

```js
window.d3Motion = {
  duration: 6.0,   // seconds
  fps: 60,         // 60 or 120
  width: 1920,
  height: 1080,
  renderAt(t, canvas) {
    // 1. Update DOM or Canvas strictly for timestamp `t` (in seconds)
    draw(t);
    // 2. Return true ONLY if you painted directly into `canvas`
    return false;
  }
};
```

### Step 4: Verify Before Finishing
- **Interactive UI**: Check hover, press, drag, keyboard focus (`focus-visible`), and `prefers-reduced-motion`. Ensure zero layout shift when numbers tick (`tabular-nums` + fixed width/odometer).
- **Motion Scenes**:
  - Verify `t = 0` (pre-intro), `t = 0.5` (intro), mid-cycle, and `t = duration` (loop/hold) have no clipping, NaN, or sudden pops.
  - Confirm `window.d3Motion.renderAt(t)` renders identically when called out-of-order (e.g., `renderAt(3.2)` then `renderAt(0.4)`).

---

## Reference Index

| File | Purpose |
| :--- | :--- |
| [design-tokens.md](./references/design-tokens.md) | Complete dark/light CSS variables, typography scale, concentric radii, shadows |
| [motion-engine.md](./references/motion-engine.md) | Interactive RK4/Euler spring solver, deterministic `draw(t)` math, `window.d3Motion` spec |
| [interactions.md](./references/interactions.md) | 27 micro-interaction recipes (magnetic, jelly, gooey, morph island, OTP, hold, etc.) |
| [ui-patterns.md](./references/ui-patterns.md) | Bento motion grids, Design Cursor Refine, AI Live Activity widgets, anti-slop checklist |
| [d3motion-core.js](./scripts/d3motion-core.js) | Copy-pasteable JS runtime for springs, odometers, timelines, and `d3Motion` hooks |
