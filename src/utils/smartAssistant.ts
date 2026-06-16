import type { Activity, Category, ActivityType } from '../types';
import { EMISSION_FACTORS, CATEGORY_INFO } from '../data/emissions';
import { format, subDays, parseISO, isToday, isYesterday } from 'date-fns';

export interface SmartSuggestion {
  id: string;
  type: 'tip' | 'nudge' | 'insight' | 'challenge' | 'congrats';
  title: string;
  message: string;
  action?: string;
  actionPath?: string;
  priority: number;
  icon: string;
}

function getDayOfWeek(): string {
  return format(new Date(), 'EEEE').toLowerCase();
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

function getRecentActivities(activities: Activity[], days: number): Activity[] {
  const cutoff = subDays(new Date(), days);
  return activities.filter(a => parseISO(a.date) >= cutoff);
}

function getCategoryAverage(activities: Activity[], category: Category, days: number): number {
  const recent = getRecentActivities(activities, days);
  const catActivities = recent.filter(a => a.category === category);
  if (catActivities.length === 0) return 0;
  const total = catActivities.reduce((s, a) => s + a.carbonKg, 0);
  return total / days;
}

function getTopCategory(activities: Activity[]): { category: Category; total: number } | null {
  const recent = getRecentActivities(activities, 14);
  if (recent.length === 0) return null;

  const breakdown: Record<Category, number> = { transport: 0, energy: 0, food: 0, shopping: 0, waste: 0, digital: 0 };
  recent.forEach(a => { breakdown[a.category] += a.carbonKg; });

  let top: Category = 'transport';
  let max = 0;
  (Object.entries(breakdown) as [Category, number][]).forEach(([cat, val]) => {
    if (val > max) { max = val; top = cat; }
  });

  return { category: top, total: max };
}

function getStreakContext(activities: Activity[]): { current: number; loggedToday: boolean } {
  const uniqueDates = [...new Set(activities.map(a => a.date))].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');

  let streak = 0;
  if (uniqueDates[0] === today || uniqueDates[0] === format(subDays(new Date(), 0), 'yyyy-MM-dd')) {
    streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = parseISO(uniqueDates[i - 1]);
      const curr = parseISO(uniqueDates[i]);
      const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) streak++;
      else break;
    }
  }

  return { current: streak, loggedToday: uniqueDates[0] === today };
}

function getWeeklyFootprint(activities: Activity[]): number {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  weekStart.setHours(0, 0, 0, 0);
  return activities
    .filter(a => parseISO(a.date) >= weekStart)
    .reduce((s, a) => s + a.carbonKg, 0);
}

function getPreviousWeekFootprint(activities: Activity[]): number {
  const now = new Date();
  const prevWeekEnd = new Date(now);
  prevWeekEnd.setDate(now.getDate() - now.getDay() - 1);
  prevWeekEnd.setHours(23, 59, 59, 999);
  const prevWeekStart = new Date(prevWeekEnd);
  prevWeekStart.setDate(prevWeekEnd.getDate() - 6);
  prevWeekStart.setHours(0, 0, 0, 0);
  return activities
    .filter(a => { const d = parseISO(a.date); return d >= prevWeekStart && d <= prevWeekEnd; })
    .reduce((s, a) => s + a.carbonKg, 0);
}

function getRepeatedActivity(activities: Activity[]): ActivityType | null {
  const recent = getRecentActivities(activities, 7);
  if (recent.length < 3) return null;

  const counts: Record<string, number> = {};
  recent.forEach(a => { counts[a.type] = (counts[a.type] || 0) + 1; });

  let maxType = '';
  let maxCount = 0;
  Object.entries(counts).forEach(([type, count]) => {
    if (count > maxCount) { maxCount = count; maxType = type; }
  });

  return maxCount >= 4 ? (maxType as ActivityType) : null;
}

