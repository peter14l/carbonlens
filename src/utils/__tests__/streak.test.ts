import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../carbon';
import type { Activity } from '../../types';

describe('calculateStreak', () => {
  it('returns 0 for empty activities', () => {
    const result = calculateStreak([]);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
  });

  it('calculates single day streak', () => {
    const today = new Date().toISOString().split('T')[0];
    const activities = [{ date: today } as Activity];
    const result = calculateStreak(activities);
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it('calculates multi-day consecutive streak', () => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    const activities = dates.map((date) => ({ date }) as Activity);
    const result = calculateStreak(activities);
    expect(result.current).toBe(5);
    expect(result.longest).toBe(5);
  });

  it('detects broken streak', () => {
    const today = new Date();
    const dates: string[] = [];
    // 3 consecutive days
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    // Add an old date (gap)
    const old = new Date(today);
    old.setDate(old.getDate() - 10);
    dates.push(old.toISOString().split('T')[0]);

    const activities = dates.map((date) => ({ date }) as Activity);
    const result = calculateStreak(activities);
    expect(result.longest).toBe(3);
  });
});
