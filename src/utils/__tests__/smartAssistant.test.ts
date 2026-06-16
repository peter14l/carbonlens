import { describe, it, expect } from 'vitest';
import { generateSmartSuggestions } from '../smartAssistant';
import type { Activity } from '../../types';

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'test-1',
    type: 'car_trip',
    category: 'transport',
    label: 'Car Trip',
    quantity: 10,
    unit: 'km',
    carbonKg: 2.1,
    date: new Date().toISOString().split('T')[0],
    ...overrides,
  };
}

describe('generateSmartSuggestions', () => {
  it('returns empty for no activities', () => {
    const result = generateSmartSuggestions([]);
    expect(result).toEqual([]);
  });

  it('returns daily nudge when not logged today', () => {
    const oldActivity = makeActivity({ date: '2020-01-01' });
    const result = generateSmartSuggestions([oldActivity]);
    const nudge = result.find(s => s.id === 'daily-nudge');
    expect(nudge).toBeDefined();
    expect(nudge?.type).toBe('nudge');
  });

  it('returns streak congrats at 3 days', () => {
    const today = new Date();
    const activities: Activity[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      activities.push(makeActivity({ date: d.toISOString().split('T')[0], id: `a-${i}` }));
    }
    const result = generateSmartSuggestions(activities);
    const streak = result.find(s => s.id === 'streak-3');
    expect(streak).toBeDefined();
  });

  it('returns streak nudge at 6 days', () => {
    const today = new Date();
    const activities: Activity[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      activities.push(makeActivity({ date: d.toISOString().split('T')[0], id: `a-${i}` }));
    }
    const result = generateSmartSuggestions(activities);
    const nudge = result.find(s => s.id === 'streak-6');
    expect(nudge).toBeDefined();
  });

  it('returns category-specific tip when there is a top category', () => {
    const today = new Date().toISOString().split('T')[0];
    const activities = Array.from({ length: 10 }, (_, i) =>
      makeActivity({ id: `a-${i}`, category: 'food', type: 'meat_meal', carbonKg: 7.2, date: today })
    );
    const result = generateSmartSuggestions(activities);
    const catTip = result.find(s => s.id === 'cat-food');
    expect(catTip).toBeDefined();
  });

  it('returns at most 5 suggestions', () => {
    const today = new Date().toISOString().split('T')[0];
    const activities = Array.from({ length: 20 }, (_, i) =>
      makeActivity({ id: `a-${i}`, date: today })
    );
    const result = generateSmartSuggestions(activities);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('suggestions are sorted by priority descending', () => {
    const today = new Date().toISOString().split('T')[0];
    const activities = Array.from({ length: 10 }, (_, i) =>
      makeActivity({ id: `a-${i}`, date: today })
    );
    const result = generateSmartSuggestions(activities);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].priority).toBeLessThanOrEqual(result[i - 1].priority);
    }
  });
});
