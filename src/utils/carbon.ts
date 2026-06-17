import type { Activity, Category, WeeklySnapshot, InsightsData } from '../types';
import { EMISSION_FACTORS, INSIGHT_TIPS, NATIONAL_AVERAGES } from '../data/emissions';
import { startOfWeek, endOfWeek, subWeeks, subDays, format, parseISO, differenceInWeeks } from 'date-fns';

export function calculateCarbon(type: Activity['type'], quantity: number): number {
  const factor = EMISSION_FACTORS[type];
  if (!factor) return 0;
  return Math.round(quantity * factor.factor * 1000) / 1000;
}

export function getTotalFootprint(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + a.carbonKg, 0);
}

export function getTodayFootprint(activities: Activity[]): number {
  const today = format(new Date(), 'yyyy-MM-dd');
  return activities
    .filter(a => a.date === today)
    .reduce((sum, a) => sum + a.carbonKg, 0);
}

export function getWeekFootprint(activities: Activity[]): number {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return activities
    .filter(a => {
      const d = parseISO(a.date);
      return d >= weekStart && d <= weekEnd;
    })
    .reduce((sum, a) => sum + a.carbonKg, 0);
}

export function getCategoryBreakdown(activities: Activity[]): Record<Category, number> {
  const breakdown: Record<Category, number> = {
    transport: 0,
    energy: 0,
    food: 0,
    shopping: 0,
    waste: 0,
    digital: 0,
  };
  activities.forEach(a => {
    breakdown[a.category] += a.carbonKg;
  });
  return breakdown;
}

export function getWeeklySnapshots(activities: Activity[], weeks: number = 12): WeeklySnapshot[] {
  const snapshots: WeeklySnapshot[] = [];
  const now = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekDate = subWeeks(now, i);
    const wStart = startOfWeek(weekDate, { weekStartsOn: 1 });
    const wEnd = endOfWeek(weekDate, { weekStartsOn: 1 });
    const weekActivities = activities.filter(a => {
      const d = parseISO(a.date);
      return d >= wStart && d <= wEnd;
    });

    snapshots.push({
      weekStart: format(wStart, 'yyyy-MM-dd'),
      totalCarbonKg: getTotalFootprint(weekActivities),
      breakdown: getCategoryBreakdown(weekActivities),
    });
  }

  return snapshots;
}

export function getDailyFootprint(activities: Activity[], days: number = 30): { date: string; total: number }[] {
  const result: { date: string; total: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayTotal = activities
      .filter(a => a.date === dateStr)
      .reduce((sum, a) => sum + a.carbonKg, 0);
    result.push({ date: dateStr, total: Math.round(dayTotal * 100) / 100 });
  }

  return result;
}

export function generateInsights(activities: Activity[], location: string = ''): InsightsData {
  const currentWeek = getWeekFootprint(activities);
  const previousWeekActivities = activities.filter(a => {
    const d = parseISO(a.date);
    const now = new Date();
    const weekAgo = subWeeks(now, 1);
    return d >= startOfWeek(weekAgo, { weekStartsOn: 1 }) && d <= endOfWeek(weekAgo, { weekStartsOn: 1 });
  });
  const previousWeek = getTotalFootprint(previousWeekActivities);

  const breakdown = getCategoryBreakdown(activities);
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0) || 1;

  const topCategories = (Object.entries(breakdown) as [Category, number][])
    .map(([category, value]) => ({
      category,
      percentage: Math.round((value / total) * 100),
      trend: value > 0 ? (previousWeek > 0 && value > previousWeek * 0.5 ? 'up' as const : 'stable' as const) : 'down' as const,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const relevantTips = INSIGHT_TIPS
    .filter(t => topCategories.some(c => c.category === t.category))
    .map(t => t.tip)
    .slice(0, 5);

  const weeklyTrend: InsightsData['weeklyTrend'] =
    currentWeek < previousWeek * 0.9 ? 'improving' :
    currentWeek > previousWeek * 1.1 ? 'worsening' : 'stable';

  // Extract national average daily based on profile location, fallback to Global Average
  const normalizedLocation = location.toLowerCase();
  let nationalAvgDaily = NATIONAL_AVERAGES['Global Average'];
  for (const [country, average] of Object.entries(NATIONAL_AVERAGES)) {
    if (normalizedLocation.includes(country.toLowerCase())) {
      nationalAvgDaily = average;
      break;
    }
  }

  return {
    tips: relevantTips,
    comparison: {
      yourFootprint: Math.round(currentWeek * 10) / 10,
      nationalAverage: nationalAvgDaily * (currentWeek > 0 ? 7 : 0),
      globalAverage: NATIONAL_AVERAGES['Global Average'] * 7,
      targetSustainable: NATIONAL_AVERAGES['Sustainable Target'] * 7,
    },
    topCategories,
    weeklyTrend,
  };
}

export function calculateStreak(activities: Activity[]): { current: number; longest: number } {
  if (activities.length === 0) return { current: 0, longest: 0 };

  const uniqueDates = [...new Set(activities.map(a => a.date))].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const allDates = [...new Set(activities.map(a => a.date))].sort();

  if (allDates.length === 0) return { current: 0, longest: 0 };

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = parseISO(allDates[i - 1]);
      const curr = parseISO(allDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak from today/yesterday backwards
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = parseISO(uniqueDates[i - 1]);
      const curr = parseISO(uniqueDates[i]);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

export function formatCarbon(kg: number): string {
  if (kg < 0) return `-${Math.abs(kg).toFixed(1)} kg`;
  if (kg < 1) return `${(kg * 1000).toFixed(0)} g`;
  return `${kg.toFixed(1)} kg`;
}

export function getCarbonRating(kgPerWeek: number): { label: string; color: string; emoji: string } {
  if (kgPerWeek <= 14) return { label: 'Excellent', color: 'text-emerald-600', emoji: '🌟' };
  if (kgPerWeek <= 28) return { label: 'Good', color: 'text-green-600', emoji: '✅' };
  if (kgPerWeek <= 42) return { label: 'Average', color: 'text-yellow-600', emoji: '⚠️' };
  if (kgPerWeek <= 70) return { label: 'Above Average', color: 'text-orange-600', emoji: '🔶' };
  return { label: 'High', color: 'text-red-600', emoji: '🔴' };
}

export function getTreeEquivalents(kg: number): number {
  const TREE_ABSORPTION_KG_PER_YEAR = 22;
  return Math.round((kg / TREE_ABSORPTION_KG_PER_YEAR) * 100) / 100;
}

export function getCarKmEquivalent(kg: number): number {
  const CAR_KG_PER_KM = 0.21;
  return Math.round(kg / CAR_KG_PER_KM);
}