export function generateSmartSuggestions(activities: Activity[]): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const topCat = getTopCategory(activities);
  const streak = getStreakContext(activities);
  const weekTotal = getWeeklyFootprint(activities);
  const prevWeekTotal = getPreviousWeekFootprint(activities);
  const repeated = getRepeatedActivity(activities);

  // Congratulate on streak milestones
  if (streak.current === 3) {
    suggestions.push({
      id: 'streak-3',
      type: 'congrats',
      title: '3-Day Streak!',
      message: "You're building a great habit. Keep logging to unlock the Week Warrior badge at 7 days.",
      priority: 10,
      icon: '🔥',
    });
  }
  if (streak.current === 6) {
    suggestions.push({
      id: 'streak-6',
      type: 'nudge',
      title: 'One More Day!',
      message: "Just 1 day away from your Week Warrior badge. Don't break the chain!",
      priority: 10,
      icon: '🏆',
    });
  }

  // Daily nudge if not logged today
  if (!streak.loggedToday && activities.length > 0) {
    suggestions.push({
      id: 'daily-nudge',
      type: 'nudge',
      title: "Haven't Logged Today",
      message: `Your streak is ${streak.current} days. Log today's activities to keep it going.`,
      action: 'Log Now',
      actionPath: '/activities',
      priority: 9,
      icon: '📝',
    });
  }

  // Weekend-specific suggestions
  if (isWeekend() && topCat?.category === 'transport') {
    suggestions.push({
      id: 'weekend-transport',
      type: 'tip',
      title: 'Weekend Tip',
      message: "Since transport is your biggest category, try walking or cycling for weekend errands. It saves emissions and is great exercise.",
      priority: 7,
      icon: '🚲',
    });
  }

  // Weekday morning nudge
  if (!isWeekend() && !streak.loggedToday) {
    const hour = new Date().getHours();
    if (hour >= 7 && hour <= 9) {
      suggestions.push({
        id: 'commute-reminder',
        type: 'tip',
        title: 'Commute Tracker',
        message: "Morning! Did you commute today? Quick-add your trip before you forget.",
        action: 'Quick Add',
        actionPath: '/',
        priority: 8,
        icon: '🚌',
      });
    }
  }

  // Weekly trend insight
  if (prevWeekTotal > 0 && weekTotal > 0) {
    const change = ((weekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    if (change < -10) {
      suggestions.push({
        id: 'trend-improving',
        type: 'congrats',
        title: 'Great Progress!',
        message: `Your footprint is ${Math.abs(change).toFixed(0)}% lower than last week. You're heading in the right direction.`,
        priority: 8,
        icon: '📉',
      });
    } else if (change > 20) {
      suggestions.push({
        id: 'trend-worsening',
        type: 'insight',
        title: 'Footprint Spike',
        message: `Your emissions are ${change.toFixed(0)}% higher than last week. Check your top category for quick wins.`,
        action: 'View Insights',
        actionPath: '/insights',
        priority: 8,
        icon: '📊',
      });
    }
  }

  // Category-specific adaptive tips
  if (topCat && topCat.total > 0) {
    const categoryTips: Record<Category, SmartSuggestion> = {
      transport: {
        id: 'cat-transport',
        type: 'tip',
        title: 'Transport is Your #1',
        message: `${((topCat.total / Math.max(1, getRecentActivities(activities, 14).reduce((s, a) => s + a.carbonKg, 0))) * 100).toFixed(0)}% of your emissions come from transport. Try carpooling or public transit for your next trip.`,
        priority: 6,
        icon: CATEGORY_INFO.transport.icon,
      },
      energy: {
        id: 'cat-energy',
        type: 'tip',
        title: 'Energy Usage',
        message: 'Energy is your top category. Unplug unused devices and switch to LED bulbs to reduce your footprint.',
        priority: 6,
        icon: CATEGORY_INFO.energy.icon,
      },
      food: {
        id: 'cat-food',
        type: 'tip',
        title: 'Diet Impact',
        message: 'Food is your biggest contributor. Replacing one meat meal per day with a plant-based option saves ~1.8 kg CO₂.',
        priority: 6,
        icon: CATEGORY_INFO.food.icon,
      },
      shopping: {
        id: 'cat-shopping',
        type: 'tip',
        title: 'Shopping Habits',
        message: 'Shopping is your top category. Consider buying second-hand or extending the life of items you already own.',
        priority: 6,
        icon: CATEGORY_INFO.shopping.icon,
      },
      waste: {
        id: 'cat-waste',
        type: 'tip',
        title: 'Waste Reduction',
        message: 'Waste is your biggest category. Recycling and composting can turn negative emissions — you can actually save carbon.',
        priority: 6,
        icon: CATEGORY_INFO.waste.icon,
      },
      digital: {
        id: 'cat-digital',
        type: 'tip',
        title: 'Digital Footprint',
        message: 'Digital activities are your top emitter. Reducing streaming quality from HD to SD cuts data emissions by 80%.',
        priority: 6,
        icon: CATEGORY_INFO.digital.icon,
      },
    };
    suggestions.push(categoryTips[topCat.category]);
  }

  // Repeated activity pattern detection
  if (repeated) {
    const config = EMISSION_FACTORS[repeated];
    const altSuggestions: Partial<Record<ActivityType, string>> = {
      car_trip: 'Could you take the bus or train instead? It would save significant emissions.',
      meat_meal: 'Try a vegetarian meal next time — it saves ~4.9 kg CO₂ per meal.',
      flight: 'For shorter distances, trains emit 6x less CO₂ than flights.',
      electricity_use: 'Unplug idle chargers and appliances to save 5-10% on energy.',
      streaming_hours: 'Try downloading content instead of streaming — it uses less data.',
      online_shopping_delivery: 'Combine deliveries or pick up in-store to reduce shipping emissions.',
    };
    const alt = altSuggestions[repeated];
    if (alt) {
      suggestions.push({
        id: `pattern-${repeated}`,
        type: 'challenge',
        title: 'Pattern Detected',
        message: `You've logged ${config?.unit || 'this'} ${4}+ times this week. ${alt}`,
        priority: 7,
        icon: '🔄',
      });
    }
  }

  // Zero emissions encouragement
  if (streak.loggedToday) {
    const todayTotal = activities
      .filter(a => a.date === format(new Date(), 'yyyy-MM-dd'))
      .reduce((s, a) => s + a.carbonKg, 0);
    if (todayTotal <= 0) {
      suggestions.push({
        id: 'zero-day',
        type: 'congrats',
        title: 'Zero Emissions Day!',
        message: "Amazing! Today you've achieved zero net emissions. That's the goal!",
        priority: 10,
        icon: '🎯',
      });
    }
  }

  return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 5);
}
