import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { generateSmartSuggestions, type SmartSuggestion } from '../../utils/smartAssistant';

function SuggestionCard({ suggestion }: { suggestion: SmartSuggestion }) {
  const navigate = useNavigate();
  const typeStyles: Record<SmartSuggestion['type'], string> = {
    tip: 'border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10',
    nudge: 'border-amber-100 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10',
    insight: 'border-purple-100 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10',
    challenge: 'border-orange-100 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-900/10',
    congrats: 'border-green-100 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10',
  };

  return (
    <div className={`rounded-lg border p-3 ${typeStyles[suggestion.type]}`}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-base">{suggestion.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">{suggestion.message}</p>
          {suggestion.action && suggestion.actionPath && (
            <button
              onClick={() => navigate(suggestion.actionPath!)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-gray-900 transition hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
            >
              {suggestion.action}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SmartAssistant() {
  const activities = useAppStore((s) => s.activities);
  const suggestions = useMemo(() => generateSmartSuggestions(activities), [activities]);

  if (activities.length === 0 || suggestions.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Assistant</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((s) => (
          <SuggestionCard key={s.id} suggestion={s} />
        ))}
      </div>
    </div>
  );
}
