(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // ---------- 默认颜色 ----------

  const DEFAULT_COLORS = [
    '#00cc66', '#ff4444', '#4444ff', '#ffaa00',
    '#cc44cc', '#00cccc', '#ff8800', '#8800cc'
  ]

  // ---------- 浮窗控制 ----------

  const settingsToggle = document.getElementById('settings-toggle')
  const settingsPanel = document.getElementById('settings-panel')
  const panelClose = document.getElementById('panel-close')

  settingsToggle.addEventListener('click', function () {
    const isCollapsed = settingsPanel.classList.contains('collapsed')
    if (isCollapsed) {
      settingsPanel.classList.remove('collapsed')
    } else {
      settingsPanel.classList.add('collapsed')
    }
  })

  panelClose.addEventListener('click', function () {
    settingsPanel.classList.add('collapsed')
  })

  document.addEventListener('click', function (e) {
    if (!settingsPanel.classList.contains('collapsed') &&
        !settingsPanel.contains(e.target) &&
        e.target !== settingsToggle) {
      settingsPanel.classList.add('collapsed')
    }
  })

  // ---------- 种族设置 ----------

  let raceCount = parseInt(document.getElementById('input-race-count').value, 10) || 2
  let raceColors = []

function buildRaceColors() {
  for (let i = 0; i < raceCount; i++) {
    const picker = document.getElementById('race-color-' + i)
    raceColors[i] = picker ? picker.value : DEFAULT_COLORS[i % DEFAULT_COLORS.length]
  }
  raceColors.length = raceCount
}

  function renderRaceSettings() {
    const container = document.getElementById('race-colors-container')
    container.innerHTML = ''
    for (let i = 0; i < raceCount; i++) {
      const row = document.createElement('div')
      row.className = 'control-row'
      row.innerHTML =
        '种族 ' + (i + 1) +
        '：<input type="color" id="race-color-' + i + '" value="' + DEFAULT_COLORS[i % DEFAULT_COLORS.length] + '">' 
      container.appendChild(row)
    }
    buildRaceColors()
    // 同步更新绘制种族下拉框
    updateRaceSelect()
  }

  function updateRaceSelect() {
    const select = document.getElementById('race-select')
    const prev = select.value
    select.innerHTML = ''
    for (let i = 0; i < raceCount; i++) {
      const opt = document.createElement('option')
      opt.value = i + 1
      opt.textContent = '种族 ' + (i + 1)
      select.appendChild(opt)
    }
    // 尽量保持之前的选择
    if ([...select.options].some(o => o.value === prev)) {
      select.value = prev
    }
  }

  document.getElementById('input-race-count').addEventListener('input', function () {
    raceCount = Math.max(1, Math.min(8, parseInt(this.value, 10) || 1))
    this.value = raceCount
    renderRaceSettings()
    // 立即同步到 grid，确保 step() 使用正确的 raceCount
    if (grid) {
      buildRaceColors()
      grid.updateRaceCount(raceCount, raceColors)
    }
  })

  document.getElementById('race-colors-container').addEventListener('input', function (e) {
    if (e.target.type === 'color') {
      buildRaceColors()
      if (grid) {
        grid.updateRaceCount(raceCount, raceColors)
        grid.draw(ctx)
        updateStats()
      }
    }
  })

  // ---------- Canvas 尺寸 ----------

  function resizeCanvas() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (grid) {
      grid.updateCellSize(w, h)
      grid.updateRaceCount(raceCount, raceColors)
      grid.draw(ctx)
      updateStats()
    }
  }

  // ---------- 网格初始化 ----------

  let cols = parseInt(document.getElementById('input-cols').value, 10) || 50
  let rows = parseInt(document.getElementById('input-rows').value, 10) || 50
  let speed = parseInt(document.getElementById('slider-speed').value, 10)

  renderRaceSettings()
  let grid = new MultiGrid(cols, rows, raceCount, raceColors, window.innerWidth, window.innerHeight)
  grid.draw(ctx)
  updateStats()

  let running = false
  let lastTime = 0

  window.addEventListener('resize', resizeCanvas)

  // ---------- 按钮 ----------

  document.getElementById('btn-start').addEventListener('click', function () {
    if (running) return
    running = true
    setActiveButton('btn-start')
    requestAnimationFrame(loop)
  })

  document.getElementById('btn-pause').addEventListener('click', function () {
    running = false
    setActiveButton('btn-pause')
  })

  document.getElementById('btn-reset').addEventListener('click', function () {
    running = false
    setActiveButton('btn-pause')
    grid = new MultiGrid(cols, rows, raceCount, raceColors, window.innerWidth, window.innerHeight)
    grid.draw(ctx)
    updateStats()
  })

  document.getElementById('btn-random').addEventListener('click', function () {
    running = false
    setActiveButton('btn-pause')
    grid = new MultiGrid(cols, rows, raceCount, raceColors, window.innerWidth, window.innerHeight)
    grid.randomize()
    grid.draw(ctx)
    updateStats()
  })

  document.getElementById('btn-apply').addEventListener('click', function () {
    const newCols = parseInt(document.getElementById('input-cols').value, 10)
    const newRows = parseInt(document.getElementById('input-rows').value, 10)
    if (!newCols || !newRows || newCols < 1 || newRows < 1) {
      alert('请输入有效的网格尺寸')
      return
    }
    cols = newCols
    rows = newRows
    buildRaceColors()
    grid = new MultiGrid(cols, rows, raceCount, raceColors, window.innerWidth, window.innerHeight)
    grid.draw(ctx)
    updateStats()
  })

  document.getElementById('btn-apply-races').addEventListener('click', function () {
    buildRaceColors()
    updateRaceSelect()
    if (grid) {
      grid.updateRaceCount(raceCount, raceColors)
      grid.draw(ctx)
      updateStats()
    }
  })

  // ---------- 速度滑块 ----------

  var slider = document.getElementById('slider-speed')
  var speedValue = document.getElementById('speed-value')

  slider.addEventListener('input', function () {
    speed = parseInt(slider.value, 10)
    speedValue.textContent = speed + 'ms'
  })

  // ---------- Canvas 点击 ----------

  canvas.addEventListener('click', function (e) {
    var rect = canvas.getBoundingClientRect()
    var offsetX = e.clientX - rect.left
    var offsetY = e.clientY - rect.top
    var col = Math.floor(offsetX / grid.cellSize)
    var row = Math.floor(offsetY / grid.cellSize)
    var race = parseInt(document.getElementById('race-select').value, 10)
    grid.toggleCell(row, col, race)
    grid.draw(ctx)
    updateStats()
  })

  // ---------- 渲染循环 ----------

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

  // ---------- 统计浮窗 ----------

  function updateStats() {
    if (!grid) return
    const counts = grid.getRaceCounts()
    // 构建数组并按 count 倒序排序
    const items = []
    for (let i = 1; i <= raceCount; i++) {
      items.push({ raceId: i, count: counts[i] || 0, color: raceColors[i - 1] || '#888' })
    }
    items.sort((a, b) => b.count - a.count)

    const container = document.getElementById('stats-content')
    let html = ''
    for (const item of items) {
      html += '<div class="stats-row">' +
        '<span class="stats-swatch" style="background:' + item.color + '"></span>' +
        '<span class="stats-label">种族 ' + item.raceId + '</span>' +
        '<span class="stats-count">' + item.count + '</span>' +
        '</div>'
    }
    container.innerHTML = html
  }

  // ---------- 辅助 ----------

  function setActiveButton(activeId) {
    document.getElementById('btn-start').classList.remove('active')
    document.getElementById('btn-pause').classList.remove('active')
    document.getElementById('btn-reset').classList.remove('active')
    if (activeId) {
      document.getElementById(activeId).classList.add('active')
    }
  }

  // 初始状态
  setActiveButton('btn-pause')
  resizeCanvas()
})()
