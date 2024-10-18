import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  { a: 5, b: 2, action: Action.Subtract, expected: 3 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 5, action: Action.Subtract, expected: -2 },

  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 0, b: 5, action: Action.Multiply, expected: 0 },
  { a: -1, b: -1, action: Action.Multiply, expected: 1 },

  { a: 6, b: 3, action: Action.Divide, expected: 2 },
  { a: 5, b: 0, action: Action.Divide, expected: Infinity },
  { a: -6, b: -3, action: Action.Divide, expected: 2 },

  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: -2, b: 3, action: Action.Exponentiate, expected: -8 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'calculates $action of $a and $b to be $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test('should return null for invalid input', () => {
    expect(
      simpleCalculator({ a: 'string', b: 'string', action: Action.Add }),
    ).toBe(null);
    expect(simpleCalculator({ a: null, b: undefined, action: '+' })).toBe(null);
    expect(simpleCalculator({ a: {}, b: [], action: '-' })).toBe(null);
    expect(simpleCalculator({ a: 1, b: 'a', action: Action.Multiply })).toBe(
      null,
    );
    expect(simpleCalculator({ a: NaN, b: NaN, action: Action.Divide })).toBe(
      NaN,
    );
  });
});
