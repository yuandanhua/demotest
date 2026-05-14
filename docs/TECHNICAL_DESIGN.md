# 猜数字游戏 - 技术设计文档

## 架构概览

### 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                     用户界面层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 输入框   │  │ 按钮组   │  │ 显示区   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│                     业务逻辑层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │游戏控制器│  │输入验证器│  │统计管理器│              │
│  └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│                     数据访问层                            │
│  ┌──────────┐  ┌──────────┐                              │
│  │ 本地存储 │  │ 内存状态 │                              │
│  └──────────┘  └──────────┘                              │
└─────────────────────────────────────────────────────────┘
```

### 技术栈

- **前端框架**: 纯JavaScript (ES6+)
- **样式**: CSS3 + Flexbox/Grid
- **构建工具**: 无构建步骤
- **测试框架**: Playwright (E2E)
- **部署**: 静态文件托管

## 模块设计

### 1. 游戏控制器模块 (GameController)

#### 职责
- 游戏状态管理
- 游戏流程控制
- 与UI模块的交互

#### 核心类设计
```javascript
class GameController {
    constructor()
    startNewGame()
    makeGuess(guess)
    validateInput(guess)
    endGame()
    resetGame()
}
```

#### 状态机设计
```
IDLE → PLAYING → COMPLETED → IDLE
  ↓        ↓           ↓
INIT    GUESS     SHOW_RESULT
```

### 2. 输入验证模块 (InputValidator)

#### 职责
- 输入格式验证
- 范围验证
- 错误提示生成

#### 验证规则
```javascript
const VALIDATION_RULES = {
    EMPTY: '请输入一个数字',
    NOT_NUMBER: '请输入有效的数字',
    OUT_OF_RANGE: '请输入1-100之间的数字',
    NOT_INTEGER: '请输入整数'
};
```

### 3. 统计管理模块 (StatisticsManager)

#### 职责
- 猜测次数统计
- 历史记录管理
- 最佳成绩追踪

#### 数据结构
```javascript
class StatisticsManager {
    constructor()
    incrementGuessCount()
    getGuessCount()
    saveBestScore(count)
    getBestScore()
}
```

### 4. UI管理模块 (UIManager)

#### 职责
- DOM操作
- 事件监听
- UI更新

#### 主要方法
```javascript
class UIManager {
    showMessage(message, type)
    updateDisplay(data)
    clearInput()
    focusInput()
    showGameOver(guesses)
}
```

## 数据结构设计

### 游戏状态数据结构
```javascript
const gameState = {
    targetNumber: 42,        // 目标数字
    guesses: [],              // 猜测历史
    guessCount: 0,            // 猜测次数
    status: 'PLAYING',        // 游戏状态
    startTime: null,          // 开始时间
    endTime: null            // 结束时间
};
```

### 用户输入数据结构
```javascript
const userInput = {
    value: '50',             // 原始输入值
    isValid: true,           // 是否有效
    error: null,             // 错误信息
    timestamp: Date.now()    // 时间戳
};
```

### 统计数据结构
```javascript
const statistics = {
    currentGame: {
        guesses: 0,
        history: []
    },
    allTime: {
        bestScore: null,
        totalGames: 0,
        averageGuesses: 0
    }
};
```

## 算法设计

### 1. 随机数生成算法

#### 目标
生成1-100之间的随机整数

#### 实现
```javascript
function generateTargetNumber() {
    return Math.floor(Math.random() * 100) + 1;
}
```

#### 算法分析
- 时间复杂度: O(1)
- 空间复杂度: O(1)
- 随机性: 伪随机，适用于游戏

### 2. 数字比较算法

#### 目标
比较用户猜测与目标数字

#### 实现
```javascript
function compareGuess(guess, target) {
    if (guess === target) return 'CORRECT';
    if (guess < target) return 'TOO_LOW';
    return 'TOO_HIGH';
}
```

#### 算法分析
- 时间复杂度: O(1)
- 空间复杂度: O(1)
- 准确性: 100%

### 3. 输入验证算法

#### 目标
验证用户输入的有效性

#### 实现
```javascript
function validateInput(input) {
    // 1. 空值检查
    if (!input || input.trim() === '') {
        return { valid: false, error: '请输入数字' };
    }

    // 2. 数字检查
    const num = Number(input);
    if (isNaN(num)) {
        return { valid: false, error: '请输入有效数字' };
    }

    // 3. 整数检查
    if (!Number.isInteger(num)) {
        return { valid: false, error: '请输入整数' };
    }

    // 4. 范围检查
    if (num < 1 || num > 100) {
        return { valid: false, error: '请输入1-100之间的数字' };
    }

    return { valid: true, value: num };
}
```

## 接口设计

### 1. 游戏控制接口

```javascript
// 开始新游戏
gameController.startNewGame(): void

