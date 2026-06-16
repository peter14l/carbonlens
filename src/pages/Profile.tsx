import { useState, useRef } from 'react';
import {
  User,
  MapPin,
  Home,
  Utensils,
  Car,
  Zap,
  Sun,
  Moon,
  Download,
  Upload,
  Trash2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { CATEGORY_INFO } from '../data/emissions';
import type { Category } from '../types';

const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore', icon: '🍖', desc: 'Eats all foods' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🧀', desc: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟', desc: 'Fish, no meat' },
] as const;

const CAR_TYPES = [
  { value: 'none', label: 'No Car' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

const ENERGY_SOURCES = [
  { value: 'grid', label: 'Grid Power', icon: '🔌' },
  { value: 'solar', label: 'Solar', icon: '☀️' },
  { value: 'wind', label: 'Wind', icon: '💨' },
  { value: 'mixed', label: 'Mixed', icon: '⚡' },
] as const;

export default function Profile() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const clearAllData = useAppStore((s) => s.clearAllData);
  const activities = useAppStore((s) => s.activities);
  const goals = useAppStore((s) => s.goals);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [householdSize, setHouseholdSize] = useState(String(profile.householdSize));
  const [diet, setDiet] = useState(profile.diet);
  const [hasCar, setHasCar] = useState(profile.hasCar);
  const [carType, setCarType] = useState(profile.carType);
  const [usesPublicTransport, setUsesPublicTransport] = useState(profile.usesPublicTransport);
  const [energySource, setEnergySource] = useState(profile.energySource);

  function handleSave() {
    setProfile({
      name,
      location,
      householdSize: parseInt(householdSize, 10) || 1,
      diet,
      hasCar,
      carType,
      usesPublicTransport,
      energySource,
    });
  }

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbonlens-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      importData(json);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  }

  function handleClearAll() {
    clearAllData();
    setShowClearConfirm(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your profile, preferences, and data
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="h-3.5 w-3.5" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Home className="h-3.5 w-3.5" /> Household Size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Utensils className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Diet Preference
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDiet(opt.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                diet === opt.value
                  ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/40'
                  : 'border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-700/50'
              }`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <span
                className={`text-sm font-medium ${
                  diet === opt.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {opt.label}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Transportation
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">I own a car</span>
            <button
              type="button"
              onClick={() => setHasCar(!hasCar)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                hasCar ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  hasCar ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {hasCar && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Car Type
              </label>
              <div className="flex gap-2">
                {CAR_TYPES.filter((t) => t.value !== 'none').map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setCarType(type.value)}
                    className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${
                      carType === type.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I use public transport regularly
            </span>
            <button
              type="button"
              onClick={() => setUsesPublicTransport(!usesPublicTransport)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                usesPublicTransport ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  usesPublicTransport ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Energy Source</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ENERGY_SOURCES.map((source) => (
            <button
              key={source.value}
              type="button"
              onClick={() => setEnergySource(source.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                energySource === source.value
                  ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/40'
                  : 'border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-700/50'
              }`}
            >
              <span className="text-2xl">{source.icon}</span>
              <span
                className={`text-sm font-medium ${
                  energySource === source.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {source.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Profile</Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Currently using {theme} theme
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          Data Management
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Export Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Download all your data as JSON ({activities.length} activities, {goals.length} goals)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Import Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Restore from a previously exported JSON file
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
          {importSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Data imported successfully!
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-red-100 p-4 dark:border-red-900/40">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Clear All Data
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Permanently delete all activities, goals, and badges
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Clear
            </Button>
          </div>

          {showClearConfirm && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="mb-3 text-sm text-red-700 dark:text-red-300">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleClearAll}>
                  Yes, delete everything
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">About</h2>
        </div>
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium text-gray-900 dark:text-white">CarbonLens</span> v1.0.0
          </p>
          <p>
            Track your carbon footprint, set reduction goals, and make a positive impact on the
            planet.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Onboarding:</span>
            {profile.onboardingComplete ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                Not completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
