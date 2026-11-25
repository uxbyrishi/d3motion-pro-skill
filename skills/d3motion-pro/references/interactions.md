# 27 Interactive Micro-Interaction Recipes

Every interaction below is built with **vanilla HTML/CSS/JS** (zero framework lock-in, easily portable to React/Vue/Svelte), **spring physics**, and **accessible keyboard/pointer handling**.

---

## 1. Buttons & Triggers
1. **Magnetic Button**: Track pointer offset `(dx, dy)` within an aura radius; spring-follow (`900, 50`) button `translate3d(dx*0.35, dy*0.35, 0)` and inner label `translate3d(dx*0.15, dy*0.15, 0)` for parallax depth. Snap back with `settle` (`280, 22`) on `pointerleave`.
2. **Hold-to-Confirm Button**: On `pointerdown` / `Space` keydown, fill a radial SVG ring or horizontal progress bar over `800ms–1200ms`. Cancel smoothly if released early; trigger `pop` (`520, 16`) + checkmark draw (`pathLength="1"`) on completion.
3. **Copy Button**: Crossfade copy icon -> animated SVG checkmark + `"Copied"` pill with `spring-pop`, auto-resetting after `1600ms`.
4. **Command Button**: Keyboard shortcut badge (`⌘K`) that depresses `translateY(1px)` on active/shortcut press with subtle inner rim highlight.
5. **Like Burst**: Heart icon scales `1 -> 0.8 -> 1.25 -> 1` (`pop` spring) while 6–8 radial particles burst outward along polar angles with decelerating radius and shrinking scale.
6. **Loading -> Success Button**: Width springs (`soft 260, 24`) from full label -> compact spinner circle -> expanded green success pill with drawn checkmark.

## 2. Navigation & Morphing
7. **Morph Island (Dynamic Island)**: Single container whose `width`, `height`, and `border-radius` are driven by independent springs (`260, 24`). Crossfade inner content layers (`opacity` + `blur(4px) -> blur(0px)`) during state transitions (idle pill -> music player -> call -> timer).
8. **Bottom Bar (Rubber Dock)**: Active pill highlight uses **dual-edge springs** — `lead` (`640, 38`) on the edge moving toward the target tab and `trail` (`150, 16`) on the lagging edge, creating organic liquid stretch.
9. **Goo Menu / Goo Morph**: Wrap circular trigger + orbiting action items in an SVG filter:
   ```xml
   <filter id="goo">
     <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
     <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"/>
     <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
   </filter>
   ```
   Animate items radially with staggered `spring-settle` delays.
10. **Morph Tooltip**: Shared floating tooltip surface that glides (`soft 260, 24`) between hovered triggers, resizing its bounding box and crossfading text without unmounting.
11. **Pagination Dots**: Active dot stretches into a capsule (`width: 8px -> 24px`) while neighbors compress slightly; optional progress fill inside the active capsule.

## 3. Sliders, Physics & Direct Manipulation
12. **Jelly Slider**: Track pointer `x` with `follow` (`900, 50`). Compute velocity `vx`; apply `scaleX(1 + |vx|*k)` and `scaleY(1 - |vx|*k*0.5)` (volume-preserving squash & stretch) plus slight `skewX` in direction of travel.
13. **Pull Cord**: Vertical SVG cubic Bézier cord (`M x0 y0 Q cx cy x1 y1`) attached to a draggable handle. On pull past threshold, toggle light/dark theme; on release, simulate damped harmonic oscillation on handle `(x, y)` and control point `(cx, cy)`.
14. **Number Stepper**: `-` / `+` buttons with odometer digit roll (`roll2`) and subtle container nudge (`translateX(±3px)`) in the direction of increment/decrement.
15. **Cookie Bite**: Interactive SVG mask/clipPath that removes circular bite arcs on click with crumb particles springing outward and a subtle shake (`rotate(±4deg)`).

## 4. Inputs, Pickers & Forms
16. **Command Palette**: `⌘K` modal with backdrop blur (`soft 260, 24`), `scale(0.96 -> 1)`, and sliding highlight pill behind the active/hovered row.
17. **Mention Picker (`@`)**: Inline floating popover anchored to caret coordinates; rows stagger in (`45ms` max total `<200ms`) with arrow-key spring highlight.
18. **OTP Code Input**: 6 individual digit boxes; typing auto-advances focus, pops the entered digit (`pop 520, 16`), and triggers a celebratory green wave (`stagger: 35ms`) on valid completion or horizontal damped shake on error.
19. **Password Strength**: Segmented bar + animated checklist rules where each satisfied rule draws its checkmark (`stroke-dashoffset: 1 -> 0`) and shifts color smoothly.
20. **Letter Limit**: Circular SVG progress ring around counter; transitions from muted -> amber -> red at 90%/100% with a micro-shake if user types past limit.
21. **Invite People**: Tag-chip input where added email/user pills spring in (`scale 0.8 -> 1`), and removing a chip smoothly collapses its width before unmounting.
22. **File Drop**: Drag-over expands dashed border, tilts preview stack cards (`-6deg`, `0deg`, `+6deg`), and springs dropped files into a compact progress list.

## 5. Feedback, Status & Data
23. **Plan Switch**: Monthly/Yearly segmented toggle with sliding spring pill + odometer price roll (`$29` <-> `$24`) + `"Save 20%"` badge pop.
24. **Checkbox List**: Clicking a row draws an SVG checkmark (`pathLength="1"`) and animates a horizontal strikethrough line (`scaleX(0 -> 1)`) with `opacity: 1 -> 0.55`.
25. **Focus Mode**: Toggling Focus dims surrounding UI (`opacity: 0.25`, `filter: blur(2px)`) while elevating the active card (`scale: 1.02`).
26. **Storage Meter**: Stacked horizontal bar segments that expand proportionally with `spring-settle`; hovering a segment dims others and shows a floating breakdown pill.
27. **Live Activity / Shimmer Status**: Diagonal 110deg specular shimmer (`rgba(255,255,255,0.08)`) sweeping across `"Thinking..."` or skeleton states, transitioning via `xswap` into resolved content.
