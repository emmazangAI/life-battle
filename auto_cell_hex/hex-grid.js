/**
 * 六边形网格引擎
 * 使用 offset coordinates（奇偶行偏移）
 * 六边形邻居规则：每个格子有6个邻居
 * 演化规则：B2/S34（2邻居繁殖，3或4邻居存活）
 */
class HexGrid {
  constructor(cols, rows, raceCount, raceColors, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.raceCount = raceCount
    this.raceColors = raceColors
    this.hexSize = Math.min(canvasWidth / (cols * 1.5 + 0.5), canvasHeight / (rows * Math.sqrt(3) + Math.sqrt(3) / 2))
    this.cells = this.createEmptyGrid()
    this.generation = 0
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }

  randomize() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (Math.random() < 0.3) {
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

  /**
   * 获取六边形网格的6个邻居坐标（offset coordinates）
   * 偶数行和奇数行的邻居偏移不同
   */
  getNeighbors(row, col) {
    const isOdd = row % 2 === 1
    // 六边形 offset coordinates 邻居
    const directions = isOdd
      ? [[-1, 0], [1, 0], [0, -1], [1, -1], [0, 1], [1, 1]]   // 奇数行
      : [[-1, 0], [1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]]  // 偶数行
    
    const neighbors = []
    for (const [dc, dr] of directions) {
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        neighbors.push([nr, nc])
      }
    }
    return neighbors
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
   * 演化一步
   * 六边形规则 B2/S34：
   *   - 活细胞：3或4个邻居存活，否则死亡
   *   - 死细胞：恰好2个邻居繁殖
   */
  step() {
    const next = this.createEmptyGrid()
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.cells[r][c]
        const { counts, total } = this.countNeighborsByRace(r, c)

        if (current > 0) {
          // 活细胞：3或4个邻居存活
          next[r][c] = (total === 3 || total === 4) ? current : 0
        } else {
          // 死细胞：恰好2个邻居繁殖
          if (total === 2) {
            let bestRace = 0
            for (let race = 1; race <= this.raceCount; race++) {
              if (counts[race] >= 2) {
                bestRace = race
                break
              }
            }
            if (bestRace === 0) {
              // 没有单种族≥2，选最多的
              let maxCount = 0
              for (let race = 1; race <= this.raceCount; race++) {
                if (counts[race] > maxCount) {
                  maxCount = counts[race]
                  bestRace = race
                }
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
    this.hexSize = Math.min(canvasWidth / (cols * 1.5 + 0.5), canvasHeight / (rows * Math.sqrt(3) + Math.sqrt(3) / 2))
    this.cells = this.createEmptyGrid()
    this.generation = 0
  }

  updateHexSize(canvasWidth, canvasHeight) {
    this.hexSize = Math.min(canvasWidth / (cols * 1.5 + 0.5), canvasHeight / (rows * Math.sqrt(3) + Math.sqrt(3) / 2))
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
   * 获取六边形中心的像素坐标
   */
  hexToPixel(row, col) {
    const size = this.hexSize
    const w = size * 2
    const h = Math.sqrt(3) * size
    const x = col * w * 0.75 + size
    const y = row * h + (col % 2 === 1 ? h / 2 : 0) + h / 2
    return { x, y }
  }

  /**
   * 像素坐标转六边形行列
   */
  pixelToHex(px, py) {
    const size = this.hexSize
    const w = size * 2
    const h = Math.sqrt(3) * size

    // 粗略估算列
    const col = Math.round((px - size) / (w * 0.75))
    // 根据列的奇偶调整行
    const offsetY = col % 2 === 1 ? h / 2 : 0
    const row = Math.round((py - h / 2 - offsetY) / h)

    return { row: Math.max(0, Math.min(this.rows - 1, row)), col: Math.max(0, Math.min(this.cols - 1, col)) }
  }
}
