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

## 3. Guided Demo Cursors, States & Canvas Camera Follow-Zoom

Use this kit whenever building interactive product demos, cursor-driven walkthroughs, or deterministic `renderAt(t)` recordings with **3-state cursors** (Arrow, Pointing Hand, Grabbing/Clicking Hand), **click ripples**, and **canvas follow-zoom**.

### 3A. Three-State Cursor Markup & CSS
Place `#demoCursor` and `#demoRipple` inside `#cameraRig` (the zoomed canvas layer) so cursor, ripples, and UI share the exact same coordinate space:

```html
<div class="demo-cursor" id="demoCursor" aria-hidden="true">
  <!-- 1. Default Arrow Pointer -->
  <svg class="demo-cursor-svg demo-cursor-arrow" width="22" height="24" viewBox="0 0 22 24" fill="none">
    <path d="M3.2 2.2L18.4 12.6L11.1 13.8L7.6 20.6L3.2 2.2Z" fill="#111113" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>
  <!-- 2. Pointing Hand (auto-shown when hovering clickable targets) -->
  <svg class="demo-cursor-svg demo-cursor-hand" width="18" height="18" viewBox="3 3 19 19" fill="none">
    <path d="M8.26999 16.28C7.98999 15.92 7.63999 15.19 7.02999 14.28C6.67999 13.78 5.81999 12.83 5.55999 12.34C5.37257 12.0422 5.31818 11.6797 5.40999 11.34C5.56695 10.6942 6.17956 10.2658 6.83999 10.34C7.3508 10.4426 7.82022 10.693 8.18999 11.06C8.44817 11.3032 8.68566 11.5674 8.89999 11.85C9.05999 12.05 9.09999 12.13 9.27999 12.36C9.45999 12.59 9.57999 12.82 9.48999 12.48C9.41999 11.98 9.29999 11.14 9.12999 10.39C8.99999 9.82 8.96999 9.73 8.84999 9.3C8.72999 8.87 8.65999 8.51 8.52999 8.02C8.41116 7.53858 8.3177 7.05124 8.24999 6.56C8.12395 5.93171 8.21565 5.27922 8.50999 4.71C8.85939 4.38137 9.37192 4.29464 9.80999 4.49C10.2506 4.81534 10.5791 5.26966 10.75 5.79C11.0121 6.43039 11.187 7.10307 11.27 7.79C11.43 8.79 11.74 10.25 11.75 10.55C11.75 10.18 11.68 9.4 11.75 9.05C11.8193 8.68513 12.073 8.38232 12.42 8.25C12.7178 8.15863 13.0328 8.13808 13.34 8.19C13.65 8.25482 13.9247 8.43315 14.11 8.69C14.3417 9.2734 14.4703 9.8926 14.49 10.52C14.5168 9.97059 14.6108 9.42653 14.77 8.9C14.9371 8.66455 15.1811 8.49479 15.46 8.42C15.7906 8.35956 16.1294 8.35956 16.46 8.42C16.7311 8.51063 16.9682 8.68152 17.14 8.91C17.3518 9.44035 17.48 10.0003 17.52 10.57C17.52 10.71 17.59 10.18 17.81 9.83C17.9243 9.4906 18.211 9.23797 18.5621 9.16728C18.9132 9.09659 19.2754 9.21857 19.5121 9.48728C19.7489 9.75599 19.8243 10.1306 19.71 10.47C19.71 11.12 19.71 11.09 19.71 11.53C19.71 11.97 19.71 12.36 19.71 12.73C19.6736 13.3152 19.5933 13.8968 19.47 14.47C19.296 14.9771 19.0537 15.4582 18.75 15.9C18.2644 16.44 17.8632 17.0502 17.56 17.71C17.4848 18.0378 17.4512 18.3738 17.46 18.71C17.459 19.0206 17.4993 19.33 17.58 19.63C17.1711 19.6732 16.7589 19.6732 16.35 19.63C15.96 19.57 15.48 18.79 15.35 18.55C15.2857 18.4211 15.154 18.3397 15.01 18.3397C14.866 18.3397 14.7343 18.4211 14.67 18.55C14.45 18.93 13.96 19.62 13.62 19.66C12.95 19.74 11.57 19.66 10.48 19.66C10.48 19.66 10.66 18.66 10.25 18.3C9.83999 17.94 9.41999 17.52 9.10999 17.24L8.26999 16.28Z" fill="white" stroke="black" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.75 16.8259V13.3741C16.75 13.1675 16.5821 13 16.375 13C16.1679 13 16 13.1675 16 13.3741V16.8259C16 17.0325 16.1679 17.2 16.375 17.2C16.5821 17.2 16.75 17.0325 16.75 16.8259Z" fill="black"/>
    <path d="M14.77 16.8246L14.75 13.3711C14.7488 13.1649 14.5799 12.9988 14.3728 13C14.1657 13.0012 13.9988 13.1693 14 13.3754L14.02 16.8289C14.0212 17.035 14.1901 17.2012 14.3972 17.2C14.6043 17.1988 14.7712 17.0307 14.77 16.8246Z" fill="black"/>
    <path d="M12 13.379L12.02 16.8254C12.0212 17.0335 12.1901 17.2012 12.3972 17.2C12.6043 17.1988 12.7712 17.0291 12.77 16.821L12.75 13.3746C12.7488 13.1665 12.5799 12.9988 12.3728 13C12.1657 13.0012 11.9988 13.1709 12 13.379Z" fill="black"/>
  </svg>
  <!-- 3. Grabbing / Clicking Hand (shown on click, drag-shift, and press-and-hold) -->
  <svg class="demo-cursor-svg demo-cursor-grab" width="18" height="18" viewBox="66 3 19 19" fill="none">
    <path d="M72 7.15C72.48 6.97 73.43 7.08 73.68 7.62C73.93 8.16 74.08 8.86 74.09 8.69C74.0709 8.17329 74.1145 7.65618 74.22 7.15C74.3311 6.82581 74.5858 6.57115 74.91 6.46C75.2073 6.36597 75.523 6.34538 75.83 6.4C76.1404 6.46389 76.4153 6.64242 76.6 6.9C76.8339 7.48313 76.9659 8.10215 76.99 8.73C77.0149 8.19425 77.1056 7.6636 77.26 7.15C77.4271 6.91455 77.6711 6.74479 77.95 6.67C78.2806 6.60955 78.6194 6.60955 78.95 6.67C79.2214 6.76005 79.4587 6.93105 79.63 7.16C79.8424 7.69015 79.9706 8.25024 80.01 8.82C80.01 8.96 80.08 8.43 80.3 8.08C80.4767 7.55533 81.0453 7.27327 81.57 7.45C82.0947 7.62673 82.3767 8.19533 82.2 8.72C82.2 9.37 82.2 9.34 82.2 9.78C82.2 10.22 82.2 10.61 82.2 10.98C82.164 11.5652 82.0837 12.1469 81.96 12.72C81.7864 13.2273 81.5442 13.7084 81.24 14.15C80.7546 14.6901 80.3534 15.3003 80.05 15.96C79.976 16.288 79.9424 16.6238 79.95 16.96C79.949 17.2706 79.9893 17.58 80.07 17.88C79.6612 17.9237 79.2488 17.9237 78.84 17.88C78.45 17.82 77.97 17.04 77.84 16.8C77.7757 16.6711 77.644 16.5897 77.5 16.5897C77.356 16.5897 77.2243 16.6711 77.16 16.8C76.94 17.18 76.45 17.87 76.16 17.91C75.49 17.99 74.1 17.91 73.02 17.91C73.02 17.91 73.21 16.91 72.79 16.55C72.37 16.19 71.96 15.77 71.65 15.49L70.82 14.57C70.2347 14.0267 69.8064 13.3359 69.58 12.57C69.37 11.63 69.39 11.18 69.58 10.8C69.7738 10.4862 70.0764 10.2548 70.43 10.15C70.7238 10.0967 71.0262 10.1173 71.31 10.21C71.5063 10.2922 71.6759 10.4272 71.8 10.6C72.03 10.91 72.11 11.06 72.01 10.72C71.91 10.38 71.69 10.13 71.58 9.72C71.3658 9.23579 71.2373 8.71813 71.2 8.19C71.2204 7.70923 71.5406 7.29308 72 7.15Z" fill="white" stroke="black" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="M79.75 14.8259V11.3741C79.75 11.1675 79.5821 11 79.375 11C79.1679 11 79 11.1675 79 11.3741V14.8259C79 15.0325 79.1679 15.2 79.375 15.2C79.5821 15.2 79.75 15.0325 79.75 14.8259Z" fill="black"/>
    <path d="M77.77 14.8246L77.75 11.3711C77.7488 11.165 77.5799 10.9988 77.3728 11C77.1657 11.0012 76.9988 11.1693 77 11.3754L77.02 14.8289C77.0212 15.035 77.1901 15.2012 77.3972 15.2C77.6043 15.1988 77.7712 15.0307 77.77 14.8246Z" fill="black"/>
    <path d="M75 11.3799L75.02 14.8245C75.0212 15.0331 75.1901 15.2012 75.3972 15.2C75.6043 15.1988 75.7712 15.0287 75.77 14.8201L75.75 11.3755C75.7488 11.1669 75.5799 10.9988 75.3728 11C75.1657 11.0012 74.9988 11.1713 75 11.3799Z" fill="black"/>
  </svg>
</div>
<div class="demo-ripple" id="demoRipple" aria-hidden="true"></div>
```

