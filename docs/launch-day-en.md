# Life Battle · 英文渠道发布文案包

> **发布时间策略：**
> - **明天（周三）**：先发 Reddit r/cellular_automata（垂直社区，最易出反响）
> - **周四美西早 6 点（北京时间周四晚 21 点）**：Show HN
> - **如果 Reddit 反响 >30 upvotes**：周四同步发 r/coolgithubprojects + r/programming
>
> **故事线策略：**
> 英文渠道绝对不要讲"我和孩子一起做的"——HN/Reddit 程序员受众觉得这种 framing 不够 hacker，会下沉热度。
> 用 **technical curiosity** 角度：multi-species rule × visual novelty × zero deps。

---

## 0️⃣ Reddit 账号热身（防被 mod 删帖）

**新账号直接发自己项目 ≈ 99% 被识别为 spam 并 ban**。明天发之前必须做：

- [ ] 在 r/cellular_automata 至少**评论 3 条** 别人帖子（真诚 + 有内容）
- [ ] 账号有头像 + 一句英文 bio
- [ ] karma > 5

如果你 Reddit 是 0 karma 新号 → **建议今晚就开始攒**，或找有 karma 的朋友帮发。

---

## 1️⃣ Reddit r/cellular_automata（最先发）

### 标题（80 字符内）

**推荐**：
```
Multi-species Conway's Life — gliders and Gosper guns fight for territory
```

### 正文

```
Hi r/cellular_automata,

I've been playing with a variation of Conway's Life where cells have **team colors**. The only rule change:

> When a new cell is born from 3 neighbors, it inherits the **majority team's color**.
> If the 3 neighbors are 1+1+1 across three teams, the cell stays dead.

That single change turns the simulation into a battlefield. Classic patterns like the Gosper Glider Gun and the 117P9 spaceship behave normally on their own, but when two armies collide the frontier becomes unpredictable.

Plain HTML + Canvas + vanilla JS, no framework, no build step, ~1700 lines total. Ships with 16 starter patterns (Gosper Gun, Pulsar, Acorn, R-pentomino, HWSS, Copperhead, etc.) plus a few custom animal-shaped patterns.

🎮 Live demo: https://static.feishare.net/auto_cell_battle/
⭐ Source (MIT): https://github.com/emmazangAI/life-battle

Would love feedback — especially:
- Pattern suggestions for guns/reflectors I should add
- Whether the majority-rule feels right or if there's a more elegant variant
- Any references to prior art (couldn't find a clean multi-species Life impl when searching)
```

---

## 2️⃣ Reddit r/coolgithubprojects

### 标题
```
Life Battle — Conway's Game of Life as a multi-species battle (zero deps, MIT)
```

### 正文
```
Conway's Game of Life with team colors. New cells inherit the majority team. Suddenly Gosper Glider Guns have strategic purpose.

- Plain HTML + Canvas + vanilla JS, ~1700 lines
- 16 classic patterns + 6 custom animal patterns
- 2-4 species support, mobile-friendly
- Bilingual EN/CN, MIT

Demo: https://static.feishare.net/auto_cell_battle/
Repo: https://github.com/emmazangAI/life-battle
```

---

## 3️⃣ Reddit r/programming（只在前面有反响 >30 upvotes 后再发）

**标题**：
```
Show: Conway's Game of Life as a multi-species battle (HTML, zero deps, MIT)
```

正文同 r/coolgithubprojects 即可。

---

## 4️⃣ Hacker News - Show HN（周四美西早 6 点 / 北京晚 21 点）

> ⚠️ **HN 一次性机会**：账号在 HN 只能发同一项目一次。务必等中文/Reddit 都试过、确认无明显 bug 后再投。

### 标题（80 字符内，HN 严格限制）

**推荐**：
```
Show HN: Multi-species Conway's Game of Life
```

**备选 A**（更具体）：
```
Show HN: Conway's Game of Life as a multi-species battle
```

**备选 B**（最具体，但偏长）：
```
Show HN: Life Battle – Conway's Game of Life with team inheritance rules
```

### URL 字段

填 **GitHub 仓库地址**：`https://github.com/emmazangAI/life-battle`
（不要填 demo 链接——HN 文化偏好直接看 repo，demo 链接放正文里）

### 首条评论（账号自己发，发完帖后 3-5 分钟内必须发）

