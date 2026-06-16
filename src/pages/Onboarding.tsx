import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Leaf, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { UserProfile } from '../types';

const STEPS = ['Welcome', 'Location', 'Diet', 'Transport', 'Energy', 'Complete'];

const DIET_OPTIONS: { value: UserProfile['diet']; label: string; icon: string; desc: string }[] = [
  { value: 'omnivore', label: 'Omnivore', icon: '🍖', desc: 'All foods' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🧀', desc: 'No meat' },
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟', desc: 'Fish only' },
];

const CAR_TYPES: { value: UserProfile['carType']; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'gasoline', label: 'Gas' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

const ENERGY_SOURCES: { value: UserProfile['energySource']; label: string; icon: string }[] = [
  { value: 'grid', label: 'Grid', icon: '🔌' },
  { value: 'solar', label: 'Solar', icon: '☀️' },
  { value: 'wind', label: 'Wind', icon: '💨' },
  { value: 'mixed', label: 'Mixed', icon: '⚡' },
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

  function nextStep() { if (step < STEPS.length - 1) setStep(step + 1); }
  function prevStep() { if (step > 0) setStep(step - 1); }

  function handleComplete() {
    setProfile({ name: name.trim() || 'User', location, householdSize: parseInt(householdSize, 10) || 1, diet, hasCar, carType: hasCar ? carType : 'none', usesPublicTransport, energySource, averageCommuteKm: 0, onboardingComplete: true });
    navigate('/');
  }

  function handleSkip() { setProfile({ onboardingComplete: true }); navigate('/'); }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-lg bg-gray-900 p-2 dark:bg-white">
            <Leaf className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
        </div>

        <div className="mb-4 flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}`} />
          ))}
        </div>

        <p className="mb-3 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
          {step + 1} / {STEPS.length}
        </p>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          {step === 0 && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-base font-semibold text-gray-900 dark:text-white">Welcome to CarbonLens</h1>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Let's set up your profile.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Your name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" autoFocus className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Where are you?</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Compare to regional averages.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., New York, USA" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Household Size</label>
                <input type="number" min="1" max="20" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Your diet?</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Diet is a major factor.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setDiet(opt.value)} className={`flex flex-col items-center gap-1.5 rounded-lg border p-4 transition-colors ${diet === opt.value ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`text-xs font-medium ${diet === opt.value ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{opt.label}</span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Transport?</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Often the largest part of your footprint.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-900 dark:text-white">I own a car</span>
                <button type="button" onClick={() => setHasCar(!hasCar)} className={`relative h-5 w-9 rounded-full transition-colors ${hasCar ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform dark:bg-gray-900 ${hasCar ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {hasCar && (
                <div className="flex gap-1.5">
                  {CAR_TYPES.filter((t) => t.value !== 'none').map((type) => (
                    <button key={type.value} type="button" onClick={() => setCarType(type.value)} className={`flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-colors ${carType === type.value ? 'border-gray-900 bg-gray-50 text-gray-900 dark:border-white dark:bg-gray-800 dark:text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400'}`}>
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-900 dark:text-white">Public transport</span>
                <button type="button" onClick={() => setUsesPublicTransport(!usesPublicTransport)} className={`relative h-5 w-9 rounded-full transition-colors ${usesPublicTransport ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform dark:bg-gray-900 ${usesPublicTransport ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Energy source?</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Affects your electricity footprint.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ENERGY_SOURCES.map((source) => (
                  <button key={source.value} type="button" onClick={() => setEnergySource(source.value)} className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${energySource === source.value ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                    <span className="text-2xl">{source.icon}</span>
                    <span className={`text-xs font-medium ${energySource === source.value ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{source.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <Check className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">All set{name ? `, ${name}` : ''}!</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Your profile summary:</p>
              </div>
              <div className="mx-auto max-w-xs space-y-1.5 text-left">
                {[
                  ['Location', location || 'Not set'],
                  ['Household', `${householdSize} ${parseInt(householdSize, 10) === 1 ? 'person' : 'people'}`],
                  ['Diet', diet],
                  ['Car', hasCar ? carType : 'None'],
                  ['Energy', energySource],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {step > 0 && (
              <button type="button" onClick={prevStep} className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step < STEPS.length - 1 && (
              <button type="button" onClick={handleSkip} className="rounded-md px-3 py-2 text-xs font-medium text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300">
                Skip
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900">
                Next <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <button type="button" onClick={handleComplete} className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900">
                <Check className="h-3 w-3" /> Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