// 提交猜测
gameController.makeGuess(guess: number): GuessResult

// 重置游戏
gameController.resetGame(): void

// 获取当前状态
gameController.getState(): GameState
```

### 2. 输入验证接口

```javascript
// 验证输入
inputValidator.validate(input: string): ValidationResult

// 获取错误提示
inputValidator.getErrorMessage(errorCode: string): string
```

### 3. 统计管理接口

```javascript
// 增加猜测次数
statsManager.incrementGuessCount(): number

// 保存最佳成绩
statsManager.saveBestScore(count: number): void

// 获取统计信息
statsManager.getStatistics(): Statistics
```

## UI/UX设计

### 1. 页面布局

```html
<div class="game-container">
    <header class="game-header">
        <h1>猜数字游戏</h1>
        <p>猜一个1到100之间的数字</p>
    </header>

    <main class="game-main">
        <div class="input-section">
            <input type="number" id="guessInput"
                   min="1" max="100" placeholder="输入你的猜测">
            <button id="submitBtn">提交猜测</button>
        </div>

        <div class="message-section">
            <div id="messageBox"></div>
        </div>

        <div class="stats-section">
            <div>猜测次数: <span id="guessCount">0</span></div>
            <div>最佳成绩: <span id="bestScore">-</span></div>
        </div>
    </main>

    <footer class="game-footer">
        <button id="restartBtn">再来一局</button>
    </footer>
</div>
```

### 2. 样式设计原则

#### 响应式设计
```css
/* 移动端优先 */
.game-container {
    max-width: 100%;
    padding: 1rem;
}

/* 平板设备 */
@media (min-width: 768px) {
    .game-container {
        max-width: 600px;
        margin: 0 auto;
    }
}

/* 桌面设备 */
@media (min-width: 1024px) {
    .game-container {
        max-width: 800px;
    }
}
```

#### 颜色方案
```css
:root {
    --primary-color: #6366f1;     /* 主色调 */
    --success-color: #10b981;     /* 成功提示 */
    --warning-color: #f59e0b;     /* 警告提示 */
    --error-color: #ef4444;       /* 错误提示 */
    --background-color: #f9fafb;  /* 背景色 */
    --text-color: #1f2937;        /* 文字颜色 */
}
```

### 3. 交互设计

#### 用户操作流程
1. 页面加载 → 自动聚焦输入框
2. 输入数字 → 实时验证
3. 提交猜测 → 显示反馈
4. 猜中数字 → 显示祝贺信息
5. 点击重新开始 → 重置游戏

#### 键盘快捷键
- `Enter`: 提交猜测
- `Escape`: 清空输入
- `Space`: 重新开始游戏

## 性能优化

### 1. 前端性能

#### 资源优化
- 最小化CSS和JavaScript
- 图片懒加载（如果使用图片）
- 字体优化

#### 渲染优化
- 使用CSS动画替代JS动画
- 避免强制同步布局
- 使用事件委托

### 2. 代码优化

#### 算法优化
- 避免不必要的计算
- 使用缓存
- 优化循环

#### 内存管理
- 及时清理事件监听器
- 避免内存泄漏
- 优化DOM操作

## 安全设计

### 1. 输入安全

#### XSS防护
```javascript
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
```

#### 输入验证
- 前端验证
- 后端验证（如果需要）
- 数据类型检查

### 2. 数据安全

#### 隐私保护
- 不收集用户数据
- 不使用Cookie跟踪
- 本地数据加密（可选）

#### 数据验证
```javascript
function validateGameData(data) {
    // 验证数据结构
    if (!data || typeof data !== 'object') return false;

    // 验证数据类型
    if (typeof data.targetNumber !== 'number') return false;

    // 验证数据范围
    if (data.targetNumber < 1 || data.targetNumber > 100) return false;

    return true;
}
```

## 测试策略

### 1. 单元测试

#### 测试范围
- 随机数生成函数
- 输入验证函数
- 数字比较函数

#### 测试示例
```javascript
describe('InputValidator', () => {
    test('should reject empty input', () => {
        const result = validateInput('');
        expect(result.valid).toBe(false);
    });

    test('should accept valid number', () => {
        const result = validateInput('50');
        expect(result.valid).toBe(true);
        expect(result.value).toBe(50);
    });
});
```

### 2. 集成测试

#### 测试范围
- 游戏流程
- 模块间交互
- 状态管理

#### 测试示例
```javascript
describe('Game Flow', () => {
    test('should complete game successfully', () => {
        const game = new GameController();
        game.startNewGame();

        // 模拟猜测过程
        let result = game.makeGuess(50);
        while (result.status !== 'CORRECT') {
            result = game.makeGuess(getNextGuess(result));
        }

        expect(game.getState().status).toBe('COMPLETED');
    });
});
```

### 3. E2E测试

#### 测试场景
- 完整游戏流程
- 边界条件测试
- 用户体验测试

#### 测试示例
```javascript
test('complete game flow', async ({ page }) => {
    await page.goto('/');

    // 输入猜测
    await page.fill('#guessInput', '50');
    await page.click('#submitBtn');

    // 验证反馈
    await expect(page.locator('#messageBox')).toBeVisible();

    // 继续游戏直到猜中
    // ...

    // 验证游戏结束
    await expect(page.locator('.game-over')).toBeVisible();
});
```

## 部署设计

### 1. 构建流程

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 测试
npm run test
```

