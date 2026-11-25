/**
 * d3motion-core.js — Zero-dependency Spring Physics, Deterministic Motion & d3Motion Export Kit
 * Compatible with interactive web UIs and deterministic 60/120 FPS export on https://d3motion.pro/web
 */

// ---------------------------------------------------------------------------
// 1. Math & Deterministic Easing (Pure functions of p in [0, 1])
// ---------------------------------------------------------------------------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mix = (a, b, p) => a + (b - a) * p;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const md = (k, n) => ((k % n) + n) % n;

// From-rest damped spring (zeta ~0.55, ~12% overshoot, normalized to 1 at p=1)
const sprRaw = (p) =>
  1 - Math.exp(-6.5 * p) * (Math.cos(9.86 * p) + (6.5 / 9.86) * Math.sin(9.86 * p));
export const spring = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : sprRaw(p) / sprRaw(1));

// Critically damped (zero overshoot, zero initial velocity — ideal for crossfades & color mixes)
export const soft = (p) => {
  const f = (q) => 1 - Math.exp(-7 * q) * (1 + 7 * q);
  return p <= 0 ? 0 : p >= 1 ? 1 : f(p) / f(1);
};

// Ease-out expo (use for small opacity reveals, never large color fills)
export const expo = (p) =>
  p <= 0 ? 0 : p >= 1 ? 1 : (1 - Math.pow(2, -10 * p)) / (1 - Math.pow(2, -10));

// Quintic in-out (camera pans, long travel)
export const io = (p) => {
  p = clamp(p);
  return p < 0.5 ? 16 * p ** 5 : 1 - Math.pow(-2 * p + 2, 5) / 2;
};

// ---------------------------------------------------------------------------
// 2. Interactive Spring Solver (Pointer-driven UI)
// ---------------------------------------------------------------------------
export const SPRING_PRESETS = {
  follow: { stiffness: 900, damping: 50 },
  settle: { stiffness: 280, damping: 22 },
  soft:   { stiffness: 260, damping: 24 },
  lead:   { stiffness: 620, damping: 36 },
  trail:  { stiffness: 190, damping: 19 },
  pop:    { stiffness: 520, damping: 16 },
  fade:   { stiffness: 420, damping: 32 },
};

export function createSpring(initial = 0, preset = 'settle') {
  const cfg = typeof preset === 'string' ? SPRING_PRESETS[preset] || SPRING_PRESETS.settle : preset;
  let x = initial;
  let v = 0;
  let target = initial;

  return {
    get value() { return x; },
    get velocity() { return v; },
    setTarget(next, overridePreset) {
      target = next;
      if (overridePreset) {
        const c = typeof overridePreset === 'string' ? SPRING_PRESETS[overridePreset] : overridePreset;
        if (c) { cfg.stiffness = c.stiffness; cfg.damping = c.damping; }
      }
    },
    snap(next) { x = next; target = next; v = 0; },
    step(dt = 1 / 60) {
      const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const force = -cfg.stiffness * (x - target) - cfg.damping * v;
        v += force * h;
        x += v * h;
      }
      return x;
    },
    isSettled(eps = 0.001) {
      return Math.abs(x - target) < eps && Math.abs(v) < eps;
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Deterministic Timeline, Cycles & Odometer Helpers
// ---------------------------------------------------------------------------
export function st(t, P, o = 0) {
  const x = t - o;
  if (x < 0) return { k: 0, l: 0, pre: 1 };
  const k = Math.floor(x / P);
  return { k, l: x - k * P, pre: 0 };
}

export function st2(t, P, o = 0) {
  const x = t - o;
  if (x < 0) return { k: 0, l: 99 };
  const k = Math.floor(x / P) + 1;
  return { k, l: x - (k - 1) * P };
}

export function tw(t, P, o, vals, dur, ease = spring) {
  const { k, l } = st2(t, P, o);
  const a = vals[md(k - 1, vals.length)];
  const b = vals[md(k, vals.length)];
  return mix(a, b, ease(clamp(l / dur)));
}

export function kf(t, keys, ease = soft) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      return mix(keys[i - 1][1], keys[i][1], ease(seg(t, keys[i - 1][0], keys[i][0])));
    }
  }
  return keys[keys.length - 1][1];
}

// Per-digit odometer HTML (requires .rc { display:inline-block; overflow:hidden; height:1.2em; line-height:1.2em })
export function rollDigits(fromStr, toStr, l, dur = 0.65, stagger = 0.04) {
  const n = Math.max(fromStr.length, toStr.length);
  const f = fromStr.padStart(n, ' ');
  const to = toStr.padStart(n, ' ');
  let html = '';
  for (let i = 0; i < n; i++) {
    const a = f[i], b = to[i];
    const p = spring(clamp((l - i * stagger) / dur));
    if (/\d/.test(a) && /\d/.test(b)) {
      const y = mix(+a, +b, p);
      html += `<span class="rc"><span style="display:block;transform:translateY(${-y * 1.2}em)">${
        [0,1,2,3,4,5,6,7,8,9].map((d) => `<b style="display:block;height:1.2em">${d}</b>`).join('')
      }</span></span>`;
    } else if (a === b) {
      html += a === ' ' ? '' : `<span class="rc">${a}</span>`;
    } else {
      const pe = soft(clamp((l - i * stagger) / (dur * 0.65)));
      html += `<span class="rc" style="opacity:${pe}">${b === ' ' ? '&nbsp;' : b}</span>`;
    }
  }
  return `<span class="rl" style="display:inline-flex;font-variant-numeric:tabular-nums">${html}</span>`;
}

// ---------------------------------------------------------------------------
// 4. D3 Motion Export Hook Registration
// ---------------------------------------------------------------------------
export function registerD3Motion({ duration = 6, fps = 60, width = 1920, height = 1080, renderAt, autoPlay = true }) {
  if (typeof window === 'undefined') return;
  window.d3Motion = { duration, fps, width, height, renderAt };

  if (autoPlay) {
    const start = performance.now();
    const tick = (now) => {
      if (window.__D3_EXPORTING__) return;
      const t = ((now - start) / 1000) % duration;
      renderAt(t, null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
