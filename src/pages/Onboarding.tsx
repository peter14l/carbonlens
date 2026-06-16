import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Leaf, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { UserProfile } from '../types';

const STEPS = [
  'Welcome',
  'Location',
  'Diet',
  'Transport',
  'Energy',
  'Complete',
];

const DIET_OPTIONS: { value: UserProfile['diet']; label: string; icon: string; desc: string }[] = [
  { value: 'omnivore', label: 'Omnivore', icon: '🍖', desc: 'Eats all foods including meat' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🧀', desc: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟', desc: 'Fish but no meat' },
];

const CAR_TYPES: { value: UserProfile['carType']; label: string }[] = [
  { value: 'none', label: 'No Car' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

const ENERGY_SOURCES: { value: UserProfile['energySource']; label: string; icon: string }[] = [
  { value: 'grid', label: 'Standard Grid', icon: '🔌' },
  { value: 'solar', label: 'Solar Power', icon: '☀️' },
  { value: 'wind', label: 'Wind Power', icon: '💨' },
  { value: 'mixed', label: 'Mixed / Renewable', icon: '⚡' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useAppStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState('1');
  const [diet, setDiet] = useState<UserProfile['diet']>('omnivore');
  const [hasCar, setHasCar] = useState(false);
  const [carType, setCarType] = useState<UserProfile['carType']>('none');
  const [usesPublicTransport, setUsesPublicTransport] = useState(false);
  const [energySource, setEnergySource] = useState<UserProfile['energySource']>('grid');

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function handleComplete() {
    setProfile({
      name: name.trim() || 'User',
      location,
      householdSize: parseInt(householdSize, 10) || 1,
      diet,
      hasCar,
      carType: hasCar ? carType : 'none',
      usesPublicTransport,
      energySource,
      averageCommuteKm: 0,
      onboardingComplete: true,
    });
    navigate('/');
  }

  function handleSkip() {
    setProfile({ onboardingComplete: true });
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="mb-6 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step
                  ? 'bg-emerald-600 dark:bg-emerald-400'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <p className="mb-2 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
          Step {step + 1} of {STEPS.length}
        </p>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome to CarbonLens
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Let's set up your profile to personalize your carbon tracking experience.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Where are you located?
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This helps us compare your footprint to regional averages.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, USA"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Household Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  What's your diet?
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Diet is one of the biggest factors in your carbon footprint.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DIET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDiet(opt.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                      diet === opt.value
                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10 dark:border-emerald-400 dark:bg-emerald-950/40'
                        : 'border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-emerald-600'
                    }`}
                  >
                    <span className="text-4xl">{opt.icon}</span>
                    <span
                      className={`font-semibold ${
                        diet === opt.value
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-center text-xs text-gray-500 dark:text-gray-400">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  How do you get around?
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Transport is often the largest part of an individual's carbon footprint.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  I own a car
                </span>
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
                        className={`flex-1 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
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

              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
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
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Where does your energy come from?
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your energy source affects the carbon intensity of your electricity use.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ENERGY_SOURCES.map((source) => (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => setEnergySource(source.value)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                      energySource === source.value
                        ? 'border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-400 dark:bg-emerald-950/40'
                        : 'border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-emerald-600'
                    }`}
                  >
                    <span className="text-3xl">{source.icon}</span>
                    <span
                      className={`font-semibold ${
                        energySource === source.value
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {source.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  You're all set{name ? `, ${name}` : ''}!
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Here's a summary of your profile:
                </p>
              </div>
              <div className="mx-auto max-w-sm space-y-3 text-left">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {location || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Household</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {householdSize} {parseInt(householdSize, 10) === 1 ? 'person' : 'people'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Diet</span>
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {diet}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Car</span>
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {hasCar ? carType : 'No car'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energy</span>
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {energySource}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < STEPS.length - 1 && (
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-700 active:bg-emerald-800"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-700 active:bg-emerald-800"
              >
                <Check className="h-4 w-4" />
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
