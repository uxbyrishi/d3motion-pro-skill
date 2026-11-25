# D3 Motion Design Tokens & Visual System

## 1. Color Tokens

### Dark Theme (D3 Motion Studio / Pro)
Neutral dark surfaces with **zero blue tint** on cards and windows, paired with a single **Royal Signal Blue** accent.

```css
:root, [data-theme="dark"] {
  --font-display: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  /* Neutral Dark Surfaces */
  --bg-app: #09090B;
  --bg-window: #0F0F12;
  --bg-card: #141417;
  --bg-elevated: #1C1C20;
  --bg-input: #101014;
  --bg-hover: rgba(255, 255, 255, 0.06);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.14);
  --border-strong: #27272A;
  --border-focus: rgba(59, 130, 246, 0.6);

  /* Text */
  --text-primary: #F4F4F5;
  --text-secondary: #9095A2;
  --text-muted: #5A6070;
  --text-inverse: #FFFFFF;

  /* Signal Royal Blue Accent */
  --signal-primary: #2563EB;
  --signal-hover: #1D4ED8;
  --signal-bright: #3B82F6;
  --signal-glow: rgba(37, 99, 235, 0.45);
  --signal-subtle: rgba(37, 99, 235, 0.15);

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

### Light Theme (Airy Bento / Design System)
```css
[data-theme="light"] {
  --bg-app: #F7F7F5;
  --bg-tray: #EEEEEA;
  --bg-card: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-hover: rgba(0, 0, 0, 0.04);

  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.12);

  --text-primary: #141416;
  --text-secondary: #5C5C58;
  --text-muted: #8B8B87;

  --signal-primary: #2F5BFF;
  --signal-subtle: #EEF2FF;

  --shadow-card:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px -4px rgba(0, 0, 0, 0.06);
}
```

### Motion Studies Tactile Tokens (Shadow-Free Flat Depth)
For pure micro-interactions on `#000` / `#171717` stages, use layered opacity fills instead of drop shadows:
- `--stage: #000`, `--card: #171717`, `--surface: #262626`, `--object: #2C2C2C`
- `--fill-1: rgba(255,255,255,.05)`, `--fill-2: rgba(255,255,255,.09)`, `--fill-3: rgba(255,255,255,.14)`

---

## 2. Concentric Radii

Always preserve concentric curvature: `innerRadius = max(4px, outerRadius - padding)`.

```css
:root {
  --r-card: 28px;   /* Outer stage/widget card */
  --r-sheet: 24px;  /* Large panels, modals */
  --r-panel: 18px;  /* Bars, menus, trays */
  --r-tile: 14px;   /* Inner cards, tiles */
  --r-row: 12px;    /* List rows, icon buttons */
  --r-sm: 8px;      /* Inputs, small controls */
  --r-xs: 6px;      /* Keys, tiny chips */
  --r-pill: 9999px; /* Pills, badges, toggles */
}
```

---

## 3. Typography & Numeric Discipline

- **Display / Headings**: `letter-spacing: -0.025em` to `-0.035em`, `font-weight: 700` or `800`.
- **Section Tags** (`01 · SOURCE`, `02 · OUTPUT`): `10px`, uppercase, `letter-spacing: 0.08em`, pill border `rgba(255,255,255,0.1)`.
- **Tabular Numerals**: Always apply `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "cv11" 1;` on counters, timers, percentages, and prices so digits never jitter horizontally during animation.