```css
.demo-cursor { position: absolute; top: 0; left: 0; z-index: 100; pointer-events: none; opacity: 0; will-change: transform, opacity; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.45)); }
.demo-cursor-hand, .demo-cursor-grab { position: absolute; top: -2px; left: -5px; display: none; transform-origin: 7px 4px; }
.demo-cursor.is-hand .demo-cursor-arrow, .demo-cursor.is-grabbing .demo-cursor-arrow { display: none; }
.demo-cursor.is-hand .demo-cursor-hand { display: block; }
.demo-cursor.is-grabbing .demo-cursor-grab { display: block; transform: scale(0.92); }
.demo-cursor.is-clicking .demo-cursor-arrow { transform: scale(0.84); }
```

### 3B. Hover Hit-Testing & Canvas Camera Follow-Zoom Logic
- **Canvas Headroom Rule (Never Clip the Mockup)**: Give `.stage` generous padding (`padding: 96px 110px 110px;`) and scale the whole canvas in `fitStage()` so the mockup sits with ~100px of breathing room at `1.0x`. Keep `.controls` `position: fixed; bottom: 16px;` outside `.stage`.
- **Zoom & Follow Math (`applyCamera`)**:
  ```js
  function applyCamera(focusX, focusY, zoom) {
    currentCamZoom = zoom;
    const rawTx = (cx - focusX) * (zoom - 1) * 0.78;
    const rawTy = (cy - focusY) * (zoom - 1) * 0.78;
    const tx = clamp(rawTx, -72, 72);
    const ty = clamp(rawTy, -96, 96);
    cameraRig.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`;
  }
  ```
- **Coordinate Mapping Under Zoom**: Divide `getBoundingClientRect()` offsets relative to `cameraRig` by `stageScale * currentCamZoom` in both `getPt()` and `isCursorOverClickable(curX, curY)`.
- **State Switching**:
  - Clicking/dragging/holding: set `is-grabbing` (and `is-clicking` for arrow scale).
  - Hovering clickable controls (when not grabbing): toggle `is-hand` via `isCursorOverClickable(curX, curY)`.
  - Manual Pause Mode: on `pointermove` inside `#cameraViewport`, set `camZoom` target to `1.38` and follow pointer; reset to `1.0` on `pointerleave`.

