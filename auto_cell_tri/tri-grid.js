/**
 * 三角形网格引擎
 * 每个格子是上三角▲或下三角▽（交替排列）
 * 邻居系统：每个三角形有3个共边邻居
 * 规则：B2/S12（2邻居繁殖，1-2邻居存活）
 */
class TriGrid {
  constructor(cols, rows, raceCount, raceColors, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.raceCount = raceCount
    this.raceColors = raceColors
    this.triSize = Math.min(canvasWidth / (cols * 0.5 + 0.5), canvasHeight / (rows * Math.sqrt(3) / 2))
    this.cells = this.createEmptyGrid()
    this.generation = 0
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }

  /**
   * 判断 (row, col) 是上三角还是下三角
   * 上三角▲: (row + col) % 2 === 0
   * 下三角▽: (row + col) % 2 === 1
   */
  isUpTriangle(row, col) {
    return (row + col) % 2 === 0
  }

  /**
   * 获取3个共边邻居
   * 上三角▲的邻居：左(同行col-1)、右(同行col+1)、下(下行同col对应)
   * 下三角▽的邻居：左(同行col-1)、右(同行col+1)、上(上行同col对应)
   */
  getNeighbors(row, col) {
    const neighbors = []
    // 左右邻居（共享竖边）
    if (col > 0) neighbors.push([row, col - 1])
    if (col < this.cols - 1) neighbors.push([row, col + 1])

    // 上下邻居（共享水平边）
    if (this.isUpTriangle(row, col)) {
      // 上三角▲：底边共享，邻居在下一行
      if (row < this.rows - 1) neighbors.push([row + 1, col])
    } else {
      // 下三角▽：顶边共享，邻居在上一行
      if (row > 0) neighbors.push([row - 1, col])
    }

    return neighbors
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

  countNeighborsByRace(row, col) {
    const counts = new Array(9).fill(0)
    let total = 0
    const neighbors = this.getNeighbors(row, col)

    for (const [nr, nc] of neighbors) {
      const race = this.cells[nr][nc]
      if (race > 0) {
        counts[race]++
        total++
      }
    }
    return { counts, total }
  }

  /**
   * 演化规则 B2/S12：
   *   - 活细胞：1或2个邻居存活，否则死亡（0或3邻居→死）
   *   - 死细胞：恰好2个邻居繁殖
   */
  step() {
    const next = this.createEmptyGrid()
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.cells[r][c]
        const { counts, total } = this.countNeighborsByRace(r, c)

        if (current > 0) {
          // 活细胞：1-2邻居存活
          next[r][c] = (total === 1 || total === 2) ? current : 0
        } else {
          // 死细胞：2邻居繁殖
          if (total === 2) {
            let bestRace = 0
            let maxCount = 0
            for (let race = 1; race <= this.raceCount; race++) {
              if (counts[race] > maxCount) {
                maxCount = counts[race]
                bestRace = race
              }
            }
            next[r][c] = bestRace
          }
        }
      }
    }
    this.cells = next
    this.generation++
  }

  resize(cols, rows, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.triSize = Math.min(canvasWidth / (cols * 0.5 + 0.5), canvasHeight / (rows * Math.sqrt(3) / 2))
    this.cells = this.createEmptyGrid()
    this.generation = 0
  }

  getRaceCounts() {
    const counts = new Array(9).fill(0)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        counts[this.cells[r][c]]++
      }
    }
    return counts
  }

  /**
   * 获取三角形的三个顶点像素坐标
   */
  getTriangleVertices(row, col) {
    const halfW = this.triSize * 0.5
    const h = this.triSize * Math.sqrt(3) / 2

    const cx = col * halfW + halfW
    const cy = row * h + h / 2

    if (this.isUpTriangle(row, col)) {
      // ▲ 上三角
      return [
        { x: cx, y: cy - h * 0.6 },           // 顶
        { x: cx - halfW, y: cy + h * 0.4 },   // 左下
        { x: cx + halfW, y: cy + h * 0.4 },   // 右下
      ]
    } else {
      // ▽ 下三角
      return [
        { x: cx, y: cy + h * 0.6 },           // 底
        { x: cx - halfW, y: cy - h * 0.4 },   // 左上
        { x: cx + halfW, y: cy - h * 0.4 },   // 右上
      ]
    }
  }

  /**
   * 像素坐标转网格行列
   */
  pixelToCell(px, py) {
    const halfW = this.triSize * 0.5
    const h = this.triSize * Math.sqrt(3) / 2

    const col = Math.floor(px / halfW)
    const row = Math.floor(py / h)

    return {
      row: Math.max(0, Math.min(this.rows - 1, row)),
      col: Math.max(0, Math.min(this.cols - 1, col))
    }
  }
}
