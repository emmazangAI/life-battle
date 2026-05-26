/**
 * 3D 网格引擎 — 立方体元胞自动机
 * 规则 B5/S45：26邻居，5繁殖，4-5存活
 */
class Grid3D {
  constructor(size, raceCount, raceColors) {
    this.size = size
    this.raceCount = raceCount
    this.raceColors = raceColors
    this.cells = this.createEmptyGrid()
    this.generation = 0
  }

  createEmptyGrid() {
    const s = this.size
    return Array.from({ length: s }, () =>
      Array.from({ length: s }, () => Array(s).fill(0))
    )
  }

  toggleCell(x, y, z, race) {
    if (x >= 0 && x < this.size && y >= 0 && y < this.size && z >= 0 && z < this.size) {
      this.cells[x][y][z] = this.cells[x][y][z] === 0 ? race : 0
    }
  }

  /**
   * 统计 26 邻居
   */
  countNeighborsByRace(x, y, z) {
    const counts = new Array(9).fill(0)
    let total = 0
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dy === 0 && dz === 0) continue
          const nx = x + dx, ny = y + dy, nz = z + dz
          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && nz >= 0 && nz < this.size) {
            const race = this.cells[nx][ny][nz]
            if (race > 0) { counts[race]++; total++ }
          }
        }
      }
    }
    return { counts, total }
  }

  /**
   * 演化 B5/S45：
   * - 活细胞：4或5邻居存活
   * - 死细胞：恰好5邻居繁殖
   */
  step() {
    const s = this.size
    const next = this.createEmptyGrid()
    for (let x = 0; x < s; x++) {
      for (let y = 0; y < s; y++) {
        for (let z = 0; z < s; z++) {
          const current = this.cells[x][y][z]
          const { counts, total } = this.countNeighborsByRace(x, y, z)

          if (current > 0) {
            next[x][y][z] = (total === 4 || total === 5) ? current : 0
          } else {
            if (total === 5) {
              let bestRace = 0, maxCount = 0
              for (let r = 1; r <= this.raceCount; r++) {
                if (counts[r] > maxCount) { maxCount = counts[r]; bestRace = r }
              }
              next[x][y][z] = bestRace
            }
          }
        }
      }
    }
    this.cells = next
    this.generation++
  }

  /**
   * 获取所有活细胞列表（用于渲染）
   */
  getAliveCells() {
    const alive = []
    const s = this.size
    for (let x = 0; x < s; x++) {
      for (let y = 0; y < s; y++) {
        for (let z = 0; z < s; z++) {
          if (this.cells[x][y][z] > 0) {
            alive.push({ x, y, z, race: this.cells[x][y][z] })
          }
        }
      }
    }
    return alive
  }

  /**
   * 只获取表面细胞（至少有一个空邻居）
   */
  getSurfaceCells() {
    const surface = []
    const s = this.size
    for (let x = 0; x < s; x++) {
      for (let y = 0; y < s; y++) {
        for (let z = 0; z < s; z++) {
          if (this.cells[x][y][z] === 0) continue
          // 是否在表面（至少一个邻居是空的或在边界）
          let onSurface = false
          for (let dx = -1; dx <= 1 && !onSurface; dx++) {
            for (let dy = -1; dy <= 1 && !onSurface; dy++) {
              for (let dz = -1; dz <= 1 && !onSurface; dz++) {
                if (dx === 0 && dy === 0 && dz === 0) continue
                const nx = x + dx, ny = y + dy, nz = z + dz
                if (nx < 0 || nx >= s || ny < 0 || ny >= s || nz < 0 || nz >= s) {
                  onSurface = true
                } else if (this.cells[nx][ny][nz] === 0) {
                  onSurface = true
                }
              }
            }
          }
          if (onSurface) {
            surface.push({ x, y, z, race: this.cells[x][y][z] })
          }
        }
      }
    }
    return surface
  }

  getRaceCounts() {
    const counts = new Array(9).fill(0)
    const s = this.size
    for (let x = 0; x < s; x++) {
      for (let y = 0; y < s; y++) {
        for (let z = 0; z < s; z++) {
          counts[this.cells[x][y][z]]++
        }
      }
    }
    return counts
  }

  /**
   * 在指定位置放置一块 2D 图案（投射到 XZ 平面，Y 固定）
   */
  placePattern2D(pattern, cx, cy, cz, race) {
    if (!pattern) return
    const s = this.size
    if (pattern === 'random') {
      const half = 4
      for (let dx = -half; dx < half; dx++) {
        for (let dz = -half; dz < half; dz++) {
          if (Math.random() < 0.4) {
            const x = cx + dx, z = cz + dz
            if (x >= 0 && x < s && z >= 0 && z < s && cy >= 0 && cy < s) {
              this.cells[x][cy][z] = race
            }
          }
        }
      }
      return
    }
    for (const [dx, dy] of pattern) {
      const x = cx + dx, z = cz + dy
      if (x >= 0 && x < s && z >= 0 && z < s && cy >= 0 && cy < s) {
        this.cells[x][cy][z] = race
      }
    }
  }
}
