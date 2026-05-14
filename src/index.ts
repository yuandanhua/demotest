/**
 * 猜数字游戏核心逻辑
 */

export function generateTargetNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkGuess(guess: number, target: number): string {
  if (guess === target) {
    return 'correct';
  } else if (guess < target) {
    return 'too-low';
  } else {
    return 'too-high';
  }
}
