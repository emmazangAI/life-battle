/**
 * 兔子游戏网格类
 * 支持单种族和多种族模式
 */
class RabbitGrid {
  constructor(cols, rows, canvasWidth, canvasHeight, multiRaceEnabled = false, raceCount = 1, raceColors = ['#00cc66']) {
    this.cols = cols
    this.rows = rows
    this.multiRaceEnabled = multiRaceEnabled
    this.raceCount = raceCount
    this.raceColors = raceColors
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
    this.rabbitPositions = [] // 记录兔子的初始位置
    this.generation = 0
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }

  /**
   * 在网格中心放置兔子
   */
  placeRabbit() {
    this.cells = this.createEmptyGrid()
    const centerCol = Math.floor(this.cols / 2)
    const centerRow = Math.floor(this.rows / 2)
    
    this.rabbitPositions = getRabbitGridPositions(centerCol, centerRow)
    
    // 将兔子绘制到网格（种族1）
    for (const [col, row] of this.rabbitPositions) {
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.cells[row][col] = 1
      }
    }
    
    this.generation = 0
  }

  /**
   * 清空整个网格
   */
  clearAll() {
    this.cells = this.createEmptyGrid()
    this.rabbitPositions = []
    this.generation = 0
  }

  /**
   * 切换单个细胞状态（用于守护模式绘制）
   */
  toggleCell(row, col, race = 1) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      if (this.cells[row][col] === 0) {
        this.cells[row][col] = race
      } else {
        this.cells[row][col] = 0
      }
    }
  }

  /**
   * 计算邻居（康威规则）
   */
  countNeighbors(row, col) {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          count += this.cells[r][c] > 0 ? 1 : 0
        }
      }
    }
    return count
  }

  /**
   * 多种族模式：按种族统计邻居
   */
  countNeighborsByRace(row, col) {
    const counts = new Array(9).fill(0)
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

  /**
   * 演化一步（康威生命游戏规则）
   */
  step() {
    const next = this.createEmptyGrid()
    
    if (!this.multiRaceEnabled) {
      // 单种族模式
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const neighbors = this.countNeighbors(r, c)
          if (this.cells[r][c] > 0) {
            // 活细胞：2或3个邻居存活
            next[r][c] = (neighbors === 2 || neighbors === 3) ? 1 : 0
          } else {
            // 死细胞：恰好3个邻居复活
            next[r][c] = (neighbors === 3) ? 1 : 0
          }
        }
      }
    } else {
      // 多种族模式
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const current = this.cells[r][c]
          const { counts, total } = this.countNeighborsByRace(r, c)

          if (current > 0) {
            // 活细胞：2或3个邻居存活
            next[r][c] = (total === 2 || total === 3) ? current : 0
          } else {
            // 死细胞：恰好3个邻居，且某种族≥2
            if (total === 3) {
              let bestRace = 0
              for (let race = 1; race <= this.raceCount; race++) {
                if (counts[race] >= 2) {
                  bestRace = race
                  break
                }
              }
              next[r][c] = bestRace
            }
          }
        }
      }
    }

    this.cells = next
    this.generation++
  }

  /**
   * 更新网格尺寸
   */
  resize(cols, rows, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
    this.rabbitPositions = []
    this.generation = 0
  }

  updateCellSize(canvasWidth, canvasHeight) {
    this.cellSize = Math.min(canvasWidth / this.cols, canvasHeight / this.rows)
  }

  /**
   * 更新种族设置
   */
  setMultiRaceMode(enabled, raceCount, raceColors) {
    this.multiRaceEnabled = enabled
    this.raceCount = raceCount
    this.raceColors = raceColors
  }

  /**
   * 统计各种族细胞数量
   */
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
   * 统计兔子区域的存活细胞
   */
  getRabbitCellCount() {
    if (this.rabbitPositions.length === 0) return 0
    
    let count = 0
    for (const [col, row] of this.rabbitPositions) {
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        if (this.cells[row][col] > 0) {
          count++
        }
      }
    }
    return count
  }

  /**
   * 绘制网格
   */
  draw(ctx) {
    const w = this.cellSize
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // 绘制背景
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * w
        const y = r * w
        const cellValue = this.cells[r][c]
        
        if (cellValue > 0) {
          // 活细胞 - 粉色圆形
          ctx.fillStyle = '#FF6B9D'
          ctx.beginPath()
          ctx.arc(x + w/2, y + w/2, w * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // 网格线（极淡）
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 0.5
        ctx.strokeRect(x, y, w, w)
      }
    }
    
    // 初始状态高亮兔子
    if (this.generation === 0 && this.rabbitPositions.length > 0) {
      ctx.strokeStyle = 'rgba(255, 201, 60, 0.8)'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      
      for (const [col, row] of this.rabbitPositions) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          const x = col * w
          const y = row * w
          ctx.strokeRect(x, y, w, w)
        }
      }
      
      ctx.setLineDash([])
    }
  }
}
