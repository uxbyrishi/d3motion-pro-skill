# UI & Motion Architecture Patterns

## 1. Bento UI Motion Grid (4:3 or 16:9 Design System Flex)
- **Layout Table (`L`)**: Define columns whose card heights sum to the exact stage height (e.g., 5 columns summing to `720px` with `10px` gaps). Mix tall (`180–240px`), medium (`120–160px`), and thin (`54–80px`) cards.
- **Staggered Intro (`0 -> 1.6s`)**: Delay each card by `0.12 + (x / W) * 0.55 + (y / H) * 0.38`. Animate `scale(0.86 -> 1)` with `spring(p)`, `opacity` with `expo(p)`, and inner content `translateY(6px -> 0)`.
- **Independent Clocks**: Give each card its own period `P` (`2.2s–7.5s`) and phase offset `o` (`1.2s–4.5s`), plus ambient motion (equalizer bars, sparklines, pulse rings) so the grid feels alive without visual chaos.
- **Continuous Cycle Wrapping**: End state at `l = P` must match start state at `l = 0` of the next cycle.

---

## 2. Design Cursor Refine (Before -> After Storytelling)
A universal pattern for showing UI refinement, onboarding, or product value in one continuous shot:
1. **Enter (`0%–5%`)**: Figma-style cursor (`#0D99FF`, white `1.6px` stroke, `drop-shadow(0 2px 5px rgba(0,0,0,0.35))`) enters from top-right.
2. **Sequential Refine (`5%–90%`)**:
   - Cursor glides to element (`io(p)`).
   - **Rule**: Selection box (`1.5px solid #0D99FF`, `rgba(13,153,255,0.05)` fill) snaps on **upon arrival**.
   - Wait `0.1s–0.2s` *before* morphing the element's spacing, typography, radius, and colors (otherwise it breaks the illusion that the cursor triggered the polish).
3. **Exit (`90%–95%`)**: Cursor glides off-screen or fades out with a `"Done ✓"` pill.
4. **Hold (`95%–100%`)**: Hold the final polished UI for `1.5s–2.5s`.

---

## 3. AI & Live Activity Widget Cards
- **Pure black (`#050506`) or neutral dark (`#141417`)** rounded cards (`--r-card: 28px`, or `h/2` for compact pills) with a hairline inner highlight (`1px solid rgba(255,255,255,0.08)`).
- **One Accent Per Card**: Used strictly for the hero metric, icon tile (`accent` at `15%` alpha), and active progress fills.
- **Smooth Column Restacking**: When a card morphs between compact and expanded height (`morph(T, P, a, b)`), compute cumulative `y` positions dynamically so cards below slide down smoothly with zero overlap.

---

## 4. Anti-Slop Quality Checklist
Before shipping any UI, interaction, or animation:
- [ ] **No generic AI gradients or crude wireframe SVGs**: Never use loud 2-stop neon/pink-purple gradient blobs as fake photos or avatars. Use real high-res photography (`object-fit: cover` + subtle bottom scrim) for media/travel/food/profile cards, and multi-layered vector art (shadows, glass, metallic accents) for product/EV/weather illustrations.
- [ ] **No layout jitter**: All animating numbers use `tabular-nums` (`tnum`) and fixed-width containers or `roll()` odometers.
- [ ] **No binary pops**: Icons, labels, and badges crossfade (`xswap`) or spring-scale rather than snapping at `p > 0.5`.
- [ ] **No jank**: Animate only `transform` and `opacity` (plus `clip-path` / `stroke-dashoffset` where appropriate). Avoid animating `width`/`height` on heavy DOM trees when `transform` or spring-interpolated layout works.
- [ ] **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` for interactive web UI (keep instant/fade transitions, disable large parallax/bounces).
