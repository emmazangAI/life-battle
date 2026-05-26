/**
 * 3D 康威生命游戏 — 主程序
 * 等轴投影，规则 B5/S45，26邻居
 */
(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  const RACE_COLORS = ['#ff6b9d', '#00ff88', '#4da6ff']
  const RACE_LABELS = ['粉色', '绿色', '蓝色']

  // UI
  const btnStart = document.getElementById('btn-start')
  const btnPause = document.getElementById('btn-pause')
  const btnReset = document.getElementById('btn-reset')
  const btnClear = document.getElementById('btn-clear')
  const sliderSpeed = document.getElementById('slider-speed')
  const speedValue = document.getElementById('speed-value')
  const generationDisplay = document.getElementById('generation')
  const teamACount = document.getElementById('team-a-count')
  const teamBCount = document.getElementById('team-b-count')
  const teamCCount = document.getElementById('team-c-count')
  const sliceDisplay = document.getElementById('slice-display')
  const btnSliceUp = document.getElementById('btn-slice-up')
  const btnSliceDown = document.getElementById('btn-slice-down')
  const btnSliceAll = document.getElementById('btn-slice-all')

  // 游戏状态
  let running = false
  let lastTime = 0
  let speed = parseInt(sliderSpeed.value, 10)
  const raceCount = 3

  // 网格大小：移动端小一些
  const isMobile = window.innerWidth <= 768
  const GRID_SIZE = isMobile ? 12 : 16

  // 3D 网格
  let grid = new Grid3D(GRID_SIZE, raceCount, RACE_COLORS)
  let renderer = new IsoRenderer(canvas, ctx, dpr)

  // 自动计算 voxelSize 让立方体铺满屏幕
  function calcVoxelSize() {
    const w = window.innerWidth
    const h = window.innerHeight
    // 等轴投影中，网格宽度 ≈ size * 2 * voxelSize * 0.866
    // 等轴投影中，网格高度 ≈ size * voxelSize * 1.5 + size * voxelSize * 0.6
    const fitW = (w * 0.85) / (GRID_SIZE * 2 * 0.866)
    const fitH = (h * 0.65) / (GRID_SIZE * 1.6)
    renderer.voxelSize = Math.floor(Math.min(fitW, fitH))
  }

  // 初始化场景
  function resetBattle() {
    grid = new Grid3D(GRID_SIZE, raceCount, RACE_COLORS)
    const s = GRID_SIZE
    const mid = Math.floor(s / 2)

    // 种族1（粉色）：顶部多层随机团
    for (let y = s - 4; y < s - 1; y++) {
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          if (Math.random() < 0.5) {
            const x = mid + dx, z = mid + dz
            if (x >= 0 && x < s && z >= 0 && z < s) {
              grid.cells[x][y][z] = 1
            }
          }
        }
      }
    }

    // 种族2（绿色）：底部多层随机团
    for (let y = 1; y < 4; y++) {
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          if (Math.random() < 0.5) {
            const x = mid + dx, z = mid + dz
            if (x >= 0 && x < s && z >= 0 && z < s) {
              grid.cells[x][y][z] = 2
            }
          }
        }
      }
    }

    // 种族3（蓝色）：中间多层随机团
    for (let y = mid - 1; y <= mid + 1; y++) {
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          if (Math.random() < 0.45) {
            const x = mid + dx, z = mid + dz
            if (x >= 0 && x < s && z >= 0 && z < s) {
              grid.cells[x][y][z] = 3
            }
          }
        }
      }
    }

    console.log('初始活细胞:', grid.getAliveCells().length)
    draw()
    updateStats()
  }

  // Canvas 尺寸
  function resizeCanvas() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    calcVoxelSize()
    draw()
  }

  window.addEventListener('resize', resizeCanvas)

  function draw() {
    renderer.draw(grid, RACE_COLORS)
  }

  function updateStats() {
    const counts = grid.getRaceCounts()
    generationDisplay.textContent = grid.generation
    teamACount.textContent = counts[1] || 0
    teamBCount.textContent = counts[2] || 0
    if (teamCCount) teamCCount.textContent = counts[3] || 0
  }

  // 游戏循环
  function loop(timestamp) {
    if (!running) return
    if (timestamp - lastTime > speed) {
      grid.step()
      draw()
      updateStats()
      lastTime = timestamp
    }
    requestAnimationFrame(loop)
  }

  // 控制按钮
  btnStart.addEventListener('click', function () {
    if (running) return
    running = true
    btnStart.classList.add('active')
    btnPause.classList.remove('active')
    requestAnimationFrame(loop)
  })

  btnPause.addEventListener('click', function () {
    running = false
    btnStart.classList.remove('active')
    btnPause.classList.add('active')
  })

  btnReset.addEventListener('click', function () {
    running = false
    btnStart.classList.remove('active')
    btnPause.classList.add('active')
    resetBattle()
  })

  btnClear.addEventListener('click', function () {
    running = false
    btnStart.classList.remove('active')
    btnPause.classList.add('active')
    grid = new Grid3D(GRID_SIZE, raceCount, RACE_COLORS)
    draw()
    updateStats()
  })

  sliderSpeed.addEventListener('input', function () {
    speed = parseInt(sliderSpeed.value, 10)
    speedValue.textContent = speed + 'ms'
  })

  // 层切片控制
  btnSliceUp.addEventListener('click', function () {
    if (renderer.sliceY < GRID_SIZE - 1) {
      renderer.sliceY = renderer.sliceY < 0 ? 0 : renderer.sliceY + 1
      sliceDisplay.textContent = (renderer.sliceY + 1) + '/' + GRID_SIZE
      draw()
    }
  })

  btnSliceDown.addEventListener('click', function () {
    if (renderer.sliceY > 0) {
      renderer.sliceY--
      sliceDisplay.textContent = (renderer.sliceY + 1) + '/' + GRID_SIZE
      draw()
    }
  })

  btnSliceAll.addEventListener('click', function () {
    renderer.sliceY = -1
    sliceDisplay.textContent = '全部'
    draw()
  })

  // 鼠标滚轮缩放
  canvas.addEventListener('wheel', function (e) {
    e.preventDefault()
    renderer.voxelSize = Math.max(4, Math.min(24, renderer.voxelSize - e.deltaY * 0.02))
    draw()
  })

  // 初始化
  resizeCanvas()
  resetBattle()
  console.log('🧊 3D Battle Mode Ready! Grid:', GRID_SIZE + '³')
})()
