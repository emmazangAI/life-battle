/**
 * 3D 等轴投影渲染器
 */
class IsoRenderer {
  constructor(canvas, ctx, dpr) {
    this.canvas = canvas
    this.ctx = ctx
    this.dpr = dpr
    this.voxelSize = 12
    this.offsetX = 0
    this.offsetY = 0
    // 层切片：-1 表示显示全部
    this.sliceY = -1
  }

  /**
   * 3D 坐标 → 等轴投影 2D 像素坐标
   */
  isoProject(x, y, z) {
    const s = this.voxelSize
    // 等轴投影公式
    const px = (x - z) * s * 0.866 + this.offsetX
    const py = (x + z) * s * 0.5 - y * s + this.offsetY
    return { px, py }
  }

  /**
   * 绘制单个 voxel（等轴小方块）
   */
  drawVoxel(x, y, z, color, alpha = 1) {
    const ctx = this.ctx
    const s = this.voxelSize
    const { px, py } = this.isoProject(x, y, z)

    ctx.globalAlpha = alpha

    // 顶面
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(px, py - s * 0.5)
    ctx.lineTo(px + s * 0.866, py)
    ctx.lineTo(px, py + s * 0.5)
    ctx.lineTo(px - s * 0.866, py)
    ctx.closePath()
    ctx.fill()

    // 左面（暗）
    ctx.fillStyle = this.darken(color, 0.7)
    ctx.beginPath()
    ctx.moveTo(px - s * 0.866, py)
    ctx.lineTo(px, py + s * 0.5)
    ctx.lineTo(px, py + s * 0.5 + s * 0.6)
    ctx.lineTo(px - s * 0.866, py + s * 0.6)
    ctx.closePath()
    ctx.fill()

    // 右面（更暗）
    ctx.fillStyle = this.darken(color, 0.5)
    ctx.beginPath()
    ctx.moveTo(px + s * 0.866, py)
    ctx.lineTo(px, py + s * 0.5)
    ctx.lineTo(px, py + s * 0.5 + s * 0.6)
    ctx.lineTo(px + s * 0.866, py + s * 0.6)
    ctx.closePath()
    ctx.fill()

    ctx.globalAlpha = 1
  }

  darken(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return '#' + [r, g, b].map(c => Math.floor(c * factor).toString(16).padStart(2, '0')).join('')
  }

  /**
   * 绘制整个 3D 场景
   */
  draw(grid, raceColors) {
    const ctx = this.ctx
    const w = this.canvas.width / this.dpr
    const h = this.canvas.height / this.dpr

    // 清屏
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)

    // 居中偏移
    this.offsetX = w / 2
    this.offsetY = h * 0.5

    const s = grid.size

    // 绘制底部网格线（参考平面）
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    const gridY = 0
    for (let x = 0; x <= s; x++) {
      const start = this.isoProject(x, gridY, 0)
      const end = this.isoProject(x, gridY, s)
      ctx.beginPath()
      ctx.moveTo(start.px, start.py)
      ctx.lineTo(end.px, end.py)
      ctx.stroke()
    }
    for (let z = 0; z <= s; z++) {
      const start = this.isoProject(0, gridY, z)
      const end = this.isoProject(s, gridY, z)
      ctx.beginPath()
      ctx.moveTo(start.px, start.py)
      ctx.lineTo(end.px, end.py)
      ctx.stroke()
    }

    // 获取需要绘制的细胞（按深度排序，远处先画）
    let cells = grid.getSurfaceCells()

    // 层切片过滤
    if (this.sliceY >= 0) {
      cells = grid.getAliveCells().filter(c => c.y === this.sliceY)
    }

    // 按等轴深度排序（从远到近）
    cells.sort((a, b) => {
      const da = a.x + a.z - a.y
      const db = b.x + b.z - b.y
      return da - db
    })

    // 绘制活细胞
    for (const cell of cells) {
      const color = raceColors[cell.race - 1] || '#ffffff'
      const alpha = this.sliceY >= 0 ? 1 : 0.85
      this.drawVoxel(cell.x, cell.y, cell.z, color, alpha)
    }

    // 绘制层切片指示器
    if (this.sliceY >= 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      const corners = [
        this.isoProject(0, this.sliceY, 0),
        this.isoProject(s, this.sliceY, 0),
        this.isoProject(s, this.sliceY, s),
        this.isoProject(0, this.sliceY, s),
      ]
      ctx.beginPath()
      ctx.moveTo(corners[0].px, corners[0].py)
      for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].px, corners[i].py)
      ctx.closePath()
      ctx.fill()
    }
  }
}
