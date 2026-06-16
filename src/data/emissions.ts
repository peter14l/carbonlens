import type { Category, ActivityType } from '../types';

export const EMISSION_FACTORS: Record<ActivityType, { factor: number; unit: string; category: Category }> = {
  car_trip: { factor: 0.21, unit: 'km', category: 'transport' },
  bus_trip: { factor: 0.089, unit: 'km', category: 'transport' },
  train_trip: { factor: 0.041, unit: 'km', category: 'transport' },
  flight: { factor: 0.255, unit: 'km', category: 'transport' },
  bike_ride: { factor: 0, unit: 'km', category: 'transport' },
  walk: { factor: 0, unit: 'km', category: 'transport' },
  electricity_use: { factor: 0.82, unit: 'kWh', category: 'energy' },
  gas_use: { factor: 2.04, unit: 'kWh', category: 'energy' },
  solar_energy: { factor: 0.041, unit: 'kWh', category: 'energy' },
  meat_meal: { factor: 7.2, unit: 'meal', category: 'food' },
  vegetarian_meal: { factor: 2.3, unit: 'meal', category: 'food' },
  vegan_meal: { factor: 1.2, unit: 'meal', category: 'food' },
  food_delivery: { factor: 0.5, unit: 'order', category: 'food' },
  grocery_shopping: { factor: 2.5, unit: 'trip', category: 'food' },
  clothing_purchase: { factor: 15, unit: 'item', category: 'shopping' },
  electronics_purchase: { factor: 80, unit: 'item', category: 'shopping' },
  furniture_purchase: { factor: 50, unit: 'item', category: 'shopping' },
  recycling: { factor: -2.5, unit: 'kg', category: 'waste' },
  composting: { factor: -0.8, unit: 'kg', category: 'waste' },
  landfill_waste: { factor: 1.2, unit: 'kg', category: 'waste' },
  streaming_hours: { factor: 0.036, unit: 'hour', category: 'digital' },
  video_call_hours: { factor: 0.015, unit: 'hour', category: 'digital' },
  online_shopping_delivery: { factor: 3.5, unit: 'delivery', category: 'digital' },
};

