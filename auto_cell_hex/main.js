/**
 * 六边形多种族对战 - 主程序
 */
(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // 多语言
  const translations = {
    zh: { gen: '代数', start: '开始', pause: '暂停', reset: '重置', clear: '清空', speed: '速度' },
    en: { gen: 'Gen', start: 'Start', pause: 'Pause', reset: 'Reset', clear: 'Clear', speed: 'Speed' }
  }
  let currentLang = 'zh'

  function switchLanguage(lang) {
    currentLang = lang
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (translations[lang][key]) el.textContent = translations[lang][key]
    })
    btnLang.textContent = lang === 'zh' ? 'EN' : '中文'
  }

  // 颜色配置
  const RACE_COLORS = ['#ff6b9d', '#00ff88', '#4da6ff', '#ffffff']
  const RACE_LABELS = ['粉色', '绿色', '蓝色', '白色']

  // UI 元素
  const btnStart = document.getElementById('btn-start')
  const btnPause = document.getElementById('btn-pause')
  const btnReset = document.getElementById('btn-reset')
  const btnClear = document.getElementById('btn-clear')
  const btnLang = document.getElementById('btn-lang')
  const sliderSpeed = document.getElementById('slider-speed')
  const speedValue = document.getElementById('speed-value')
  const generationDisplay = document.getElementById('generation')
  const teamACount = document.getElementById('team-a-count')
  const teamBCount = document.getElementById('team-b-count')
  const teamCCount = document.getElementById('team-c-count')

  const raceButtons = [
    document.getElementById('btn-race-1'),
    document.getElementById('btn-race-2'),
    document.getElementById('btn-race-3'),
    document.getElementById('btn-race-4'),
  ]
  const btnAddRace = document.getElementById('btn-add-race')

  // 游戏状态
  let running = false
  let lastTime = 0
  let speed = parseInt(sliderSpeed.value, 10)
  let currentRace = 1
  let raceCount = 3
  let racePatterns = ['gosperGun', 'penguin', 'spaceship117', 'pulsar']

  // 撤回功能
  const undoStack = []
  const MAX_UNDO = 20
  function saveSnapshot() {
    const snapshot = grid.cells.map(row => [...row])
    undoStack.push(snapshot)
    if (undoStack.length > MAX_UNDO) undoStack.shift()
  }
  function undo() {
    if (undoStack.length === 0) return
    grid.cells = undoStack.pop()
    draw()
    updateStats()
  }

  // ---------- 网格配置 ----------
  const isMobile = window.innerWidth <= 768
  const HEX_SIZE = isMobile ? 5 : 8
  let cols, rows, grid

  function createGrid() {
    const w = window.innerWidth
    const h = window.innerHeight
    const hexW = HEX_SIZE * 2
    const hexH = Math.sqrt(3) * HEX_SIZE
    cols = Math.floor(w / (hexW * 0.75)) - 1
    rows = Math.floor(h / hexH) - 1
    grid = new HexGrid(cols, rows, raceCount, RACE_COLORS.slice(0, raceCount), w, h)
  }

  // Canvas 尺寸
  let resizeTimer = null
  function resizeCanvas() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const hexW = HEX_SIZE * 2
    const hexH = Math.sqrt(3) * HEX_SIZE
    const newCols = Math.floor(w / (hexW * 0.75)) - 1
    const newRows = Math.floor(h / hexH) - 1
    if (!grid || newCols !== cols || newRows !== rows) {
      createGrid()
      resetBattle()
    } else {
      draw()
    }
  }

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resizeCanvas, 100)
  })

  createGrid()

  // 初始化对战
  function resetBattle() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.cells[r][c] = 0
      }
    }
    grid.generation = 0

    const layouts = raceCount === 2
      ? [[0.5, 0.25], [0.5, 0.75]]
      : raceCount === 3
        ? [[0.5, 0.2], [0.5, 0.5], [0.5, 0.8]]
        : [[0.3, 0.25], [0.7, 0.25], [0.3, 0.75], [0.7, 0.75]]

    for (let i = 0; i < raceCount; i++) {
      const [hPos, vPos] = layouts[i]
      const col = Math.floor(cols * hPos)
      const row = Math.floor(rows * vPos)
      placePattern(grid.cells, racePatterns[i], col, row, i + 1)
    }

    draw()
    updateStats()
  }

  // 绘制六边形网格
  function draw() {
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)

    const size = HEX_SIZE
    const hexH = Math.sqrt(3) * size

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const { x, y } = grid.hexToPixel(r, c)
        const cellValue = grid.cells[r][c]

        if (cellValue > 0) {
          // 填充六边形
          ctx.fillStyle = RACE_COLORS[cellValue - 1] || '#ffffff'
          drawHex(x, y, size * 0.9)
          ctx.fill()
        }

        // 网格线
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 0.5
        drawHex(x, y, size * 0.9)
        ctx.stroke()
      }
    }
  }

  // 绘制单个六边形路径
  function drawHex(cx, cy, size) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 180 * (60 * i - 30)
      const x = cx + size * Math.cos(angle)
      const y = cy + size * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  // 更新统计
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
    grid.cells = grid.createEmptyGrid()
    grid.generation = 0
    draw()
    updateStats()
  })

  sliderSpeed.addEventListener('input', function () {
    speed = parseInt(sliderSpeed.value, 10)
    speedValue.textContent = speed + 'ms'
  })

  btnLang.addEventListener('click', function () {
    switchLanguage(currentLang === 'zh' ? 'en' : 'zh')
  })

  // ---------- 种族按钮 + 图案库 ----------
  const patternPanel = document.getElementById('pattern-panel')
  const patternPanelTitle = document.getElementById('pattern-panel-title')
  const patternPanelClose = document.getElementById('pattern-panel-close')
  const patternGridAnimal = document.getElementById('pattern-grid-animal')
  const patternGridClassic = document.getElementById('pattern-grid-classic')

  let panelForRace = 1
  let stampPattern = null

  function updateRaceButtons() {
    for (let i = 0; i < 4; i++) {
      const btn = raceButtons[i]
      if (i < raceCount) {
        btn.style.display = ''
        const p = PATTERN_LIBRARY[racePatterns[i]]
        btn.textContent = p ? (currentLang === 'zh' ? p.name : p.nameEn) : ('种族' + (i + 1))
      } else {
        btn.style.display = 'none'
      }
    }
    btnAddRace.style.display = raceCount >= 4 ? 'none' : ''
  }

  function setActiveRace(raceIdx) {
    currentRace = raceIdx + 1
    raceButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === raceIdx)
    })
  }

  raceButtons.forEach((btn, i) => {
    btn.addEventListener('click', function () {
      setActiveRace(i)
      panelForRace = i + 1
      patternPanelTitle.textContent = RACE_LABELS[i] + '种族 — 选择图案'
      patternPanel.classList.add('active')
      renderPatternPanel()
    })
  })

  btnAddRace.addEventListener('click', function () {
    if (raceCount >= 4) return
    raceCount++
    grid.raceCount = raceCount
    grid.raceColors = RACE_COLORS.slice(0, raceCount)
    updateRaceButtons()
    resetBattle()
  })

  function renderPatternPanel() {
    patternGridAnimal.innerHTML = ''
    patternGridClassic.innerHTML = ''

    Object.entries(PATTERN_LIBRARY).forEach(([id, p]) => {
      const div = document.createElement('div')
      div.className = 'pattern-item'
      if (id === racePatterns[panelForRace - 1]) div.classList.add('selected')
      if (id === stampPattern) div.classList.add('stamp-active')
      div.textContent = currentLang === 'zh' ? p.name : p.nameEn
      div.dataset.patternId = id
      div.title = p.desc

      div.addEventListener('click', function (e) {
        e.stopPropagation()
        if (stampPattern === id) {
          stampPattern = null
          canvas.style.cursor = 'crosshair'
          patternPanelTitle.textContent = RACE_LABELS[panelForRace - 1] + '种族 — 选择图案'
        } else {
          stampPattern = id
          canvas.style.cursor = 'cell'
          const pName = currentLang === 'zh' ? p.name : p.nameEn
          patternPanelTitle.textContent = '🖌️ 点击画布放置: ' + pName
          racePatterns[panelForRace - 1] = id
          updateRaceButtons()
        }
        renderPatternPanel()
      })

      if (p.category === 'animal') {
        patternGridAnimal.appendChild(div)
      } else {
        patternGridClassic.appendChild(div)
      }
    })
  }

  patternPanelClose.addEventListener('click', function () {
    patternPanel.classList.remove('active')
  })

  // Canvas 点击
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (canvas.width / dpr / rect.width)
    const py = (e.clientY - rect.top) * (canvas.height / dpr / rect.height)
    const { row, col } = grid.pixelToHex(px, py)

    saveSnapshot()
    if (stampPattern) {
      placePattern(grid.cells, stampPattern, col, row, currentRace)
    } else {
      grid.toggleCell(row, col, currentRace)
    }
    draw()
    updateStats()
  })

  // 键盘撤回
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
  })

  // 初始化
  resizeCanvas()
  resetBattle()
  updateRaceButtons()
  setActiveRace(0)
  console.log('⬡ Hex Battle Mode Ready!')
})()
