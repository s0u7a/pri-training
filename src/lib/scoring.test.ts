import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePSI,
  judgeSymbolMatch,
  gradeCodingAnswer,
  calculateAccuracy,
  calculateRatePerMinute,
  shuffleArray,
} from './scoring.ts';

describe('calculatePSI', () => {
  it('returns 0 when elapsed is under 10s (unmeasurable)', () => {
    assert.equal(calculatePSI(50, 0, 9, 'symbol-match'), 0);
    assert.equal(calculatePSI(50, 0, 0, 'coding'), 0);
  });

  it('returns 100 at the mean rate (symbol-match: 45/min)', () => {
    assert.equal(calculatePSI(45, 0, 60, 'symbol-match'), 100);
  });

  it('returns 100 at the mean rate (coding: 30/min)', () => {
    assert.equal(calculatePSI(30, 0, 60, 'coding'), 100);
  });

  it('adds 15 PSI per +1 SD (symbol-match: 57/min -> 115)', () => {
    assert.equal(calculatePSI(57, 0, 60, 'symbol-match'), 115);
  });

  it('subtracts 15 PSI per -1 SD (symbol-match: 33/min -> 85)', () => {
    assert.equal(calculatePSI(33, 0, 60, 'symbol-match'), 85);
  });

  it('adds 15 PSI per +1 SD (coding: 38/min -> 115)', () => {
    assert.equal(calculatePSI(38, 0, 60, 'coding'), 115);
  });

  it('subtracts mistakes from raw score before rating', () => {
    // raw = 45 - 9 = 36 -> rate 36 -> (36-45)/12*15 = -11.25 -> 89
    assert.equal(calculatePSI(45, 9, 60, 'symbol-match'), 89);
  });

  it('clamps runaway scores to 160', () => {
    assert.equal(calculatePSI(200, 0, 60, 'symbol-match'), 160);
    assert.equal(calculatePSI(200, 0, 60, 'coding'), 160);
  });

  it('never drops below 40', () => {
    assert.ok(calculatePSI(0, 99, 60, 'symbol-match') >= 40);
    assert.ok(calculatePSI(0, 99, 60, 'coding') >= 40);
  });

  it('treats null gameType with coding norms', () => {
    assert.equal(calculatePSI(30, 0, 60, null), 100);
  });
});

describe('judgeSymbolMatch', () => {
  it('marks matching answers correct', () => {
    assert.equal(judgeSymbolMatch(true, true), 'correct');
    assert.equal(judgeSymbolMatch(false, false), 'correct');
  });

  it('marks mismatching answers incorrect', () => {
    assert.equal(judgeSymbolMatch(true, false), 'incorrect');
    assert.equal(judgeSymbolMatch(false, true), 'incorrect');
  });
});

describe('gradeCodingAnswer', () => {
  it('marks the current number correct', () => {
    assert.equal(gradeCodingAnswer(3, 3), 'correct');
  });

  it('marks other numbers incorrect', () => {
    assert.equal(gradeCodingAnswer(2, 3), 'incorrect');
  });
});

describe('calculateAccuracy', () => {
  it('computes rounded percent', () => {
    assert.equal(calculateAccuracy(8, 2), 80);
    assert.equal(calculateAccuracy(1, 2), 33);
  });

  it('returns 0 with no attempts', () => {
    assert.equal(calculateAccuracy(0, 0), 0);
  });
});

describe('calculateRatePerMinute', () => {
  it('computes score per minute', () => {
    assert.equal(calculateRatePerMinute(30, 60), 30);
    assert.equal(calculateRatePerMinute(45, 60), 45);
  });

  it('returns 0 for zero elapsed', () => {
    assert.equal(calculateRatePerMinute(10, 0), 0);
  });
});

describe('shuffleArray', () => {
  it('preserves all elements', () => {
    const input = [1, 2, 3, 4, 5];
    assert.deepEqual([...shuffleArray(input)].sort((a, b) => a - b), input);
  });

  it('returns a new array without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffleArray(input);
    assert.notEqual(out, input);
    assert.deepEqual(input, [1, 2, 3, 4, 5]);
  });
});
