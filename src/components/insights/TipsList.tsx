import { useMemo, useState } from 'react';
import { CATEGORY_INFO, INSIGHT_TIPS } from '../../data/emissions';

interface Tip {
  category: string;
  text: string;
  impact: 'high' | 'medium' | 'low';
}

const IMPACT_STYLES: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  energy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  shopping: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  waste: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  digital: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  water: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function getCategoryStyle(category: string): string {
  const key = category.toLowerCase();
  return CATEGORY_COLORS[key] ?? CATEGORY_COLORS.other;
}

function getImpactStyle(impact: string): string {
  return IMPACT_STYLES[impact] ?? IMPACT_STYLES.low;
}

interface TipsListProps {
  topCategories: string[];
  maxTips?: number;
}

export default function TipsList({ topCategories, maxTips = 10 }: TipsListProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const allTips = useMemo<Tip[]>(() => {
    return INSIGHT_TIPS.map((t: any) => ({
      category: t.category ?? t.type ?? 'other',
      text: t.text ?? t.tip ?? t.description ?? '',
      impact: (t.impact ?? 'medium') as Tip['impact'],
    }));
  }, []);

  const categoryLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [key, info] of Object.entries(CATEGORY_INFO as Record<string, { name?: string; label?: string }>)) {
      map[key] = info.name ?? info.label ?? key;
    }
    return map;
  }, []);

  const filteredTips = useMemo(() => {
    let tips = allTips;

    if (activeFilter) {
      tips = tips.filter((t) => t.category.toLowerCase() === activeFilter.toLowerCase());
    } else {
      const topSet = new Set(topCategories.map((c) => c.toLowerCase()));
      const relevant = tips.filter((t) => topSet.has(t.category.toLowerCase()));
      const others = tips.filter((t) => !topSet.has(t.category.toLowerCase()));
      tips = [...relevant, ...others];
    }

    return tips.slice(0, maxTips);
  }, [allTips, topCategories, activeFilter, maxTips]);

  const availableCategories = useMemo(() => {
    const cats = new Set(allTips.map((t) => t.category.toLowerCase()));
    return Array.from(cats).sort();
  }, [allTips]);

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            activeFilter === null
              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
              : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
          }`}
        >
          All
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === cat
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {categoryLabels[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTips.map((tip, i) => (
          <div
            key={`${tip.category}-${i}`}
            className="rounded-xl border border-gray-800/60 bg-gray-900/50 p-4 backdrop-blur-sm transition-colors hover:border-emerald-800/40"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getCategoryStyle(tip.category)}`}
              >
                {categoryLabels[tip.category] ?? tip.category}
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getImpactStyle(tip.impact)}`}
              >
                {tip.impact} impact
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">{tip.text}</p>
          </div>
        ))}

        {filteredTips.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No tips available for this category.
          </p>
        )}
      </div>
    </div>
  );
}
