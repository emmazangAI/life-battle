/**
 * 兔子 vs 乌龟 - 对战模式主程序
 */
(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // 多语言配置
  const translations = {
    zh: {
      gen: '代数',
      subtitle: '康威生命游戏 - 对战模式',
      'team-rabbit': '兔子队',
      'team-turtle': '乌龟队',
      'team-a-color': '粉色阵营',
      'team-b-color': '绿色阵营',
      'start-game': '开始游戏',
      start: '开始',
      pause: '暂停',
      reset: '重置',
      clear: '清空',
      speed: '速度',
      draw: '绘制',
      rabbit: '🐰 兔子',
      turtle: '🐢 乌龟',
    },
    en: {
      gen: 'Gen',
      subtitle: "Conway's Game of Life - Battle Mode",
      'team-rabbit': 'TEAM RABBIT',
      'team-turtle': 'TEAM TURTLE',
      'team-a-color': 'Pink Team',
      'team-b-color': 'Green Team',
      'start-game': 'START GAME',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      clear: 'Clear',
      speed: 'Speed',
      draw: 'Draw',
      rabbit: '🐰 Rabbit',
      turtle: '🐢 Turtle',
    }
  }

  let currentLang = 'zh' // 默认中文

  // 切换语言
  function switchLanguage(lang) {
    currentLang = lang
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (translations[lang][key]) {
        el.textContent = translations[lang][key]
      }
    })
    // 更新语言按钮文本
    btnLang.textContent = lang === 'zh' ? 'EN' : '中文'
  }

  // 颜色配置
  const COLORS = ['#ff6b9d', '#00ff88'] // 兔子粉色、乌龟绿色

  // UI 元素
  const introOverlay = document.getElementById('intro-overlay')
  const introStartBtn = document.getElementById('intro-start-btn')
  const btnStart = document.getElementById('btn-start')
  const btnPause = document.getElementById('btn-pause')
  const btnReset = document.getElementById('btn-reset')
  const btnClear = document.getElementById('btn-clear')
  const btnRace1 = document.getElementById('btn-race-1')
  const btnRace2 = document.getElementById('btn-race-2')
  const btnLang = document.getElementById('btn-lang')
  const sliderSpeed = document.getElementById('slider-speed')
  const speedValue = document.getElementById('speed-value')
  const generationDisplay = document.getElementById('generation')
  const teamACount = document.getElementById('team-a-count')
  const teamBCount = document.getElementById('team-b-count')

  // 游戏状态
  let running = false
  let lastTime = 0
  let speed = parseInt(sliderSpeed.value, 10)
  let currentRace = 1 // 当前绘制的种族（1=兔子，2=乌龟）

  // Canvas 尺寸调整
  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    
    if (grid) {
      grid.updateCellSize(window.innerWidth, window.innerHeight)
      draw()
    }
  }

  window.addEventListener('resize', resizeCanvas)

  // 初始化网格 - 根据屏幕尺寸动态计算行列数，让格子铺满屏幕
  const CELL_SIZE = 10 // 固定每格大小
  const cols = Math.floor(window.innerWidth / CELL_SIZE)
  const rows = Math.floor(window.innerHeight / CELL_SIZE)
  let grid = new MultiGrid(cols, rows, 2, COLORS, window.innerWidth, window.innerHeight)
  // 强制使用固定 cellSize，保证铺满
  grid.cellSize = CELL_SIZE
  
  // 确保网格使用正确的颜色
  grid.raceColors = COLORS
  
  // 初始化对战场景
  function resetBattle() {
    initBattleScene(grid.cells, cols, rows)
    grid.generation = 0
    draw()
    updateStats()
  }

  // 绘制网格
  function draw() {
    const w = grid.cellSize
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * w
        const y = r * w
        const cellValue = grid.cells[r][c]
        
        if (cellValue > 0) {
          // 活细胞 - 实心矩形
          ctx.fillStyle = COLORS[cellValue - 1]
          ctx.fillRect(x, y, w, w)
        }
        
        // 网格线
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 0.5
        ctx.strokeRect(x, y, w, w)
      }
    }
  }

  // 更新统计信息
  function updateStats() {
    const counts = grid.getRaceCounts()
    generationDisplay.textContent = grid.generation
    teamACount.textContent = counts[1] || 0
    teamBCount.textContent = counts[2] || 0
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

  // 初始加载按钮
  introStartBtn.addEventListener('click', function () {
    introOverlay.classList.add('hidden')
    resetBattle()
  })

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
    grid.cells = grid.createEmptyGrid()
    grid.generation = 0
    draw()
    updateStats()
  })

  // 速度滑块
  sliderSpeed.addEventListener('input', function () {
    speed = parseInt(sliderSpeed.value, 10)
    speedValue.textContent = speed + 'ms'
  })

  // 语言切换按钮
  btnLang.addEventListener('click', function () {
    switchLanguage(currentLang === 'zh' ? 'en' : 'zh')
  })

  // 种族选择按钮
  btnRace1.addEventListener('click', function () {
    currentRace = 1
    btnRace1.classList.add('active')
    btnRace2.classList.remove('active')
  })

  btnRace2.addEventListener('click', function () {
    currentRace = 2
    btnRace2.classList.add('active')
    btnRace1.classList.remove('active')
  })

  // Canvas 点击 - 绘制细胞（根据当前选中的种族）
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / dpr / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / dpr / rect.height)
    const col = Math.floor(x / grid.cellSize)
    const row = Math.floor(y / grid.cellSize)
    
    grid.toggleCell(row, col, currentRace)
    draw()
    updateStats()
  })

  // 初始化
  resizeCanvas()
  resetBattle()
  console.log('🐰 vs 🐱 Battle Mode Ready!')
})()
