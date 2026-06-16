import { describe, it, expect } from 'vitest';
import { getWeekStart, isCurrentWeek } from '../date';

describe('getWeekStart', () => {
  it('returns a Monday', () => {
    const result = getWeekStart();
    expect(result.getDay()).toBe(1); // Monday
  });

  it('returns correct week start for a known date', () => {
    // Thursday June 18, 2026 -> Monday June 15, 2026
    const thursday = new Date(2026, 5, 18);
    const result = getWeekStart(thursday);
    expect(result.getDate()).toBe(15);
    expect(result.getDay()).toBe(1);
  });

  it('returns same day if already Monday', () => {
    const monday = new Date(2026, 5, 15); // Monday June 15
    const result = getWeekStart(monday);
    expect(result.getDate()).toBe(15);
  });
});

describe('isCurrentWeek', () => {
  it('returns true for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isCurrentWeek(today)).toBe(true);
  });

  it('returns false for a very old date', () => {
    expect(isCurrentWeek('2020-01-01')).toBe(false);
  });
});
