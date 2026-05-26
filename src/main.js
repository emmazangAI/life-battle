(function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

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

  // 点击浮窗外区域自动收起
  document.addEventListener('click', function (e) {
    if (!settingsPanel.classList.contains('collapsed') &&
        !settingsPanel.contains(e.target) &&
        e.target !== settingsToggle) {
      settingsPanel.classList.add('collapsed')
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
    grid.updateCellSize(w, h)
    grid.draw(ctx)
  }

  // ---------- 网格初始化 ----------

  let cols = parseInt(document.getElementById('input-cols').value, 10) || 50
  let rows = parseInt(document.getElementById('input-rows').value, 10) || 50
  let speed = parseInt(document.getElementById('slider-speed').value, 10)

  let grid = new Grid(cols, rows, window.innerWidth, window.innerHeight)
  grid.draw(ctx)

  let running = false
  let lastTime = 0

  // 监听窗口resize
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
    grid = new Grid(cols, rows, window.innerWidth, window.innerHeight)
    grid.draw(ctx)
  })

  document.getElementById('btn-random').addEventListener('click', function () {
    running = false
    setActiveButton('btn-pause')
    grid = new Grid(cols, rows, window.innerWidth, window.innerHeight)
    grid.randomize()
    grid.draw(ctx)
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
    grid = new Grid(cols, rows, window.innerWidth, window.innerHeight)
    grid.draw(ctx)
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
    grid.toggleCell(row, col)
    grid.draw(ctx)
  })

  // ---------- 渲染循环 ----------

  function loop(timestamp) {
    if (!running) return
    if (timestamp - lastTime > speed) {
      grid.step()
      grid.draw(ctx)
      lastTime = timestamp
    }
    requestAnimationFrame(loop)
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
