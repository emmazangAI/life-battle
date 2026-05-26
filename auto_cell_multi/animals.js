/**
 * 动物像素图案定义
 * 兔子 (Team A - 粉色) vs 乌龟 (Team B - 绿色)
 */

// 兔子图案 - 简化版
const RABBIT_PATTERN = [
  // 左耳
  [-3, -10], [-2, -10],
  [-3, -9], [-2, -9],
  [-3, -8], [-2, -8],
  [-3, -7], [-2, -7],
  // 右耳
  [1, -10], [2, -10],
  [1, -9], [2, -9],
  [1, -8], [2, -8],
  [1, -7], [2, -7],
  // 脸
  [-2, -6], [-1, -6], [0, -6], [1, -6],
  [-3, -5], [-2, -5], [-1, -5], [0, -5], [1, -5], [2, -5],
  [-3, -4], [-2, -4], [-1, -4], [0, -4], [1, -4], [2, -4],
  [-3, -3], [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3],
  [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
  [-2, -1], [-1, -1], [0, -1], [1, -1],
]

// 乌龟图案 - 根据最新参考图（圆润可爱版）
// 向上移动4行，和兔子对齐
const TURTLE_PATTERN = [
  // 头部（小圆头伸出）
  [-1, -11], [0, -11],
  [-1, -10], [0, -10],
  
  // 龟壳（圆润的椭圆）
  [-2, -9], [-1, -9], [0, -9], [1, -9],
  [-3, -8], [-2, -8], [-1, -8], [0, -8], [1, -8], [2, -8],
  [-3, -7], [-2, -7], [-1, -7], [0, -7], [1, -7], [2, -7],
  [-3, -6], [-2, -6], [-1, -6], [0, -6], [1, -6], [2, -6],
  [-3, -5], [-2, -5], [-1, -5], [0, -5], [1, -5], [2, -5],
  [-3, -4], [-2, -4], [-1, -4], [0, -4], [1, -4], [2, -4],
  [-2, -3], [-1, -3], [0, -3], [1, -3],
  
  // 左前脚
  [-4, -7], [-4, -6],
  // 右前脚
  [3, -7], [3, -6],
  // 左后脚
  [-4, -4], [-4, -3],
  // 右后脚
  [3, -4], [3, -3],
  
  // 尾巴（小短尾）
  [0, -2],
]

/**
 * 在网格中放置兔子
 * @param {Array} grid - 网格数组
 * @param {number} centerCol - 中心列
 * @param {number} centerRow - 中心行
 * @param {number} teamId - 队伍ID（1=兔子，2=猫）
 */
function placeRabbit(grid, centerCol, centerRow, teamId = 1) {
  const rows = grid.length
  const cols = grid[0].length
  
  for (const [dx, dy] of RABBIT_PATTERN) {
    const col = centerCol + dx
    const row = centerRow + dy
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col] = teamId
    }
  }
}

/**
 * 在网格中放置乌龟
 * @param {Array} grid - 网格数组
 * @param {number} centerCol - 中心列
 * @param {number} centerRow - 中心行
 * @param {number} teamId - 队伍ID（1=兔子，2=乌龟）
 */
function placeTurtle(grid, centerCol, centerRow, teamId = 2) {
  const rows = grid.length
  const cols = grid[0].length
  
  for (const [dx, dy] of TURTLE_PATTERN) {
    const col = centerCol + dx
    const row = centerRow + dy
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col] = teamId
    }
  }
}

/**
 * 初始化对战场景：左侧兔子 vs 右侧乌龟
 * @param {Array} grid - 网格数组
 * @param {number} cols - 列数
 * @param {number} rows - 行数
 */
function initBattleScene(grid, cols, rows) {
  // 清空网格
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = 0
    }
  }
  
  // 左侧放置兔子（Team A - 粉色）
  const leftCol = Math.floor(cols * 0.3)
  const centerRow = Math.floor(rows / 2)
  placeRabbit(grid, leftCol, centerRow, 1)
  
  // 右侧放置乌龟（Team B - 绿色）
  const rightCol = Math.floor(cols * 0.7)
  placeTurtle(grid, rightCol, centerRow, 2)
}
