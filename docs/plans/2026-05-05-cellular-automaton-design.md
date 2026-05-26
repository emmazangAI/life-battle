# 元胞自动机网页可视化 — 设计文档

## 概述

纯原生 JS + HTML + Canvas 实现的经典生命游戏（Conway's Game of Life）可视化工具。无需构建工具，打开 `index.html` 即可运行。

---

## 1. 整体架构

### 文件结构

```
auto-cell/
├── index.html            # 入口页面
├── src/
│   ├── style.css         # 样式
│   ├── cell.js           # Grid 类 + 演化逻辑
│   └── main.js           # 入口：Canvas、事件绑定
└── docs/plans/
    └── 2026-05-05-cellular-automaton-design.md  # 本文档
```

### 核心类：Grid

| 属性/方法 | 说明 |
|-----------|------|
| `this.cells` | 二维数组 `[row][col]`，`1` = 活，`0` = 死 |
| `this.cols` / `this.rows` | 网格列数 / 行数（用户自定义） |
| `this.cellSize` | 每个格子的像素大小（自动计算适配 Canvas） |
| `createEmptyGrid()` | 创建全 0 网格 |
| `toggleCell(row, col)` | 翻转指定格子状态 |
| `countNeighbors(row, col)` | 统计 8 邻域活细胞数 |
| `step()` | 同步演化一帧（经典生命游戏规则） |
| `resize(cols, rows)` | 重设网格尺寸 |
| `draw(ctx)` | 渲染到 Canvas |

### 渲染循环

- 使用 `requestAnimationFrame` 驱动
- 通过**时间累积**控制速度（非 `setInterval`），`speed` 为帧间隔（ms），值越小越快
- `running` 布尔值控制暂停/继续

```js
let lastTime = 0
function loop(timestamp) {
  if (running && timestamp - lastTime > speed) {
    grid.step()
    grid.draw(ctx)
    lastTime = timestamp
  }
  requestAnimationFrame(loop)
}
```

---

## 2. UI 布局与设置区

### 页面布局（从上到下）

```
┌──────────────────────────────────┐
│       Cellular Automaton          │
├──────────────────────────────────┤
│  [Start] [Pause] [Reset]         │
│  网格宽: [____]  网格高: [____]  │
│  [应用]  速度: [====●===] 50ms   │
├──────────────────────────────────┤
│                                  │
│           Canvas 网格             │
│                                  │
└──────────────────────────────────┘
```

### 设置项说明

| 控件 | 类型 | 说明 |
|------|------|------|
| Start | 按钮 | 开始演化 |
| Pause | 按钮 | 暂停演化（可继续编辑） |
| Reset | 按钮 | 清空网格（全 0） |
| 网格宽 | number 输入框 | 自定义列数，默认 50 |
| 网格高 | number 输入框 | 自定义行数，默认 50 |
| 应用 | 按钮 | 应用新的网格尺寸，重绘 |
| 速度 | range 滑块 | 50ms ~ 1000ms，实时显示数值 |

- 所有控件位于 Canvas 上方，不遮挡网格
- 速度滑块拖动即生效，无需额外确认

---

## 3. 核心逻辑与渲染

### 演化规则（经典生命游戏）

| 当前状态 | 邻居数 | 下一状态 | 规则名 |
|----------|--------|----------|--------|
| 活 | < 2 | 死 | 孤独死亡 |
| 活 | 2 或 3 | 活 | 存活 |
| 活 | > 3 | 死 | 拥挤死亡 |
| 死 | = 3 | 活 | 繁殖 |

- 边界处理：**死区边界**（网格外的细胞视为死，不 wrap）
- 演化是**同步**的：下一帧状态基于当前帧统一计算，不能边算边改

### Canvas 渲染

| 元素 | 样式 |
|------|------|
| 网格线 | `strokeStyle = #ddd`，线宽 1px，每个格子画边框 |
| 活细胞 | `fillStyle = #00cc66`（绿色），填充整个格子 |
| 死细胞 | 不填充，透明 / 白色背景 |

### 点击交互

- 监听 Canvas `click` 事件
- 用 `event.offsetX / offsetY` 计算点击的格子坐标：

```js
col = Math.floor(offsetX / cellSize)
row = Math.floor(offsetY / cellSize)
```

- 翻转该格子状态（0 ↔ 1），立即重绘 Canvas

---

## 4. 代码结构与实现顺序

### `src/cell.js` — Grid 类（完整骨架）

```js
class Grid {
  constructor(cols, rows, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }

  toggleCell(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.cells[row][col] = this.cells[row][col] ? 0 : 1
    }
  }

  countNeighbors(row, col) {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          count += this.cells[r][c]
        }
      }
    }
    return count
  }

  step() {
    const next = this.createEmptyGrid()
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const n = this.countNeighbors(r, c)
        if (this.cells[r][c]) {
          next[r][c] = (n === 2 || n === 3) ? 1 : 0
        } else {
          next[r][c] = (n === 3) ? 1 : 0
        }
      }
    }
    this.cells = next
  }

  resize(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.cells = this.createEmptyGrid()
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.cellSize
        const y = r * this.cellSize
        if (this.cells[r][c]) {
          ctx.fillStyle = '#00cc66'
          ctx.fillRect(x, y, this.cellSize, this.cellSize)
        }
        ctx.strokeStyle = '#ddd'
        ctx.strokeRect(x, y, this.cellSize, this.cellSize)
      }
    }
  }
}
```

### `src/main.js` — 入口（绑定事件、启动循环）

负责：
1. 获取 Canvas 上下文
2. 初始化 Grid 实例
3. 绑定按钮事件（Start / Pause / Reset / 应用）
4. 绑定速度滑块输入事件（实时更新 `speed`）
5. 绑定 Canvas 点击事件（涂色）
6. 启动 `requestAnimationFrame` 渲染循环

### `src/style.css` — 样式

- 页面居中，最大宽度 900px
- Canvas 有边框，网格清晰
- 按钮统一样式，hover 效果
- 设置区换行友好（小屏幕）

### 实现顺序

1. ✅ 设计文档（本文档）
2. 创建 `index.html` + `src/style.css`（页面骨架 + 样式）
3. 创建 `src/cell.js`（Grid 类）
4. 创建 `src/main.js`（事件绑定 + 渲染循环）
5. 测试：打开浏览器验证所有功能

---

## 5. 边界情况与错误处理

| 场景 | 处理方式 |
|------|----------|
| 用户输入非数字宽/高 | 输入框 `type="number"` + 应用前 `parseInt` 校验，非法则 alert |
| 网格尺寸过大导致卡顿 | 不做硬限制，但在样式/文档中建议不超过 200×200 |
| Canvas 被缩放（高清屏） | 使用 `devicePixelRatio` 处理高清渲染（可选增强） |
| 暂停时点击格子 | 允许，暂停状态下也可以编辑 |
| 修改尺寸后网格清空 | 是，`resize()` 会重置为全 0 网格 |

---

*设计完成日期：2026-05-05*
