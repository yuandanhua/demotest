import { generateTargetNumber, checkGuess } from '../src/index';

describe('猜数字游戏', () => {
  describe('generateTargetNumber', () => {
    it('应该在指定范围内生成数字', () => {
      const result = generateTargetNumber(1, 100);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('应该生成整数', () => {
      const result = generateTargetNumber(1, 10);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('checkGuess', () => {
    it('应该返回 correct 当猜对时', () => {
      expect(checkGuess(50, 50)).toBe('correct');
    });

    it('应该返回 too-low 当猜的数字太小时', () => {
      expect(checkGuess(30, 50)).toBe('too-low');
    });

    it('应该返回 too-high 当猜的数字太大时', () => {
      expect(checkGuess(70, 50)).toBe('too-high');
    });
  });
});
