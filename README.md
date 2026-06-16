<div align="center">

# 🌿 CarbonLens

### Your Personal Carbon Intelligence Platform

**Track, Understand, and Reduce Your Carbon Footprint — One Action at a Time**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)

*Built for the PromptWars Hackathon — Challenge 3: Carbon Footprint Tracker*

[**Live Demo**](#-live-demo) · [**Features**](#-features) · [**Architecture**](#-architecture) · [**Getting Started**](#-getting-started) · [**Screenshots**](#-screenshots)

</div>

---

## 🌍 The Problem

Climate change is the defining crisis of our time, yet most individuals feel disconnected from their personal environmental impact. **CarbonLens** bridges this gap by making carbon footprint tracking:

- **Effortless** — Quick-add common activities in one tap
- **Intelligent** — Personalized insights based on YOUR actual behavior
- **Actionable** — Specific, prioritized recommendations to reduce your impact
- **Engaging** — Gamification with streaks, badges, and challenges

---

## ✨ Features

### 📊 Real-Time Dashboard
- Live carbon footprint gauge with weekly rating (Excellent → High)
- Category breakdown donut chart (Transport, Energy, Food, Shopping, Waste, Digital)
- 30-day trend visualization with area charts
- Today's and this week's total at a glance
- Current logging streak and total activities

### ⚡ Smart Activity Logger
- **Quick Add** — One-tap logging for 8 most common activities
- **Detailed Logger** — 23 activity types across 6 categories
- **History** — Filterable, sortable activity history with category and date filters
- **Stats** — Per-category breakdown with horizontal bar charts
- **Live CO₂ Preview** — See estimated emissions before logging

### 🧮 Carbon Calculator
- Standalone calculator for quick "what-if" estimates
- Instant comparison: your estimate vs. global/national averages
- Tree, car-km, and flight equivalents for context
- Save directly to your activity log

### 🧠 Personalized Insights
- **Comparison Chart** — Your footprint vs. national avg, global avg, and sustainable target
- **Trend Analysis** — Weekly improving/worsening/stable indicator
- **Smart Tips** — 22 science-based recommendations prioritized by your top emission categories
- **Impact Equivalents** — Trees needed to offset, car-km equivalent, flight equivalents

### 🎯 Goals & Challenges
- Set custom reduction goals with target percentages and date ranges
- Quick challenge suggestions: "Go vegetarian for a week", "No car for 7 days"
- Progress tracking with visual progress bars
- Active vs. completed goal sections

### 🏆 Gamification
- 14 achievement badges: First Step, Week Warrior, Monthly Master, Carbon Cutter, Eco Champion, Planet Hero, Zero Hero, Green Commuter, Plant Power, Recycling Pro, Insight Seeker, Goal Setter, Century Club, Digital Minimalist
- Streak tracking: current and longest
- Level progression system

### 👤 Personalized Profile
- Customizable profile: location, household size, diet, transport, energy source
- Theme toggle: Light and Dark mode
- Data portability: Export/Import JSON
- Multi-step onboarding wizard

### 🎨 Design
- **Glassmorphism UI** — Modern frosted-glass aesthetic
- **Responsive** — Mobile-first with bottom navigation
- **Dark Mode** — Full dark theme support
- **Animated** — Smooth transitions and micro-interactions
- **Accessible** — Proper contrast ratios and focus states

---

## 🏗️ Architecture

```
carbonlens/
├── public/                          # Static assets
│   └── carbon-icon.svg              # App icon
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives
│   │   │   ├── Button.tsx           # 5 variants, 3 sizes
│   │   │   ├── Card.tsx             # Glass-effect card
│   │   │   ├── Input.tsx            # Form input with label/error
│   │   │   ├── Select.tsx           # Dropdown select
│   │   │   ├── Badge.tsx            # Color-coded tags
│   │   │   ├── Modal.tsx            # Overlay dialog
│   │   │   ├── Progress.tsx         # Animated progress bar
│   │   │   └── EmptyState.tsx       # Placeholder for empty views
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Main layout wrapper
│   │   │   ├── Sidebar.tsx          # Desktop navigation
│   │   │   └── MobileNav.tsx        # Bottom mobile nav
│   │   ├── dashboard/
│   │   │   ├── StatsOverview.tsx    # 4 stat cards grid
│   │   │   ├── FootprintGauge.tsx   # Circular SVG gauge
│   │   │   ├── CategoryBreakdown.tsx # Recharts donut chart
│   │   │   ├── WeeklyTrend.tsx      # 30-day area chart
│   │   │   └── RecentActivity.tsx   # Last 5 activities list
│   │   ├── activities/
│   │   │   ├── ActivityForm.tsx     # Full activity logger
│   │   │   ├── ActivityList.tsx     # Filterable history
│   │   │   ├── QuickAdd.tsx         # One-tap quick add
│   │   │   └── ActivityStats.tsx    # Category statistics
│   │   ├── insights/
│   │   │   ├── InsightCards.tsx     # Main insights view
│   │   │   ├── ComparisonChart.tsx  # Your vs. averages
│   │   │   └── TipsList.tsx         # Prioritized tips
│   │   └── charts/
│   │       ├── TrendChart.tsx       # Reusable area chart
│   │       └── BreakdownChart.tsx   # Reusable donut chart
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Activities.tsx           # Activity management
│   │   ├── Calculator.tsx           # Quick calculator
│   │   ├── Insights.tsx             # Insights & badges
│   │   ├── Goals.tsx                # Goals & challenges
│   │   ├── Profile.tsx              # User settings
│   │   └── Onboarding.tsx           # 6-step setup wizard
│   ├── store/
│   │   └── useAppStore.ts           # Zustand state management
│   ├── data/
│   │   └── emissions.ts             # Emission factors & configs
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── carbon.ts                # Calculation utilities
│   ├── App.tsx                      # Root component + routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles + Tailwind
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI components and rendering |
| **Language** | TypeScript 5 | Type safety and developer experience |
| **Build Tool** | Vite 8 | Fast dev server and production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **State** | Zustand | Lightweight state management with persistence |
| **Charts** | Recharts | Declarative charting library |
| **Routing** | React Router v7 | Client-side routing |
| **Icons** | Lucide React | Beautiful, consistent icon set |
| **Dates** | date-fns | Lightweight date utilities |
| **IDs** | UUID | Unique identifier generation |

### Data Architecture

- **Client-Side Only** — All data stored in localStorage via Zustand persist middleware
- **No Backend Required** — Works fully offline after initial load
- **Portable** — Export/import as JSON for data portability
- **Privacy-First** — No data ever leaves your browser

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 22 LTS)
- **npm** 9+ or **yarn** 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/peter14l/carbonlens.git
cd carbonlens

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run typecheck # Run TypeScript type checking
```

### Build for Production

```bash
npm run build
# Output in dist/ directory
# Deploy to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
```

---

## 📸 Screenshots

> Screenshots will be added after deployment. The app features:
> - Clean, modern dashboard with glassmorphism cards
> - Interactive Recharts visualizations
> - Responsive mobile layout with bottom navigation
> - Dark mode support
> - Smooth animations and transitions

---

## 🧪 Emission Factors

CarbonLens uses scientifically-backed emission factors:

| Activity | Factor | Unit | Source |
|----------|--------|------|--------|
| Car (gasoline) | 0.21 kg CO₂ | per km | IPCC |
| Bus | 0.089 kg CO₂ | per km | DEFRA |
| Train | 0.041 kg CO₂ | per km | DEFRA |
| Flight | 0.255 kg CO₂ | per km | ICAO |
| Electricity (grid) | 0.82 kg CO₂ | per kWh | IEA |
| Meat meal | 7.2 kg CO₂ | per meal | Our World in Data |
| Vegetarian meal | 2.3 kg CO₂ | per meal | Our World in Data |
| Vegan meal | 1.2 kg CO₂ | per meal | Our World in Data |

---

## 🎯 Challenge 3 Solution

### How CarbonLens Addresses the Challenge

**"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."**

| Challenge Requirement | CarbonLens Solution |
|----------------------|-------------------|
| **Understand** | Dashboard with visual breakdown, comparison to averages, educational context (tree/car equivalents) |
| **Track** | 23 activity types across 6 categories, quick-add and detailed logging, history with filters |
| **Reduce** | 22 personalized tips, reduction goals, challenges, streaks, and gamification |
| **Simple Actions** | One-tap quick-add for common activities, minimal friction logging |
| **Personalized Insights** | Insights engine that analyzes YOUR data and surfaces relevant tips based on YOUR top categories |

### Key Differentiators

1. **No Account Required** — Privacy-first, all data stays on your device
2. **Works Offline** — PWA-ready architecture
3. **Science-Based** — IPCC, DEFRA, and IEA emission factors
4. **Gamification** — 14 badges, streaks, and challenges keep users engaged
5. **Beautiful Design** — Glassmorphism UI with smooth animations
6. **Full-Featured** — Calculator, insights, goals, profile — all in one app

---

## 🔮 Future Enhancements

- [ ] Backend API for cross-device sync
- [ ] Social features: compare with friends, leaderboards
- [ ] AI-powered personalized recommendations
- [ ] Camera receipt scanning for shopping tracking
- [ ] Integration with smart meters for real energy data
- [ ] Carbon offset marketplace
- [ ] PWA with service worker for offline support
- [ ] Multi-language support
- [ ] Accessibility audit and improvements
- [ ] E2E test suite

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **PromptWars Hackathon** — Challenge 3: Carbon Footprint Tracker
- **Hack2Skill** — Organizing the hackathon
- **IPCC** — Intergovernmental Panel on Climate Change (emission factors)
- **DEFRA** — UK Department for Environment, Food & Rural Affairs (transport factors)
- **IEA** — International Energy Agency (energy factors)
- **Our World in Data** — Food emission research

---

<div align="center">

**Built with 💚 for the planet**

*Every action counts. Start tracking your impact today.*

</div>
