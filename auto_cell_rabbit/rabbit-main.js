/**
 * 兔子游戏主程序
 */
(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // ---------- 颜色配置 ----------
  const DEFAULT_COLORS = ['#FF6B9D', '#FFC93C', '#6BCF7F', '#4ECDC4', '#A084DC', '#FF8E53']

  // ---------- UI 元素 ----------
  const btnObserve = document.getElementById('btn-observe-mode')
  const btnGuard = document.getElementById('btn-guard-mode')
  const btnStart = document.getElementById('btn-start')
  const btnPause = document.getElementById('btn-pause')
  const btnResetRabbit = document.getElementById('btn-reset-rabbit')
  const sliderSpeed = document.getElementById('slider-speed')
  const speedValue = document.getElementById('speed-value')
  const generationCount = document.getElementById('generation-count')
  const rabbitCount = document.getElementById('rabbit-count')
  const infoObserve = document.getElementById('info-observe')
  const infoGuard = document.getElementById('info-guard')
  const settingsBtn = document.getElementById('settings-btn')
  const settingsPanel = document.getElementById('settings-panel')
  const enableMultiRace = document.getElementById('enable-multi-race')

  // ---------- 游戏状态 ----------
  let gameMode = 'observe' // 'observe' 或 'guard'
  let multiRaceEnabled = false
  let raceCount = 2
  let raceColors = [DEFAULT_COLORS[0], DEFAULT_COLORS[1]]
  let running = false
  let lastTime = 0
  let speed = parseInt(sliderSpeed.value, 10)

  // ---------- Canvas 尺寸 ----------
  function resizeCanvas() {
    // Canvas 铺满整个屏幕
    const w = window.innerWidth
    const h = window.innerHeight
    
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    
    if (grid) {
      grid.updateCellSize(w, h)
      grid.draw(ctx)
      updateStats()
    }
  }

  window.addEventListener('resize', resizeCanvas)

  // ---------- 网格初始化 ----------
  const cols = 60
  const rows = 60

  let grid = new RabbitGrid(
    cols, 
    rows, 
    canvas.width / dpr, 
    canvas.height / dpr, 
    multiRaceEnabled, 
    raceCount, 
    raceColors
  )
  grid.placeRabbit()
  resizeCanvas()

  // ---------- 模式切换 ----------
  btnObserve.addEventListener('click', function () {
    gameMode = 'observe'
    btnObserve.classList.add('active')
    btnGuard.classList.remove('active')
    infoObserve.classList.remove('hidden')
    infoGuard.classList.add('hidden')
    canvas.style.cursor = 'default'
  })

  btnGuard.addEventListener('click', function () {
    gameMode = 'guard'
    btnGuard.classList.add('active')
    btnObserve.classList.remove('active')
    infoGuard.classList.remove('hidden')
    infoObserve.classList.add('hidden')
    canvas.style.cursor = 'crosshair'
  })

  // ---------- 控制按钮 ----------
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

  btnResetRabbit.addEventListener('click', function () {
    running = false
    btnStart.classList.remove('active')
    btnPause.classList.add('active')
    grid.placeRabbit()
    grid.draw(ctx)
    updateStats()
  })

  // ---------- 速度控制 ----------
  sliderSpeed.addEventListener('input', function () {
    speed = parseInt(sliderSpeed.value, 10)
    speedValue.textContent = speed + 'ms'
  })

  // ---------- Canvas 点击（守护模式）----------
  canvas.addEventListener('click', function (e) {
    if (gameMode !== 'guard') return
    
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / dpr / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / dpr / rect.height)
    const col = Math.floor(x / grid.cellSize)
    const row = Math.floor(y / grid.cellSize)
    const race = 1 // 简化版只用种族1
    
    grid.toggleCell(row, col, race)
    grid.draw(ctx)
    updateStats()
  })

  // ---------- 设置面板 ----------
  settingsBtn.addEventListener('click', function () {
    settingsPanel.classList.toggle('active')
  })

  enableMultiRace.addEventListener('change', function (e) {
    multiRaceEnabled = e.target.checked
    if (grid) {
      grid.setMultiRaceMode(multiRaceEnabled, raceCount, raceColors)
      grid.draw(ctx)
      updateStats()
    }
  })

  // ---------- 游戏循环 ----------
  function loop(timestamp) {
    if (!running) return
    if (timestamp - lastTime > speed) {
      grid.step()
      grid.draw(ctx)
      updateStats()
      lastTime = timestamp
    }
    requestAnimationFrame(loop)
  }

  // ---------- 统计更新 ----------
  function updateStats() {
    if (!grid) return
    generationCount.textContent = grid.generation
    rabbitCount.textContent = grid.getRabbitCellCount()
  }

  // 初始化完成
  console.log('🐰 守护小兔子游戏已启动！')
})()
