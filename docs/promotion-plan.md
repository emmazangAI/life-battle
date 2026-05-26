# Life Battle 开源推广方案

> 创建时间：2026-05-26
> 项目：https://github.com/emmazang/life-battle（待创建）
> Demo：https://static.feishare.net/auto_cell_battle/

## 一、核心 hook（提炼一句话价值主张）

英文版（用于 HN / Reddit / X）：

> **Conway's Game of Life, but with multiple species fighting for territory. One tiny rule change turns a solitary simulation into a battle.**

中文版（用于即刻 / 小红书 / 公众号）：

> 把康威生命游戏改成了"种族对战"——一个粉色阵营 vs 一个绿色阵营，看高斯帕滑翔机枪能不能撑过敌人的喷气火车。一行规则的改动，孤独的生命变成了一场战争。

---

## 二、为什么这个能火（卖点分析）

**1. 经典 IP × 反直觉改造**：Game of Life 是程序员最熟悉的 demo 之一，但 99% 的人没见过"多种族"版本。熟悉感 + 新奇感的组合，是 HN/Reddit 编程社区最容易上首页的配方。

**2. 视觉冲击强**：粉绿撞色 + 全屏 canvas + 动态演化，3 秒看懂、15 秒被吸引。截图本身就是社交货币。

**3. 零依赖、零门槛**：点链接就能玩，不用 install 不用 sign up。降低分享摩擦。

**4. 可二创**：观众可以保存自己的开局组合、截 GIF 发推。"我让 Gosper Gun 干掉了 R-pentomino" 这种叙事是天然 viral 内容。

**5. 学术彩蛋**：对懂行的 reader 你可以聊"多数派优先规则"，对普通用户你就讲"看粉绿打架"。两类受众通吃。

---

## 三、推广渠道与节奏（按优先级排序）

### 第一波：技术社区（争取上首页/热门）

| 渠道 | 时机 | 标题（待优化） | 备注 |
|---|---|---|---|
| **Hacker News - Show HN** | 美西时间周二/周三早 6-8 点（北京时间下午 9-11 点） | `Show HN: Conway's Game of Life as a multi-species battle` | 一次性机会，标题要素：Show HN 前缀 + 经典 IP + 反差点。**只能发一次**，确保 README/demo 完美再投。 |
| **Reddit r/cellular_automata** | 任意 | `Multi-species Conway's Life — what happens when gliders and Gosper guns belong to different teams?` | 这是垂直社区，最容易被欣赏 |
| **Reddit r/programming** | 周一/周二 美西 9 点 | 同 HN 标题 | 大水池但竞争激烈 |
| **Reddit r/coolgithubprojects** | 任意 | `Life Battle — Conway's Game of Life, but as a multi-species battle` | 直接 fit 该社区主题 |
| **Lobsters** | 任意 | `Multi-species Conway's Life battle (web demo)` | 偏极客，质量优先 |

**HN 投递的"完整准备清单"**：
- [ ] README 顶部 hero image 清晰展示卖点
- [ ] Live demo 永远在线（static.feishare.net 已就绪）
- [ ] LICENSE 已加（MIT）
- [ ] 至少 1 段 GIF/视频展示动态过程（**强烈建议**，30 秒以内）
- [ ] 标题已 A/B 测试过表达（可以发到自己几个朋友群先看反应）
- [ ] 准备好"作者解释"的第一条评论：作者发完帖后 5 分钟内自己评论一条，解释"为什么做"+ 邀请反馈

### 第二波：中文技术社区

| 渠道 | 内容形式 | 备注 |
|---|---|---|
| **即刻** | 短动态 + GIF + 链接 | 你的主战场，建议作为发布日 0 点首发 |
| **V2EX 创意分享/分享发现** | 文字介绍 + demo 链接 | 标题别带宣传感，参考 "[分享] 把生命游戏改成多种族对战，看哪个种族能活下来" |
| **少数派** | 投稿短文（800-1500 字） | 通过率较高，曝光精准 |
| **知乎 - 编程/小项目** | 自问自答 "有没有什么有趣的生命游戏变种？" | 适合长尾流量 |

