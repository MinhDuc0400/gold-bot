import { parsePrice } from '../../utils/parser';

describe('parsePrice', () => {
  test('parses clean number', () => {
    expect(parsePrice('155000000')).toBe(155_000_000);
  });

  test('strips dots and spaces', () => {
    expect(parsePrice('155.000.000')).toBe(155_000_000);
    expect(parsePrice('155 000 000')).toBe(155_000_000);
  });

  test('returns null for empty string', () => {
    expect(parsePrice('')).toBeNull();
  });

  test('returns null for non-numeric input', () => {
    expect(parsePrice('N/A')).toBeNull();
  });
});