### 2. 部署选项

#### GitHub Pages
- 免费托管
- 自动部署
- HTTPS支持

#### Netlify
- 全球CDN
- 自动构建
- 表单处理

#### Vercel
- 边缘计算
- 自动扩展
- 分析功能

### 3. 监控与日志

#### 错误监控
```javascript
window.onerror = function(message, source, lineno, colno, error) {
    // 记录错误
    console.error('Error:', message);

    // 发送到监控服务（可选）
    // sendToMonitoring({ message, source, lineno, colno });
};
```

#### 用户行为分析
- 游戏完成率
- 平均猜测次数
- 用户停留时间

## 维护计划

### 1. 代码维护

#### 代码质量
- 定期代码审查
- 单元测试覆盖
- 性能监控

#### 文档更新
- API文档
- 用户手册
- 开发文档

### 2. 功能迭代

#### 短期计划
- 难度级别选择
- 排行榜功能
- 多语言支持

#### 长期计划
- 多人对战模式
- 自定义范围
- 主题切换

### 3. 技术债务

#### 已知问题
- 性能优化空间
- 代码重构需求
- 测试覆盖率提升

#### 改进计划
- 模块化重构
- 性能优化
- 测试完善

## 扩展性设计

### 1. 插件系统

```javascript
class GamePlugin {
    constructor(game) {
        this.game = game;
    }

    onLoad() {}
    onGuess(guess) {}
    onGameEnd(stats) {}
    onUnload() {}
}
```

### 2. 配置系统

```javascript
const gameConfig = {
    minNumber: 1,
    maxNumber: 100,
    maxAttempts: null,
    timeLimit: null,
    difficulty: 'normal',
    theme: 'default'
};
```

### 3. API接口（未来扩展）

```javascript
// 未来可能的服务器API
GET /api/game/new
POST /api/game/guess
GET /api/game/stats
POST /api/game/reset
```

## 附录

### 技术决策记录

#### 为什么选择纯JavaScript？
- 无需构建工具
- 加载速度快
- 易于维护
- 兼容性好

#### 为什么选择Playwright？
- 跨浏览器支持
- 现代化API
- 良好的文档
- 活跃的社区

### 参考资源
- JavaScript最佳实践
- Web性能优化指南
- 游戏设计原则
- 用户体验研究

### 变更历史
- v1.0.0 (2025-01-14): 初始技术设计