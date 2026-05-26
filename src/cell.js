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

  randomize() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.cells[r][c] = Math.random() < 0.3 ? 1 : 0
      }
    }
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

  resize(cols, rows, canvasWidth, canvasHeight) {
    this.cols = cols
    this.rows = rows
    this.cellSize = Math.min(canvasWidth / cols, canvasHeight / rows)
    this.cells = this.createEmptyGrid()
  }

  updateCellSize(canvasWidth, canvasHeight) {
    this.cellSize = Math.min(canvasWidth / this.cols, canvasHeight / this.rows)
  }

  draw(ctx) {
    const w = this.cellSize
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * w
        const y = r * w
        if (this.cells[r][c]) {
          ctx.fillStyle = '#00cc66'
          ctx.fillRect(x, y, w, w)
        }
        ctx.strokeStyle = '#ddd'
        ctx.strokeRect(x, y, w, w)
      }
    }
  }
}
