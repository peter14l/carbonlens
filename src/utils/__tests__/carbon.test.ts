import { describe, it, expect } from 'vitest';
import {
  calculateCarbon,
  formatCarbon,
  getTreeEquivalents,
  getCarKmEquivalent,
  getTotalFootprint,
  getTodayFootprint,
  getCategoryBreakdown,
  getCarbonRating,
} from '../carbon';
import type { Activity } from '../../types';

describe('calculateCarbon', () => {
  it('calculates car trip emissions correctly', () => {
    const result = calculateCarbon('car_trip', 10);
    expect(result).toBe(2.1); // 10 * 0.21
  });

  it('calculates bus trip emissions correctly', () => {
    const result = calculateCarbon('bus_trip', 8);
    expect(result).toBeCloseTo(0.712, 2); // 8 * 0.089
  });

  it('returns 0 for bike ride', () => {
    const result = calculateCarbon('bike_ride', 5);
    expect(result).toBe(0);
  });

  it('returns 0 for walking', () => {
    const result = calculateCarbon('walk', 2);
    expect(result).toBe(0);
  });

  it('calculates meat meal emissions', () => {
    const result = calculateCarbon('meat_meal', 1);
    expect(result).toBe(7.2);
  });

  it('calculates recycling as negative (carbon saved)', () => {
    const result = calculateCarbon('recycling', 2);
    expect(result).toBe(-5);
  });

  it('returns 0 for unknown type', () => {
    const result = calculateCarbon('unknown_type' as any, 10);
    expect(result).toBe(0);
  });
});

describe('formatCarbon', () => {
  it('formats grams for values under 1 kg', () => {
    expect(formatCarbon(0.5)).toBe('500 g');
  });

  it('formats kilograms for values >= 1 kg', () => {
    expect(formatCarbon(2.5)).toBe('2.5 kg');
  });

  it('formats negative values with minus sign', () => {
    expect(formatCarbon(-3.2)).toBe('-3.2 kg');
  });

  it('formats zero as grams', () => {
    expect(formatCarbon(0)).toBe('0 g');
  });
});

describe('getTreeEquivalents', () => {
  it('calculates tree equivalents correctly', () => {
    const result = getTreeEquivalents(22); // 1 tree absorbs ~22 kg/year
    expect(result).toBe(1);
  });

  it('returns fractional for less than one tree', () => {
    const result = getTreeEquivalents(11);
    expect(result).toBe(0.5);
  });
});

describe('getCarKmEquivalent', () => {
  it('calculates car km equivalent correctly', () => {
    const result = getCarKmEquivalent(2.1); // 2.1 / 0.21 = 10
    expect(result).toBe(10);
  });
});

describe('getTotalFootprint', () => {
  it('sums all activity carbon values', () => {
    const activities = [
      { carbonKg: 2.1 } as Activity,
      { carbonKg: 0.5 } as Activity,
      { carbonKg: 7.2 } as Activity,
    ];
    expect(getTotalFootprint(activities)).toBe(9.8);
  });

  it('returns 0 for empty array', () => {
    expect(getTotalFootprint([])).toBe(0);
  });
});

describe('getTodayFootprint', () => {
  it('sums only today activities', () => {
    const today = new Date().toISOString().split('T')[0];
    const activities = [
      { carbonKg: 2.1, date: today } as Activity,
      { carbonKg: 0.5, date: '2020-01-01' } as Activity,
    ];
    expect(getTodayFootprint(activities)).toBe(2.1);
  });
});

describe('getCategoryBreakdown', () => {
  it('breaks down carbon by category', () => {
    const activities = [
      { carbonKg: 2.1, category: 'transport' } as Activity,
      { carbonKg: 0.5, category: 'energy' } as Activity,
      { carbonKg: 7.2, category: 'food' } as Activity,
    ];
    const result = getCategoryBreakdown(activities);
    expect(result.transport).toBe(2.1);
    expect(result.energy).toBe(0.5);
    expect(result.food).toBe(7.2);
    expect(result.shopping).toBe(0);
    expect(result.waste).toBe(0);
    expect(result.digital).toBe(0);
  });
});

describe('getCarbonRating', () => {
  it('returns Excellent for low emissions', () => {
    const result = getCarbonRating(10);
    expect(result.label).toBe('Excellent');
  });

  it('returns Good for moderate emissions', () => {
    const result = getCarbonRating(20);
    expect(result.label).toBe('Good');
  });

  it('returns Average for typical emissions', () => {
    const result = getCarbonRating(35);
    expect(result.label).toBe('Average');
  });

  it('returns High for very high emissions', () => {
    const result = getCarbonRating(80);
    expect(result.label).toBe('High');
  });
});
