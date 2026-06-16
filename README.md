# CarbonLens

### Carbon Footprint Awareness Platform

Built for PromptWars Virtual Challenge 3 — Helping individuals understand, track, and reduce their carbon footprint.

---

## Vertical

**Carbon Footprint Awareness Platform**

CarbonLens is a client-side web application that helps individuals track, understand, and reduce their daily carbon emissions through activity logging, personalized insights, and gamification.

---

## Approach & Logic

### Problem Statement

Most people underestimate their personal carbon impact because emissions are invisible — there's no price tag on CO₂. The goal: make emissions tangible, visible, and actionable through simple daily logging.

### Solution Design

CarbonLens follows a **track → understand → act** feedback loop:

1. **Track** — Log daily activities (transport, energy, food, shopping, waste, digital) with minimal friction. One-tap quick-add for common actions, detailed form for less frequent ones.

2. **Understand** — Convert raw activities into CO₂ equivalents using science-based emission factors (IPCC, DEFRA, IEA). Visualize breakdown by category, compare against national/global averages, and show relatable equivalents (trees, car-km, flights).

3. **Act** — Surface personalized recommendations based on the user's highest-emission categories. Gamification (streaks, badges, challenges) creates behavioral momentum.

### Technical Decisions

- **Zustand + localStorage persistence** — No backend needed. Data stays on-device for privacy and offline use. The store persists all activities, profile, goals, and settings automatically.

- **23 activity types across 6 categories** — Covers the major sources of individual emissions: transport (6), energy (3), food (5), shopping (3), waste (3), digital (3). Negative factors for recycling/composting to reflect net-zero calculations.

- **Insight engine** — Analyzes user data to prioritize tips. When transport is the user's #1 category, transport tips appear first. Tips are ranked by impact level (high/medium/low).

- **date-fns over Moment.js** — Smaller bundle, tree-shakeable, better for a client-side app.

- **Recharts for visualizations** — Declarative chart components for the dashboard gauge, category breakdown donut, weekly trend area chart, and comparison bar chart.

### Emission Factors

| Activity | Factor | Source |
|----------|--------|--------|
| Car (gasoline) | 0.21 kg CO₂/km | IPCC |
| Bus | 0.089 kg CO₂/km | DEFRA |
| Train | 0.041 kg CO₂/km | DEFRA |
| Flight | 0.255 kg CO₂/km | ICAO |
| Electricity (grid) | 0.82 kg CO₂/kWh | IEA |
| Meat meal | 7.2 kg CO₂/meal | Our World in Data |
| Vegetarian meal | 2.3 kg CO₂/meal | Our World in Data |
| Recycling | -2.5 kg CO₂/kg | IPCC |

---

## How It Works

### Core Flow

1. **Onboarding** — New users complete a 6-step wizard (name, location, household size, diet preference, transport habits, energy source) to personalize their experience.

2. **Activity Logging** — Two modes:
   - **Quick Add** (Dashboard) — 8 one-tap buttons for the most common activities (car, bus, walk, bike, electricity, gas, meat meal, vegetarian meal). Logs instantly.
   - **Detailed Form** (Activities page) — Full form with category selection, amount input, date picker, and live CO₂ preview before saving.

3. **Dashboard** — At-a-glance view showing:
   - Circular gauge with weekly footprint and rating (Excellent/Good/Average/High)
   - Category breakdown donut chart
   - 30-day trend area chart
   - Today's total, this week's total, streak, and activity count
   - Last 5 activities with "View All" link

4. **Calculator** — Standalone "what-if" tool. Enter a value → see estimated CO₂ → compare to national/global averages → save directly to log.

5. **Insights** — Personalized analysis:
   - Comparison chart: Your footprint vs. national avg, global avg, sustainable target
   - Trend indicator: Improving/worsening/stable
   - Prioritized tips: Based on YOUR highest categories
   - Impact equivalents: Trees, car-km, flights

6. **Goals** — Set reduction targets with percentage, date range, and optional challenge suggestions. Track progress with visual bars.

7. **Profile** — Customize settings, theme (light/dark), export/import data as JSON for portability.

### Data Persistence

All data is stored in `localStorage` via Zustand's `persist` middleware. No server calls. No accounts. No data leaves the browser.

### Key Files

| File | Purpose |
|------|---------|
| `src/store/useAppStore.ts` | Central Zustand store — activities, profile, goals, badges, onboarding state |
| `src/data/emissions.ts` | Emission factors, activity configs, categories, badge definitions, insight tips |
| `src/utils/carbon.ts` | Calculation functions (footprint, streak, breakdown, equivalents) |
| `src/components/ErrorBoundary.tsx` | Catches render errors, prevents white-screen crashes |

---

## Assumptions

1. **Single-user, client-side** — No cross-device sync or multi-user support. Each browser has its own data.

2. **Approximate emission factors** — Real emissions vary by vehicle type, energy grid mix, etc. We use representative averages from IPCC/DEFRA/IEA. Not a replacement for a detailed audit.

3. **User honesty** — Accuracy depends on truthful input. No verification mechanism.

4. **No real-time data** — No smart meter or API integrations. All data is manually logged.

5. **Indian context** — National average for India (1.9 kg CO₂/day) used as default comparison. Users can change country in profile.

6. **Offline-first** — Works fully offline after initial load. No PWA service worker yet, but architecture supports it.

7. **Browser compatibility** — Tested on modern browsers (Chrome, Firefox, Edge, Safari). No IE11 support.

---

## Getting Started

```bash
git clone https://github.com/peter14l/carbonlens.git
cd carbonlens
npm install
npm run dev
# Open http://localhost:5173
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run Vitest test suite |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| State | Zustand (persist to localStorage) |
| Charts | Recharts |
| Routing | React Router v7 |
| Icons | Lucide React |
| Dates | date-fns |
| Testing | Vitest + Testing Library |

---

## License

MIT
