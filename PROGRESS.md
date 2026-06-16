# CarbonLens — Progress Tracker

## Project: CarbonLens (PromptWars Hackathon — Challenge 3)

**Status:** 🟢 Complete (v1.1.0)
**Start Date:** 2026-06-16
**Completion Date:** 2026-06-16

---

## Milestones

### Phase 1: Project Setup
- [x] Create project directory on E: drive
- [x] Initialize Vite + React + TypeScript project
- [x] Install all dependencies (React, Zustand, Recharts, Tailwind, etc.)
- [x] Configure Tailwind CSS v4 with @tailwindcss/vite
- [x] Configure TypeScript with strict mode
- [x] Set up Vite config with path aliases
- [x] Install Node.js (v22.16.0 via zip extraction)

### Phase 2: Core Architecture
- [x] Define TypeScript types and interfaces
- [x] Create emission factors data layer (23 activity types, 6 categories)
- [x] Create activity configuration data (icons, labels, defaults)
- [x] Create category info data (colors, icons, descriptions)
- [x] Create badge definitions (14 badges)
- [x] Build carbon calculation utilities
- [x] Build streak calculation utilities
- [x] Build insight generation utilities
- [x] Build Zustand store with persistence middleware
- [x] Build activity logging, goals, badges, theme, export/import

### Phase 3: UI Components (v1.1.0 — Redesigned)
- [x] Button (5 variants, 3 sizes) — Clean, no shadows
- [x] Card — Minimal border-only design
- [x] Badge (6 variants) — Muted color palette
- [x] Modal — Clean overlay, border-based design
- [x] Progress — Thin bar, muted colors
- [x] Input — Compact, clean focus states
- [x] Select — Consistent with Input
- [x] EmptyState — Minimal icon treatment

### Phase 4: Layout Components (v1.1.0 — Redesigned)
- [x] Sidebar — Professional minimal nav, collapsed state
- [x] MobileNav — Clean bottom bar, no backdrop blur
- [x] Layout wrapper — Clean backgrounds, no glassmorphism

### Phase 5: Dashboard Components (v1.1.0 — Redesigned)
- [x] StatsOverview — Clean stat cards, fixed `any` types
- [x] FootprintGauge — Simplified SVG gauge
- [x] CategoryBreakdown — Clean donut chart
- [x] WeeklyTrend — Clean area chart
- [x] RecentActivity — Uses date-fns formatDistanceToNow

### Phase 6: Activity Components (v1.1.0 — Redesigned)
- [x] ActivityForm — Clean tabs, minimal card design
- [x] ActivityList — Uses shared week utility, clean list
- [x] QuickAdd — Minimal card design, clean animation
- [x] ActivityStats — Clean stat cards, minimal chart

### Phase 7: Insights Components (v1.1.0 — Redesigned)
- [x] ComparisonChart — Clean bar chart, neutral colors
- [x] TipsList — (integrated into Insights page)

### Phase 8: Pages (v1.1.0 — Redesigned)
- [x] Dashboard — Clean welcome + data views
- [x] Activities — Clean tabbed interface
- [x] Calculator — Clean category/activity selector
- [x] Insights — Comparison, categories, tips, achievements
- [x] Goals — Clean goal cards, quick challenges
- [x] Profile — Clean settings panels
- [x] Onboarding — Clean 6-step wizard

### Phase 9: Feature Enhancements (v1.1.0)
- [x] Error Boundary — Prevents white screen crashes
- [x] Shared date utility — `getWeekStart()`, `isCurrentWeek()`
- [x] Uses date-fns consistently (formatDistanceToNow in RecentActivity)
- [x] Fixed `any` types in StatsOverview (ActivityType instead of any[])
- [x] Added `typecheck` npm script

### Phase 10: Build & Deploy
- [x] Fix all TypeScript errors
- [x] Clean production build
- [x] Initialize git repository
- [x] Create GitHub public repo
- [x] Push code to GitHub
- [x] Rewrite README for challenge submission format (vertical, approach, how it works, assumptions)

