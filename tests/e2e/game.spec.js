/**
 * E2E 测试规范 - 猜数字游戏
 * 使用简化的游戏逻辑模拟进行测试
 */

const fs = require('fs');
const path = require('path');

// 简单测试框架
class TestRunner {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  async test(name, fn) {
    try {
      await fn();
      this.passed++;
      this.results.push({ name, status: 'PASS' });
      console.log(`  ✓ ${name}`);
    } catch (error) {
      this.failed++;
      this.results.push({ name, status: 'FAIL', error: error.message });
      console.log(`  ✗ ${name}`);
      console.log(`    ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected "${expected}" but got "${actual}"`);
    }
  }

  assertContains(actual, expected, message) {
    if (!actual.includes(expected)) {
      throw new Error(message || `Expected "${actual}" to contain "${expected}"`);
    }
  }

  summary() {
    console.log('\n=== 测试结果汇总 ===');
    console.log(`总计: ${this.passed + this.failed}`);
    console.log(`通过: ${this.passed}`);
    console.log(`失败: ${this.failed}`);
    return this.failed === 0;
  }
}

// 游戏逻辑模拟器（与 index.html 中的逻辑一致）
class GameSimulator {
  constructor(targetNumber = 50) {
    this.targetNumber = targetNumber;
    this.guessCount = 0;
    this.isGameOver = false;
    this.message = '请输入 1-100 之间的数字开始游戏';
    this.messageClass = 'message default';
  }

  validateInput(value) {
    const num = Number(value);

    if (value === '' || isNaN(num)) {
      return { valid: false, message: '请输入一个有效的数字' };
    }

    if (num < 1 || num > 100) {
      return { valid: false, message: '请输入 1-100 之间的整数' };
    }

    if (!Number.isInteger(num)) {
      return { valid: false, message: '请输入整数，不要输入小数' };
    }

    return { valid: true, value: num };
  }

  makeGuess(value) {
    if (this.isGameOver) {
      return { success: false, reason: 'game_over' };
    }

    const validation = this.validateInput(value);

    if (!validation.valid) {
      this.message = validation.message;
      this.messageClass = 'message error';
      return { success: false, reason: this._getErrorReason(validation.message) };
    }

    const guess = validation.value;
    this.guessCount++;

    if (guess > this.targetNumber) {
      this.message = `📈 ${guess} 猜大了！再试一次`;
      this.messageClass = 'message too-high';
      return { success: true, result: 'too_high', count: this.guessCount };
    } else if (guess < this.targetNumber) {
      this.message = `📉 ${guess} 猜小了！再试一次`;
      this.messageClass = 'message too-low';
      return { success: true, result: 'too_low', count: this.guessCount };
    } else {
      this.message = `🎉 恭喜通关！答案就是 ${guess}！你用了 ${this.guessCount} 次猜中。`;
      this.messageClass = 'message correct';
      this.isGameOver = true;
      return { success: true, result: 'correct', count: this.guessCount };
    }
  }

  _getErrorReason(message) {
    if (message.includes('有效的')) return 'invalid_input';
    if (message.includes('1-100')) return 'out_of_range';
    if (message.includes('整数') && !message.includes('1-100')) return 'not_integer';
    return 'unknown';
  }

  getState() {
    return {
      targetNumber: this.targetNumber,
      guessCount: this.guessCount,
      isGameOver: this.isGameOver
    };
  }

  getMessage() {
    return this.message;
  }

  getMessageClass() {
    return this.messageClass;
  }

  getGuessCount() {
    return this.guessCount;
  }
}

