import { startOfWeek } from 'date-fns';

export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function isCurrentWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const weekStart = getWeekStart();
  return d >= weekStart;
}
