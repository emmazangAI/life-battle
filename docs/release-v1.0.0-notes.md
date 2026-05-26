# v1.0.0 — Initial open-source release 🎉

> Conway's Game of Life, but with multiple species fighting for territory.

## What's included

- 🎨 **Battle Mode** — 2-4 species share one grid; new cells inherit the majority team. ([Play live](https://static.feishare.net/auto_cell_battle/))
- 🔫 **16 patterns** built-in: Gosper Glider Gun, 117P9 Spaceship, HWSS, Copperhead, Pulsar, Acorn, R-pentomino, Diehard, Eater, Puffer Train, Random Soup + 6 custom animal patterns
- ✏️ **Free-form drawing** with race selector
- ⏪ 20-step undo
- ⚡ Speed control (1–60 gens/sec)
- 📱 Mobile responsive
- 🌐 Bilingual UI (中文 / English)
- 🪶 **Zero dependencies** — plain HTML + Canvas 2D + vanilla JS, ~1700 lines total

## Bonus modes

This repo also ships 6 experimental variants of the Game of Life:

- `auto_cell_single` — classic vanilla single-species Life
- `auto_cell_multi` — multi-species without battle UI
- `auto_cell_hex` — hexagonal grid
- `auto_cell_tri` — triangular grid
- `auto_cell_3d` — 3D grid
- `auto_cell_rabbit` — standalone pattern explorer

## Try it

```bash
git clone https://github.com/emmazangAI/life-battle.git
cd life-battle
open auto_cell_battle/index.html
```

Or just visit the live demo: **https://static.feishare.net/auto_cell_battle/**

## License

MIT — do whatever you want.

---

If you have fun with it, a ⭐ goes a long way.