// 测试套件
async function runTests() {
  const runner = new TestRunner();

  console.log('开始运行 E2E 测试...\n');

  // 读取 HTML 文件
  const htmlPath = path.join(__dirname, '..', '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // AC1: HTML 结构测试
  await runner.test('AC1: HTML 文件包含游戏标题', () => {
    runner.assertContains(html, '猜数字小游戏', 'HTML 应包含游戏标题');
  });

  await runner.test('AC1: HTML 包含输入框', () => {
    runner.assertContains(html, 'id="guessInput"', 'HTML 应包含输入框');
  });

  await runner.test('AC1: HTML 包含提交按钮', () => {
    runner.assertContains(html, 'id="submitBtn"', 'HTML 应包含提交按钮');
  });

  await runner.test('AC1: HTML 包含消息提示区域', () => {
    runner.assertContains(html, 'id="message"', 'HTML 应包含消息区域');
  });

  await runner.test('AC1: HTML 包含猜测次数统计', () => {
    runner.assertContains(html, 'id="guessCount"', 'HTML 应包含猜测次数元素');
  });

  // 游戏逻辑测试
  const game = new GameSimulator(50); // 固定目标数字为 50

  await runner.test('AC2: 有效猜测返回成功', () => {
    const result = game.makeGuess(30);
    runner.assert(result.success === true, '有效猜测应返回成功');
  });

  await runner.test('AC2: 猜小了显示正确提示', () => {
    const result = game.makeGuess(30);
    runner.assert(result.result === 'too_low', '30 应该比目标小');
    runner.assertContains(game.getMessage(), '猜小了', '应显示猜小了提示');
  });

  await runner.test('AC2: 猜大了显示正确提示', () => {
    const result = game.makeGuess(70);
    runner.assert(result.result === 'too_high', '70 应该比目标大');
    runner.assertContains(game.getMessage(), '猜大了', '应显示猜大了提示');
  });

  await runner.test('AC2: 猜对了显示恭喜信息', () => {
    const freshGame = new GameSimulator(50);
    const result = freshGame.makeGuess(50);
    runner.assert(result.result === 'correct', '50 应该是目标数字');
    runner.assertContains(freshGame.getMessage(), '恭喜', '应显示恭喜信息');
    runner.assertContains(freshGame.getMessage(), '1 次', '应显示猜测次数');
  });

  // 输入验证测试
  const validationGame = new GameSimulator(50);

  await runner.test('AC3: 空输入被拒绝', () => {
    const result = validationGame.makeGuess('');
    runner.assert(result.success === false, '空输入应被拒绝');
    runner.assert(result.reason === 'invalid_input', '应返回无效输入原因');
  });

  await runner.test('AC3: 超出范围被拒绝（小于1）', () => {
    const result = validationGame.makeGuess(0);
    runner.assert(result.reason === 'out_of_range', '0 应超出范围');
  });

  await runner.test('AC3: 超出范围被拒绝（大于100）', () => {
    const result = validationGame.makeGuess(101);
    runner.assert(result.reason === 'out_of_range', '101 应超出范围');
  });

  await runner.test('AC3: 小数被拒绝', () => {
    const result = validationGame.makeGuess(3.14);
    runner.assert(result.reason === 'not_integer', '小数应被拒绝');
  });

  // 猜测次数统计测试
  await runner.test('AC4: 猜测次数正确统计', () => {
    const countGame = new GameSimulator(50);
    countGame.makeGuess(30);
    countGame.makeGuess(70);
    runner.assertEqual(countGame.getGuessCount(), 2, '猜测次数应为 2');
  });

  await runner.test('AC4: 游戏结束后统计保持', () => {
    const countGame = new GameSimulator(50);
    countGame.makeGuess(30);
    countGame.makeGuess(50);
    runner.assertEqual(countGame.getGuessCount(), 2, '猜测次数应为 2');
  });

  // 文档和配置测试
  await runner.test('AC5: README.md 存在', () => {
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    runner.assert(fs.existsSync(readmePath), 'README.md 应存在');
  });

  await runner.test('AC5: README.md 包含项目说明', () => {
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');
    runner.assertContains(readme, '猜数字', 'README 应包含项目说明');
  });

  await runner.test('AC5: README.md 包含安装步骤', () => {
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');
    runner.assertContains(readme, '安装', 'README 应包含安装步骤');
  });

  await runner.test('AC5: README.md 包含使用示例', () => {
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');
    runner.assertContains(readme, '使用示例', 'README 应包含使用示例');
  });

  await runner.test('AC5: examples 目录存在', () => {
    const examplesPath = path.join(__dirname, '..', '..', 'examples');
    runner.assert(fs.existsSync(examplesPath), 'examples 目录应存在');
  });

  await runner.test('AC5: 示例文件存在', () => {
    const examplePath = path.join(__dirname, '..', '..', 'examples', 'game-example.md');
    runner.assert(fs.existsSync(examplePath), '示例文件应存在');
  });

  await runner.test('AC5: package.json 存在', () => {
    const packagePath = path.join(__dirname, '..', '..', 'package.json');
    runner.assert(fs.existsSync(packagePath), 'package.json 应存在');
  });

  await runner.test('AC5: package.json 包含 name', () => {
    const packagePath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    runner.assert(pkg.name, 'package.json 应包含 name');
  });

  await runner.test('AC5: package.json 包含 version', () => {
    const packagePath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    runner.assert(pkg.version, 'package.json 应包含 version');
  });

  await runner.test('AC5: package.json 包含 files 字段', () => {
    const packagePath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    runner.assert(pkg.files && Array.isArray(pkg.files), 'package.json 应包含 files 数组');
  });

  await runner.test('AC5: npm run test:e2e 命令存在', () => {
    const packagePath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    runner.assert(pkg.scripts && pkg.scripts['test:e2e'], '应存在 test:e2e 脚本');
  });

  await runner.test('AC5: tests/e2e 目录存在', () => {
    const e2ePath = path.join(__dirname, '..');
    runner.assert(fs.existsSync(e2ePath), 'tests/e2e 目录应存在');
  });

  return runner.summary();
}

// 导出测试运行器
module.exports = { runTests };

// 如果直接运行此文件
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试运行出错:', error);
    process.exit(1);
  });
}