### Phase 11: Challenge 3 Enhancements (v1.2.0)
- [x] Vitest test infrastructure — 38 tests across 4 test files
  - Carbon calculations (22 tests)
  - Date utilities (5 tests)
  - Streak calculation (4 tests)
  - Smart assistant (7 tests)
- [x] Smart Assistant — Context-aware proactive suggestions
  - Streak milestones (3-day, 6-day nudges)
  - Daily logging reminders
  - Weekend/weekday adaptive tips
  - Category-specific insights based on user patterns
  - Repeated activity pattern detection
  - Weekly trend analysis (improving/worsening)
  - Zero-emissions encouragement
- [x] Accessibility improvements
  - Focus trap + Escape key in Modal
  - Skip-to-content link
  - ARIA labels on navigation (sidebar, mobile nav)
  - aria-pressed on toggle buttons (category tabs, activity selectors)
  - aria-live region for carbon preview
  - Visible focus-visible styles for keyboard navigation
  - Focus restoration on modal close

---

## v1.1.0 — UI Redesign Summary

### Design Philosophy
Stripped away "AI-slop" aesthetics in favor of professional minimalism:
- **Removed:** Glassmorphism (backdrop-blur, semi-transparent bg), heavy shadows, excessive rounded corners (rounded-2xl everywhere), emerald-only color scheme, emoji-heavy functional UI, ring effects
- **Added:** Clean border-based cards, neutral color palette (gray-900/white contrast), minimal spacing, professional typography hierarchy, subtle hover states

### Key Changes
| Before | After |
|--------|-------|
| Glass cards (backdrop-blur, shadow-sm, ring-1) | Border-only cards (border-gray-200) |
| Emerald-600 primary everywhere | Gray-900/white neutral primary |
| Rounded-2xl on all cards | Rounded-lg on all cards |
| Large padding (p-6) | Compact padding (p-4, p-5) |
| Text-2xl headings | Text-lg headings |
| Emoji icons in functional UI | Lucide icons for functional, emojis only for data |
| Shadow effects on hover | Border color change on hover |
| Backdrop blur mobile nav | Clean white/dark background nav |
| Complex animations | Simple fade/slide only |

### Bundle Size
- **CSS:** 57 KB → 44 KB (23% reduction)
- **JS:** 759 KB → 750 KB (1.2% reduction)

---

## File Count Summary

| Category | Files | Lines (approx) |
|----------|-------|----------------|
| Types & Data | 2 | ~350 |
| Store | 1 | ~200 |
| Utils | 4 | ~520 |
| UI Components | 8 | ~420 |
| Layout Components | 3 | ~200 |
| Dashboard Components | 6 | ~500 |
| Activity Components | 4 | ~700 |
| Insights Components | 1 | ~100 |
| Pages | 7 | ~1200 |
| Tests | 4 | ~300 |
| Config & Entry | 7 | ~120 |
| **Total** | **~47** | **~5,600** |

---

## Issues Fixed (v1.1.0)

1. **`any` types in StatsOverview** — Replaced `any[]` with `Activity[]` (from types)
2. **Duplicated week calculation** — Extracted `getWeekStart()` to shared `utils/date.ts`
3. **Manual date formatting** — Replaced manual `formatDate()` with `date-fns` `formatDistanceToNow`
4. **Missing Error Boundary** — Added `ErrorBoundary` component wrapping the app
5. **Missing `typecheck` script** — Added `"typecheck": "tsc --noEmit"` to package.json
6. **Dead code cleanup** — Removed unused `InsightCards.tsx`, `TrendChart.tsx`, `BreakdownChart.tsx`
7. **Inconsistent Badge variants** — Redesigned to semantic variants (default, success, warning, danger, info, muted)
8. **Category color duplication** — Centralized in `CATEGORY_INFO` (ActivityStats still has local copy for chart colors)

---

## Key Metrics

- **Build Time:** ~30 seconds
- **Bundle Size:** 759 KB JS (219 KB gzipped), 49 KB CSS (9 KB gzipped)
- **Type Errors:** 0
- **Tests:** 38 passing (4 test files)
- **Activity Types:** 23
- **Badge Types:** 14
- **Insight Tips:** 22
- **Pages:** 7
- **Components:** 23 (including SmartAssistant, ErrorBoundary)
