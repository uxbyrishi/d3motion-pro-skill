# D3 Motion Engine — Springs, Deterministic `draw(t)` & Export Hook

## 1. Interactive Spring Presets (`stiffness`, `damping`)

Use a real physical spring integrator (semi-implicit Euler or RK4) for pointer-driven UI, drag-and-release, and state transitions.

| Preset | Stiffness | Damping | Feel & Use Case |
| :--- | :--- | :--- | :--- |
| `follow` | `900` | `50` | Pointer tracking, magnetic pull, dragged knob — zero overshoot, zero lag |
| `settle` | `280` | `22` | Releasing a drag, landing on a snap point — one subtle overshoot |
| `soft` | `260` | `24` | Large layout shifts, modals, sheets, dynamic island morph |
| `lead` | `620` | `36` | Leading edge of a stretchy pill / rubber dock |
| `trail` | `190` | `19` | Trailing edge of a stretchy pill / rubber dock (lag creates stretch) |
| `pop` | `520` | `16` | Icon bounce, like burst, badge count increment |
| `fade` | `420` | `32` | Opacity and small 4–8px micro-slides |

### Spring Step Formula (Semi-Implicit Euler with Sub-stepping)
For frame-rate independence, sub-step `dt` at max `1/120` s (`0.00833s`):

```js
function stepSpring(state, target, stiffness = 280, damping = 22, dt = 1/60) {
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    const force = -stiffness * (state.x - target) - damping * state.v;
    state.v += force * h;
    state.x += state.v * h;
  }
  return state.x;
}
```

---

## 2. Deterministic Time-Driven Motion (`draw(t)`)

When building animations for video export or scrubbed timelines, **never** use `requestAnimationFrame` delta accumulation, `Date.now()`, `Math.random()`, or CSS transitions. Everything must be a **pure function of time `t` (seconds)**.

### Easing Curves
- **`spring(p)` — From-Rest Damped Spring** ($\zeta \approx 0.55$, ~12% overshoot, normalized so `spring(1) === 1`):
  Zero initial velocity means frame 1 never jerks at 120 FPS. Use for all physical travel: knobs, gliders, rings, digits, cards.
  ```js
  const sprRaw = p => 1 - Math.exp(-6.5 * p) * (Math.cos(9.86 * p) + (6.5 / 9.86) * Math.sin(9.86 * p));
  const spring = p => p <= 0 ? 0 : p >= 1 ? 1 : sprRaw(p) / sprRaw(1);
  ```
- **`soft(p)` — Critically Damped (No Overshoot, Zero Start Velocity)**:
  Use for crossfades, theme flips, color mixes, stack pushes, and resets.
  ```js
  const soft = p => {
    const f = q => 1 - Math.exp(-7 * q) * (1 + 7 * q);
    return p <= 0 ? 0 : p >= 1 ? 1 : f(p) / f(1);
  };
  ```
- **`expo(p)` — Ease-Out Expo**:
  Use **only** for small opacity reveals (`0 -> 1`). Never use on large color areas (reads as a flash).
- **`io(p)` — Quintic In-Out**:
  Use for long camera pans, map routes, and zoom pulls.

### Cycle & Odometer Helpers
- **`st(t, P, offset)`**: Returns `{ k, l, pre }` where `k` is cycle index and `l` is seconds into current `P`-second cycle.
- **`tw(t, P, offset, vals, dur, ease)`**: Smoothly tweens through `vals` every `P` seconds over `dur` seconds.
- **`roll(from, to, l, dur, stagger)`**: Per-digit odometer column (`overflow: hidden`, `1.2em` line height) with left-to-right stagger.
- **Crossfade (`xswap`)**: Layer outgoing and incoming states (`opacity: 1 - p` and `opacity: p` using `soft(p)`). Never swap text/fill at a hard `p > 0.5`.

---

## 3. D3 Motion Export Protocol (`window.d3Motion`)

To make any HTML/CSS/Canvas/WebGL scene export cleanly to 60/120 FPS MP4 on [d3motion.pro](https://d3motion.pro/web) with **0 dropped frames**:

```js
window.d3Motion = {
  duration: 8.0,   // Total duration in seconds
  fps: 60,         // Target framerate (24, 30, 60, 120)
  width: 1920,     // Native canvas/stage width
  height: 1080,    // Native canvas/stage height

  /**
   * Called out-of-order or sequentially for each frame at timestamp `t` (seconds).
   * Must be 100% deterministic and idempotent for any `t` in [0, duration].
   */
  renderAt(t, canvas) {
    draw(t);
    // Return `true` if you drew directly onto `canvas` (2D/WebGL).
    // Return `false` (or omit) if you updated DOM elements for DOM rasterization.
    return false;
  }
};
```

### Live Preview + Deterministic Export Pattern
Run `requestAnimationFrame` for live interactive preview in the browser, **unless** `window.__D3_EXPORTING__` is active or `renderAt` is being driven externally:

```js
let rafId = null;
const start = performance.now();
function loop(now) {
  if (window.__D3_EXPORTING__) return;
  const t = ((now - start) / 1000) % window.d3Motion.duration;
  window.d3Motion.renderAt(t);
  rafId = requestAnimationFrame(loop);
}
rafId = requestAnimationFrame(loop);
```
