# D3 Motion Pro — UI, Interaction & Motion Skill

An open-source **Agent Skill** ([agentskills.io](https://agentskills.io) standard) for building physics-driven UI components, tactile micro-interactions, and deterministic 60/120 FPS animations that export cleanly to MP4 on **[d3motion.pro](https://d3motion.pro/web)**.

Compatible with **Claude Code**, **Cursor**, **OpenAI Codex**, **Google Antigravity**, **Windsurf**, **Cline**, and any AI coding agent.

---

## Install (Any Agent)

### Option 1: Universal CLI (`npx skills`)
Works across Claude Code, Cursor, Codex, Antigravity, and more:

```bash
npx skills add uxbyrishi/d3motion-pro-skill
```

### Option 2: Manual Install by Agent

| Agent | Global Path | Project-Local Path |
| :--- | :--- | :--- |
| **Antigravity** | `~/.gemini/config/skills/d3motion-pro/` | `.agents/skills/d3motion-pro/` |
| **Claude Code** | `~/.claude/skills/d3motion-pro/` | `.claude/skills/d3motion-pro/` |
| **OpenAI Codex** | `~/.codex/skills/d3motion-pro/` | `.agents/skills/d3motion-pro/` |
| **Cursor** | `~/.cursor/skills/d3motion-pro/` | `.cursor/skills/d3motion-pro/` (or `.agents/skills/d3motion-pro/`) |

Copy the `skills/d3motion-pro/` folder into any of the paths above.

---

## What's Inside

```text
skills/d3motion-pro/
├── SKILL.md                      # Core workflow & decision guide
├── references/
│   ├── design-tokens.md          # D3 Motion dark/light palettes, typography, concentric radii
│   ├── motion-engine.md          # Spring solver, deterministic draw(t), window.d3Motion.renderAt()
│   ├── interactions.md           # 27 micro-interaction recipes (magnetic, jelly, gooey, morph island...)
│   └── ui-patterns.md            # Bento grids, cursor-refine demos, AI Live Activity cards
└── scripts/
    └── d3motion-core.js          # Zero-dependency JS spring + odometer + renderAt runtime
```

---

## Example Prompts

- *"Using the d3motion-pro skill, build a magnetic CTA button and a rubber-band bottom navigation bar with spring physics."*
- *"Create a 6-second 1080p bento dashboard animation using d3motion-pro with rolling odometer metrics and `window.d3Motion.renderAt` so I can export it on d3motion.pro."*
- *"Build a Morph Island media + timer widget in dark mode following D3 Motion tokens."*

---

## License

MIT