### 第三波：视频/可视化渠道（强烈建议）

| 渠道 | 内容形式 | 备注 |
|---|---|---|
| **X / Twitter** | 1 条 GIF + hook 文案 + 链接，引用经典 Life 账号 | 标个 @ConwayLife（如果存在）增加曝光 |
| **YouTube 短视频** | 60 秒"看一场 Life 战斗" | 适配性强，标题：`I made Conway's Game of Life a battle royale` |
| **B站** | 同样 60 秒，标题中文化 + "康威生命游戏" 关键词 | 长尾流量好 |
| **小红书** | 静态卡片 + 短视频，标题 "程序员的小浪漫" 风 | 出圈到非编程圈唯一渠道 |

### 第四波：长尾/被动收割

- 在 GitHub README 末尾加"作者写的一篇博客"链接（你可以在你 Write/ 目录下写一篇制作过程的文章）
- 在 LifeWiki 的相关页面（如 Gosper Gun）的 "External links" 里礼貌地申请加链接
- 在 awesome-cellular-automata 这类 awesome list 提 PR

---

## 四、文案模板

### Hacker News（Show HN 标题 + 正文）

**标题（80 字符内）：**
```
Show HN: Multi-species Conway's Game of Life
```

**首条评论（自己发，作为 author note）：**
```
Author here. The classic Game of Life is mesmerizing but solitary —
every cell is just "alive" or "dead". I extended Conway's rules
with one tiny addition: when a new cell is born from 3 neighbors,
it inherits the majority team's color.

That single change turns the simulation into a battlefield. A Gosper
gun pointing at an enemy spaceship factory. Three penguins squaring
off against a puffer train. None of these "should" happen in the
original Life — but here they do, and the outcomes are surprisingly
hard to predict.

Zero dependencies, plain HTML + Canvas. Source on GitHub, MIT licensed.
Feedback and pattern suggestions welcome!

Demo: https://static.feishare.net/auto_cell_battle/
Repo: https://github.com/emmazang/life-battle
```

### Reddit r/cellular_automata

```
Title: Multi-species Conway's Life — Gosper guns vs spaceships, with majority-rule inheritance

Body:
I've been playing with a variation of Conway's Life where cells have
team colors. The only rule change: when 3 neighbors produce a birth,
the new cell inherits the majority team. If the 3 neighbors are 1+1+1
across three teams, no birth happens (no consensus).

I find the results visually interesting — classic patterns like the
Gosper Glider Gun and 117P9 spaceship behave normally on their own,
but when two armies collide the frontier becomes chaotic in ways I
can't predict.

Live demo (zero dependencies): https://static.feishare.net/auto_cell_battle/
Source (MIT): https://github.com/emmazang/life-battle

Would love feedback from this community, and pattern suggestions
for guns/reflectors I should add to the starter library.
```

### X / Twitter（中英双版）

**英文（带 GIF 附件）：**
```
I made Conway's Game of Life into a battle.

Pink team vs Green team, one rule: when a cell is born, it joins
the majority side.

Suddenly the Gosper Gun has a strategic purpose 🔫

Demo (no install): static.feishare.net/auto_cell_battle/
Code (MIT): github.com/emmazang/life-battle
```

**中文（即刻同款）：**
```
把康威生命游戏改成了一场战争🐰vs🐢

规则就改了一行：新生细胞跟随多数派阵营。

突然之间高斯帕滑翔机枪有战略意义了。

▶ 点开就能玩：static.feishare.net/auto_cell_battle/
（开源 MIT：github.com/emmazang/life-battle）
```

### 即刻动态版