export const ACTIVITY_CONFIG: Record<ActivityType, {
  label: string;
  category: Category;
  icon: string;
  defaultUnit: string;
  description: string;
  quickAdd: number;
}> = {
  car_trip: { label: 'Car Trip', category: 'transport', icon: '🚗', defaultUnit: 'km', description: 'Personal vehicle travel', quickAdd: 10 },
  bus_trip: { label: 'Bus Trip', category: 'transport', icon: '🚌', defaultUnit: 'km', description: 'Public bus transit', quickAdd: 8 },
  train_trip: { label: 'Train Trip', category: 'transport', icon: '🚆', defaultUnit: 'km', description: 'Rail transit', quickAdd: 20 },
  flight: { label: 'Flight', category: 'transport', icon: '✈️', defaultUnit: 'km', description: 'Air travel', quickAdd: 500 },
  bike_ride: { label: 'Bike Ride', category: 'transport', icon: '🚲', defaultUnit: 'km', description: 'Cycling (zero emissions!)', quickAdd: 5 },
  walk: { label: 'Walking', category: 'transport', icon: '🚶', defaultUnit: 'km', description: 'Walking (zero emissions!)', quickAdd: 2 },
  electricity_use: { label: 'Electricity', category: 'energy', icon: '⚡', defaultUnit: 'kWh', description: 'Grid electricity consumption', quickAdd: 10 },
  gas_use: { label: 'Natural Gas', category: 'energy', icon: '🔥', defaultUnit: 'kWh', description: 'Heating and cooking gas', quickAdd: 15 },
  solar_energy: { label: 'Solar Energy', category: 'energy', icon: '☀️', defaultUnit: 'kWh', description: 'Solar panel energy (low carbon!)', quickAdd: 5 },
  meat_meal: { label: 'Meat Meal', category: 'food', icon: '🥩', defaultUnit: 'meal', description: 'Meat-based meal', quickAdd: 1 },
  vegetarian_meal: { label: 'Vegetarian Meal', category: 'food', icon: '🥗', defaultUnit: 'meal', description: 'Vegetarian meal', quickAdd: 1 },
  vegan_meal: { label: 'Vegan Meal', category: 'food', icon: '🌱', defaultUnit: 'meal', description: 'Plant-based meal', quickAdd: 1 },
  food_delivery: { label: 'Food Delivery', category: 'food', icon: '🛵', defaultUnit: 'order', description: 'Delivered food order', quickAdd: 1 },
  grocery_shopping: { label: 'Grocery Shopping', category: 'food', icon: '🛒', defaultUnit: 'trip', description: 'Grocery store trip', quickAdd: 1 },
  clothing_purchase: { label: 'Clothing', category: 'shopping', icon: '👕', defaultUnit: 'item', description: 'Clothing purchase', quickAdd: 1 },
  electronics_purchase: { label: 'Electronics', category: 'shopping', icon: '📱', defaultUnit: 'item', description: 'Electronics purchase', quickAdd: 1 },
  furniture_purchase: { label: 'Furniture', category: 'shopping', icon: '🪑', defaultUnit: 'item', description: 'Furniture purchase', quickAdd: 1 },
  recycling: { label: 'Recycling', category: 'waste', icon: '♻️', defaultUnit: 'kg', description: 'Recycled materials', quickAdd: 2 },
  composting: { label: 'Composting', category: 'waste', icon: '🌿', defaultUnit: 'kg', description: 'Composted organic waste', quickAdd: 1 },
  landfill_waste: { label: 'Landfill Waste', category: 'waste', icon: '🗑️', defaultUnit: 'kg', description: 'Waste sent to landfill', quickAdd: 2 },
  streaming_hours: { label: 'Streaming', category: 'digital', icon: '📺', defaultUnit: 'hours', description: 'Video streaming', quickAdd: 2 },
  video_call_hours: { label: 'Video Calls', category: 'digital', icon: '💻', defaultUnit: 'hours', description: 'Video conferencing', quickAdd: 1 },
  online_shopping_delivery: { label: 'Online Delivery', category: 'digital', icon: '📦', defaultUnit: 'deliveries', description: 'Online order delivery', quickAdd: 1 },
};

export const CATEGORY_INFO: Record<Category, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  transport: { label: 'Transport', icon: '🚗', color: '#3b82f6', bgColor: '#dbeafe', description: 'Travel and commuting' },
  energy: { label: 'Energy', icon: '⚡', color: '#f59e0b', bgColor: '#fef3c7', description: 'Electricity and gas' },
  food: { label: 'Food', icon: '🍽️', color: '#10b981', bgColor: '#d1fae5', description: 'Diet and groceries' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#8b5cf6', bgColor: '#ede9fe', description: 'Purchases and goods' },
  waste: { label: 'Waste', icon: '♻️', color: '#06b6d4', bgColor: '#cffafe', description: 'Waste management' },
  digital: { label: 'Digital', icon: '💻', color: '#ec4899', bgColor: '#fce7f3', description: 'Online activities' },
};

export const NATIONAL_AVERAGES: Record<string, number> = {
  'United States': 16.0,
  'India': 1.9,
  'China': 7.4,
  'Germany': 8.1,
  'United Kingdom': 5.5,
  'Japan': 9.0,
  'Brazil': 2.3,
  'Australia': 15.0,
  'Canada': 15.6,
  'France': 4.7,
  'Global Average': 4.7,
  'Sustainable Target': 2.0,
};

