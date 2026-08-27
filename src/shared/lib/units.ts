export const units = ['г', 'мл', 'шт', 'пучок', 'зубчик'] as const;

export type Unit = typeof units[number];

const SCALE_STEP = 1000;

const scaledUnits: Partial<Record<Unit, string>> = {
  г: 'кг',
  мл: 'л',
};

export function isUnit(value: unknown): value is Unit {
  return units.includes(value as Unit);
}

function trim(value: number): string {
  return String(Number(value.toFixed(2)));
}

export function formatAmount(amount: number, unit: Unit): string {
  const scaled = scaledUnits[unit];

  if (scaled && amount >= SCALE_STEP) {
    return `${trim(amount / SCALE_STEP)} ${scaled}`;
  }

  return `${trim(amount)} ${unit}`;
}

export function formatPieces(count: number): string {
  return `${count}×`;
}