```
Author here. The classic Game of Life is mesmerizing but solitary — every cell is just "alive" or "dead". I extended Conway's rules with one tiny addition:

When a new cell is born from 3 neighbors, it inherits the majority team's color. If the 3 neighbors are 1+1+1 across three teams, no birth (no consensus).

That single change turns the simulation into a battlefield. A Gosper Glider Gun pointing at an enemy spaceship factory. Three penguins squaring off against a puffer train. None of these "should" happen in the original Life — but here they do, and the outcomes are surprisingly hard to predict.

Plain HTML + Canvas + vanilla JS, no dependencies, ~1700 lines.

Live demo (no install): https://static.feishare.net/auto_cell_battle/

Feedback and pattern suggestions very welcome — especially patterns from LifeWiki that would make interesting battles.
```

---

## 5️⃣ Lobsters（HN 之外的极客社区，可选）

**条件**：需要邀请码才能发。如果你有 Lobsters 账号可以发；没有就跳过。

**标题**：
```
Multi-species Conway's Life (web demo, zero dependencies)
```

**标签**：`compsci`, `show`, `web`

---

## 6️⃣ Twitter/X 英文版（已在 launch-day-cn.md 第 2 项，这里不重复）

---

## 📋 评论区高频问题英文回复模板

### Q: "Has this been done before?"
A: I searched but couldn't find a clean multi-species Life implementation. There's [some academic work on competitive cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton#Specific_rules) but I haven't found a web-based playable version with this exact rule. Pointers welcome.

### Q: "What about ties (1+1+1)?"
A: No birth — the cell stays dead. I tried "random tie-breaking" first but it made the simulation too chaotic. Strict majority requirement keeps it visually clean.

### Q: "Why not WebGL?"
A: Canvas 2D handles 192×108 grid at 60fps on my M1 MacBook. For larger grids (500×500+) I'd switch to WebGL. PRs welcome.

### Q: "RLE support?"
A: Yes, the Gosper Gun and 117P9 ship are loaded from standard RLE format. The animal patterns use a simpler [dx, dy] coordinate list because they're hand-designed. Both formats coexist in `patterns.js`.

### Q: "Why bilingual?"
A: I'm based in China — most of my friends and early users speak Chinese. The English UI is for international users like you 👋

### Q: "Can I add a pattern?"
A: Please do! Open a PR or issue with the RLE / coordinate list and I'll merge.

---

## ✅ 发布前最终检查清单

- [ ] README hero GIF 加载流畅（已确认 1.9MB ✓）
- [ ] 所有 demo 链接 24/7 在线（已确认 ✓）
- [ ] LICENSE 文件存在（已确认 ✓ MIT）
- [ ] 仓库有 topics（已确认 ✓ 8 个）
- [ ] 仓库 description 完整（已确认 ✓）
- [ ] 仓库 homepage 字段（已确认 ✓）
- [ ] 至少 5 个 stars（来自昨天 X 中文/小红书 → 等今晚验证）
- [ ] HN/Reddit 账号有头像 + bio + 至少几条 karma
- [ ] 发完帖后 1 小时内的时间是空的（必须回评论）

---

## 📊 期望值校准（明天 Reddit + 周四 HN 综合）

| 场景 | GitHub star 24h 内 |
|---|---|
| 悲观（Reddit/HN 都没上首页） | 30-80 |
| 中性（Reddit 进 r/cellular_automata 周热门 top 5） | 100-300 |
| 乐观（HN 进首页 top 30） | 500-2000 |
| 爆款（HN top 10 + Reddit r/programming 1k+ upvotes） | 3000-10000 |

**关键预警信号**：
- 如果 Reddit 发出去 2 小时 < 5 upvotes → 标题不好，删帖、改标题、明天重发
- 如果 HN 发出去 30 分钟 < 3 分 → 大概率沉了，别再调整文案（HN 算法只看前 30 分钟）
- 如果 HN 进首页 → **你接下来 4 小时不要离开电脑**，每条评论都要回

---

## 🎯 简化版"明天执行清单"

```
明天 10:00 — 看昨晚中文渠道数据
明天 12:00 — 检查 Reddit 账号是否完成预热
明天 14:00 — 发 Reddit r/cellular_automata
明天 14:05 — 自己评论 follow-up
明天 14:30 — 同步发 X 提一下"刚发 Reddit"
明天 16:00 — 看 Reddit 数据，决定是否发 r/coolgithubprojects
明天 18:00 — 准备 HN 文案最终版
周四 21:00 — Show HN（北京时间）
周四 21:03 — 发首条作者评论
周四 21:00-25:00 — 盯评论、回复
```