```
一个周末做了个小东西。

康威生命游戏大家熟，但都是单色的。我加了一条规则：
让细胞分阵营，新生细胞跟随多数派颜色。

结果就变成了"高斯帕滑翔机枪 vs 喷气火车" 的战场。
有点上瘾。

▶ static.feishare.net/auto_cell_battle/
开源 MIT，欢迎 PR / star ⭐
```

---

## 五、关键检查清单（发布前必看）

- [ ] **README hero 图加载快**（< 500KB，已用 image_gen 生成，1.2MB 偏大需压一下）
- [ ] **录一段 30s GIF**（用 Kap / LiceCap，覆盖：开局 → 开始 → 战斗 → 一方胜利）→ README 里替换静态图
- [ ] **demo 链接 24/7 在线**（如果 static.feishare.net 挂了，HN 评论会 destroy）
- [ ] **GitHub Pages 同步上线**（作为 backup，万一 static.feishare.net 挂可降级，已在 TODO）
- [ ] **GitHub repo "About" 字段写好**（一句话 + topic tags：`game-of-life cellular-automata conway javascript canvas zero-dependency`）
- [ ] **Twitter / X 账号绑定 GitHub**（让 HN 用户能 follow 到你）
- [ ] **作者评论提前写好**（HN 帖发出后 5 分钟内一定要有作者第一条评论）

---

## 六、发布日 D-Day 时间表（建议）

假设选周二发布（HN 周二/周三上首页概率最高）：

```
T-7 天（周二）：repo 完整 push + README hero 图就位 + GitHub Pages 配好
T-3 天（周六）：录 GIF 替换 hero、检查 demo 站稳定性
T-1 天（周一晚）：内部小群预发布（找 5 个朋友试玩，收第一波反馈+star）
T 日 21:00（周二，对应美西 6:00）：
  - 21:00 HN 发 Show HN（标题: "Show HN: Multi-species Conway's Game of Life"）
  - 21:05 自己发第一条评论（解释 + 邀请反馈）
  - 21:10 同步发 Reddit r/cellular_automata
  - 21:30 即刻 + Twitter 同步发
T 日 22:00-24:00：盯评论，及时回复每一条
T+1：r/programming + r/coolgithubprojects + V2EX
T+3：复盘流量，写一篇博客（"为什么我做了这个 + 上 HN 后学到的")
```

---

## 七、Star 期待值校准

- **悲观情况**：50-200 star（如果 HN 没上首页，只靠垂直社区）
- **中性情况**：500-2k star（如果 HN 上了 top 30）
- **乐观情况**：5k+ star（HN 进 top 5 + Reddit r/programming 5k+ upvotes）

历史参考：
- ["A pure CSS-only Game of Life"（HN 上过首页）](https://news.ycombinator.com/from?site=danielmackay.dev) ~ 1.2k star
- 类似"反差点 + 经典 IP + 零依赖"项目，HN 上首页时通常带 2-5k star/24h

**关键 lever**：GIF/视频质量是 0/1 因子。**没 GIF 直接 -70% 流量**。务必录好。

---

## 八、长期规划（如果第一波成功）

- 加 **Tournament Mode**：64 个 pattern 双败淘汰赛，最后一个团活下来的赢
- 加 **Replay export**：记录种子 + 几帧 → 别人能 reproduce 同样的 battle
- 加 **Multiplayer**：两人在同一个 grid 异步绘制开局，然后服务器统一演化（可付费 / Patreon 转化路径）
- 写一篇技术博客（中英双语）讲多数派规则的设计权衡，发到 dev.to + 个人站

---

## 当前 TODO

- [x] 写 README（含 hero 图）
- [x] 加 LICENSE（MIT）
- [x] 初始化标准 git 仓库（main 分支）
- [x] 生成第一版 hero 图（占位用，未来换为真截图/GIF）
- [ ] 等用户 `gh auth login`
- [ ] 创建 GitHub repo + push
- [ ] 配 GitHub Pages（路径 `/auto_cell_battle/`）
- [ ] 录制 30s demo GIF（建议用 Kap 录屏）
- [ ] D-Day 按时间表执行
