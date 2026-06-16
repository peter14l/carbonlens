export type Category = 'transport' | 'energy' | 'food' | 'shopping' | 'waste' | 'digital';

export type ActivityType =
  | 'car_trip'
  | 'bus_trip'
  | 'train_trip'
  | 'flight'
  | 'bike_ride'
  | 'walk'
  | 'electricity_use'
  | 'gas_use'
  | 'solar_energy'
  | 'meat_meal'
  | 'vegetarian_meal'
  | 'vegan_meal'
  | 'food_delivery'
  | 'grocery_shopping'
  | 'clothing_purchase'
  | 'electronics_purchase'
  | 'furniture_purchase'
  | 'recycling'
  | 'composting'
  | 'landfill_waste'
  | 'streaming_hours'
  | 'video_call_hours'
  | 'online_shopping_delivery';

export interface Activity {
  id: string;
  type: ActivityType;
  category: Category;
  label: string;
  quantity: number;
  unit: string;
  carbonKg: number;
  date: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  location: string;
  householdSize: number;
  diet: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian';
  hasCar: boolean;
  carType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'none';
  usesPublicTransport: boolean;
  energySource: 'grid' | 'solar' | 'wind' | 'mixed';
  averageCommuteKm: number;
  onboardingComplete: boolean;
}

export interface Goal {
  id: string;
  title: string;
  targetReductionPercent: number;
  startDate: string;
  endDate: string;
  category?: Category;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface WeeklySnapshot {
  weekStart: string;
  totalCarbonKg: number;
  breakdown: Record<Category, number>;
}

export interface InsightsData {
  tips: string[];
  comparison: {
    yourFootprint: number;
    nationalAverage: number;
    globalAverage: number;
    targetSustainable: number;
  };
  topCategories: { category: Category; percentage: number; trend: 'up' | 'down' | 'stable' }[];
  weeklyTrend: 'improving' | 'worsening' | 'stable';
}

export interface AppState {
  profile: UserProfile;
  activities: Activity[];
  goals: Goal[];
  badges: Badge[];
  weeklySnapshots: WeeklySnapshot[];
  theme: 'light' | 'dark';
  currentStreak: number;
  longestStreak: number;
  totalCarbonSaved: number;
}