---

## 4. AI & Live Activity Widget Cards
- **Pure black (`#050506`) or neutral dark (`#141417`)** rounded cards (`--r-card: 28px`, or `h/2` for compact pills) with a hairline inner highlight (`1px solid rgba(255,255,255,0.08)`).
- **One Accent Per Card**: Used strictly for the hero metric, icon tile (`accent` at `15%` alpha), and active progress fills.
- **Smooth Column Restacking**: When a card morphs between compact and expanded height (`morph(T, P, a, b)`), compute cumulative `y` positions dynamically so cards below slide down smoothly with zero overlap.

---

## 5. Anti-Slop Quality Checklist
Before shipping any UI, interaction, or animation:
- [ ] **No generic AI gradients or crude wireframe SVGs**: Never use loud 2-stop neon/pink-purple gradient blobs as fake photos or avatars. Use real high-res photography (`object-fit: cover` + subtle bottom scrim) for media/travel/food/profile cards, and multi-layered vector art (3D radial sphere shading, clipped continents, metallic gradients, tinted glass, multi-spoke wheels, `preserveAspectRatio="xMidYMid meet"`) for product/EV/globe/weather illustrations.
- [ ] **Editorial Color Discipline (Avoid Single-Color Overload)**: Do not paint every button, pill, bar, and toggle the same bright accent color. Use **Ink (`#141416` in light / `#F4F4F5` in dark)** for primary neutral controls, and reserve purposeful per-domain accents (**Emerald** `#059669` for finance/crypto/EV, **Indigo** `#4F46E5` for AI/audio, **Teal** `#0D9488` for live telemetry, **Rose** `#E11D48` for health/BPM).
- [ ] **Every Card Must Feel Alive**: Pair spring-gliding selection pills (`calPill`), expanding radar pulse rings, Ken Burns photo pans, streaming AI text, area-filled sparklines with glowing tip dots, beating BPM icons, and floating product shadows so no widget looks static.
- [ ] **No layout jitter**: All animating numbers use `tabular-nums` (`tnum`) and fixed-width containers or `roll()` odometers.
- [ ] **No binary pops**: Icons, labels, and badges crossfade (`xswap`) or spring-scale rather than snapping at `p > 0.5`.
- [ ] **No jank**: Animate only `transform` and `opacity` (plus `clip-path` / `stroke-dashoffset` where appropriate). Avoid animating `width`/`height` on heavy DOM trees when `transform` or spring-interpolated layout works.
- [ ] **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` for interactive web UI (keep instant/fade transitions, disable large parallax/bounces).
