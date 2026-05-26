class MultiGrid {
  constructor(cols, rows, raceCount, raceColors, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.raceCount = raceCount
    this.raceColors = raceColors
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }

  randomize() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const v = Math.random()
        if (v < 0.3) {
          // 30% 概率有细胞，均匀分配到各个种族
          this.cells[r][c] = Math.floor(Math.random() * this.raceCount) + 1
        } else {
          this.cells[r][c] = 0
        }
      }
    }
  }

  toggleCell(row, col, currentRace) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      if (this.cells[row][col] === 0) {
        this.cells[row][col] = currentRace
      } else {
        this.cells[row][col] = 0
      }
    }
  }

  // 统计 (row, col) 的 8 邻域中，各种族的数量
  // 返回数组 counts[raceId] = count，raceId 从 0 开始（0=死细胞不算）
  countNeighborsByRace(row, col) {
    const counts = new Array(9).fill(0) // 固定长度9，支持最多8个种族（index 0不用）
    let total = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          const race = this.cells[r][c]
          if (race > 0) {
            counts[race]++
            total++
          }
        }
      }
    }
    return { counts, total }
  }

  step() {
    const next = this.createEmptyGrid()
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.cells[r][c]
        const { counts, total } = this.countNeighborsByRace(r, c)

        if (current > 0) {
          // 活细胞：孤独死亡 / 拥挤死亡 / 存活
          next[r][c] = (total === 2 || total === 3) ? current : 0
        } else {
          // 死细胞：繁殖（邻居总数=3，且某一种族≥2）
          if (total === 3) {
            let bestRace = 0
            for (let race = 1; race <= this.raceCount; race++) {
              if (counts[race] >= 2) {
                bestRace = race
                break // 找到第一个满足条件的种族
              }
            }
            next[r][c] = bestRace
          }
        }
      }
    }
    this.cells = next
  }

  resize(cols, rows, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
  }

  updateCellSize(canvasWidth, canvasHeight) {
    this.cellSize = Math.min(canvasWidth / this.cols, canvasHeight / this.rows)
  }

  updateRaceCount(raceCount, raceColors) {
    this.raceCount = raceCount
    this.raceColors = raceColors
  }

  // 统计各种族细胞数量，返回数组 counts[raceId] = count（raceId 从 1 开始）
  getRaceCounts() {
    const counts = new Array(9).fill(0)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        counts[this.cells[r][c]]++
      }
    }
    return counts
  }

  draw(ctx) {
    const w = this.cellSize
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * w
        const y = r * w
        const race = this.cells[r][c]
        if (race > 0) {
          ctx.fillStyle = this.raceColors[race - 1]
          ctx.fillRect(x, y, w, w)
        }
        ctx.strokeStyle = '#ddd'
        ctx.strokeRect(x, y, w, w)
      }
    }
  }
}
