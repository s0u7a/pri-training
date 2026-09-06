export type GameType = 'symbol-match' | 'coding' | null;

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const calculatePSI = (
  score: number,
  mistakes: number,
  elapsedSeconds: number,
  gameType: GameType,
) => {
  if (elapsedSeconds < 10) return 0;
  const rawScore = Math.max(0, score - mistakes * 1.0);
  const ratePerMinute = (rawScore / elapsedSeconds) * 60;
  const mean = gameType === 'symbol-match' ? 45 : 30;
  const sd = gameType === 'symbol-match' ? 12 : 8;
  const psi = 100 + ((ratePerMinute - mean) / sd) * 15;
  return Math.max(40, Math.min(160, Math.round(psi)));
};

export function judgeSymbolMatch(
  userSaysMatch: boolean,
  isMatch: boolean,
): 'correct' | 'incorrect' {
  return userSaysMatch === isMatch ? 'correct' : 'incorrect';
}

export function gradeCodingAnswer(
  answered: number,
  currentNumber: number,
): 'correct' | 'incorrect' {
  return answered === currentNumber ? 'correct' : 'incorrect';
}

export function calculateAccuracy(score: number, mistakes: number): number {
  const total = score + mistakes;
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

export function calculateRatePerMinute(score: number, elapsed: number): number {
  return elapsed > 0 ? Math.round((score / elapsed) * 60 * 10) / 10 : 0;
}
