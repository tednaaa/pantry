import { formatAmount, formatPieces, isUnit } from './units';

describe('formatAmount', () => {
  it('should scale grams to kilograms from a thousand up', () => {
    expect(formatAmount(999, 'г')).toBe('999 г');
    expect(formatAmount(1000, 'г')).toBe('1 кг');
    expect(formatAmount(1500, 'г')).toBe('1.5 кг');
  });

  it('should scale millilitres to litres', () => {
    expect(formatAmount(2500, 'мл')).toBe('2.5 л');
  });

  it('should leave countable units alone however large', () => {
    expect(formatAmount(1200, 'шт')).toBe('1200 шт');
    expect(formatAmount(4, 'зубчик')).toBe('4 зубчик');
  });

  it('should trim trailing zeros', () => {
    expect(formatAmount(1250, 'г')).toBe('1.25 кг');
    expect(formatAmount(2000, 'мл')).toBe('2 л');
  });
});

describe('formatPieces', () => {
  it('should mark a count with a multiplication sign', () => {
    expect(formatPieces(3)).toBe('3×');
  });
});

describe('isUnit', () => {
  it('should accept the known units and reject anything else', () => {
    expect(isUnit('г')).toBe(true);
    expect(isUnit('')).toBe(false);
    expect(isUnit('kg')).toBe(false);
  });
});