export const INSIGHT_TIPS = [
  { category: 'transport' as Category, tip: 'Switching from car to public transport can reduce your transport emissions by up to 60%.', impact: 'high' },
  { category: 'transport' as Category, tip: 'Cycling or walking for trips under 5 km eliminates transport emissions entirely.', impact: 'high' },
  { category: 'transport' as Category, tip: 'Carpooling with one other person halves your per-person driving emissions.', impact: 'medium' },
  { category: 'transport' as Category, tip: 'Combining errands into one trip reduces total distance driven.', impact: 'low' },
  { category: 'energy' as Category, tip: 'Switching to LED bulbs reduces lighting energy use by 75%.', impact: 'medium' },
  { category: 'energy' as Category, tip: 'Unplugging electronics when not in use can save 5-10% on your energy bill.', impact: 'low' },
  { category: 'energy' as Category, tip: 'Using a programmable thermostat can reduce heating/cooling emissions by 10-15%.', impact: 'high' },
  { category: 'energy' as Category, tip: 'Air drying clothes instead of using a dryer saves significant energy.', impact: 'medium' },
  { category: 'food' as Category, tip: 'Replacing one meat meal per day with a plant-based option saves ~1.8 kg CO₂.', impact: 'high' },
  { category: 'food' as Category, tip: 'Buying local, seasonal produce reduces food transport emissions.', impact: 'medium' },
  { category: 'food' as Category, tip: 'Reducing food waste by planning meals can cut your food footprint by 20%.', impact: 'high' },
  { category: 'food' as Category, tip: 'Growing your own herbs and vegetables has a near-zero carbon footprint.', impact: 'low' },
  { category: 'shopping' as Category, tip: 'Buying second-hand clothing saves ~15 kg CO₂ per item compared to new.', impact: 'medium' },
  { category: 'shopping' as Category, tip: 'Extending the life of electronics by 1 year reduces their footprint by ~20%.', impact: 'high' },
  { category: 'shopping' as Category, tip: 'Choosing minimal packaging reduces waste and production emissions.', impact: 'low' },
  { category: 'waste' as Category, tip: 'Recycling 1 kg of paper saves 2.5 kg CO₂ compared to landfill.', impact: 'medium' },
  { category: 'waste' as Category, tip: 'Composting food scraps prevents methane emissions from landfills.', impact: 'high' },
  { category: 'waste' as Category, tip: 'Using reusable bags, bottles, and containers reduces single-use waste.', impact: 'low' },
  { category: 'digital' as Category, tip: 'Reducing streaming quality from HD to SD cuts data-related emissions by 80%.', impact: 'low' },
  { category: 'digital' as Category, tip: 'Deleting unused emails and cloud files reduces data center energy use.', impact: 'low' },
  { category: 'digital' as Category, tip: 'Using dark mode on devices reduces screen energy consumption.', impact: 'low' },
];

export const BADGE_DEFINITIONS = [
  { id: 'first_log', name: 'First Step', description: 'Log your first activity', icon: '🌱', requirement: 'Log 1 activity' },
  { id: 'week_streak', name: 'Week Warrior', description: 'Log activities for 7 days straight', icon: '🔥', requirement: '7-day streak' },
  { id: 'month_streak', name: 'Monthly Master', description: 'Log activities for 30 days straight', icon: '🏆', requirement: '30-day streak' },
  { id: 'reduce_10', name: 'Carbon Cutter', description: 'Reduce your footprint by 10%', icon: '✂️', requirement: '10% reduction' },
  { id: 'reduce_25', name: 'Eco Champion', description: 'Reduce your footprint by 25%', icon: '🌟', requirement: '25% reduction' },
  { id: 'reduce_50', name: 'Planet Hero', description: 'Reduce your footprint by 50%', icon: '🦸', requirement: '50% reduction' },
  { id: 'zero_day', name: 'Zero Hero', description: 'Have a day with zero net emissions', icon: '🎯', requirement: 'Zero emissions day' },
  { id: 'green_transport', name: 'Green Commuter', description: 'Use only green transport for a week', icon: '🚲', requirement: '1 week green transport' },
  { id: 'plant_power', name: 'Plant Power', description: 'Eat only plant-based meals for a week', icon: '🌿', requirement: '1 week plant-based' },
  { id: 'recycler', name: 'Recycling Pro', description: 'Recycle more than you send to landfill', icon: '♻️', requirement: 'Net positive waste' },
  { id: 'insight_seeker', name: 'Insight Seeker', description: 'View your insights dashboard', icon: '📊', requirement: 'View insights' },
  { id: 'goal_setter', name: 'Goal Setter', description: 'Set your first reduction goal', icon: '🎯', requirement: 'Create 1 goal' },
  { id: 'hundred_logs', name: 'Century Club', description: 'Log 100 activities', icon: '💯', requirement: '100 activities logged' },
  { id: 'low_digital', name: 'Digital Minimalist', description: 'Keep digital footprint under 1 kg for a week', icon: '📱', requirement: 'Low digital week' },
];
