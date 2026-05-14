/**
 * E2E 测试运行器
 * 执行所有端到端测试并生成报告
 */

const { runTests } = require('./game.spec');

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     猜数字游戏 - E2E 测试套件                 ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  const startTime = Date.now();
  const success = await runTests();
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n测试完成，耗时: ${duration}s`);

  if (success) {
    console.log('\n✅ 所有测试通过！');
    return 0;
  } else {
    console.log('\n❌ 有测试失败，请检查输出');
    return 1;
  }
}

main().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('致命错误:', error);
  process.exit(1);
});
