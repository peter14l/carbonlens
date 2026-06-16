import { useState, useRef } from 'react';
import { User, MapPin, Home, Utensils, Car, Zap, Sun, Moon, Download, Upload, Trash2, Info, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';

const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore', icon: '🍖', desc: 'All foods' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🧀', desc: 'No meat' },
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟', desc: 'Fish only' },
] as const;

const CAR_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'gasoline', label: 'Gas' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

const ENERGY_SOURCES = [
  { value: 'grid', label: 'Grid', icon: '🔌' },
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
    setProfile({ name, location, householdSize: parseInt(householdSize, 10) || 1, diet, hasCar, carType, usesPublicTransport, energySource });
  }

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `carbonlens-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { importData(event.target?.result as string); setImportSuccess(true); setTimeout(() => setImportSuccess(false), 3000); if (fileInputRef.current) fileInputRef.current.value = ''; };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">Manage your profile and data</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Personal</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400"><MapPin className="h-2.5 w-2.5" /> Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400"><Home className="h-2.5 w-2.5" /> Household</label>
              <input type="number" min="1" max="20" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <Utensils className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Diet</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DIET_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setDiet(opt.value)} className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${diet === opt.value ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
              <span className="text-xl">{opt.icon}</span>
              <span className={`text-xs font-medium ${diet === opt.value ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{opt.label}</span>
              <span className="text-[9px] text-gray-500">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Transport</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700 dark:text-gray-300">I own a car</span>
            <button type="button" onClick={() => setHasCar(!hasCar)} className={`relative h-5 w-9 rounded-full transition-colors ${hasCar ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform dark:bg-gray-900 ${hasCar ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {hasCar && (
            <div className="flex gap-1.5">
              {CAR_TYPES.filter((t) => t.value !== 'none').map((type) => (
                <button key={type.value} type="button" onClick={() => setCarType(type.value)} className={`flex-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition-colors ${carType === type.value ? 'border-gray-900 bg-gray-50 text-gray-900 dark:border-white dark:bg-gray-800 dark:text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400'}`}>
                  {type.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700 dark:text-gray-300">Public transport</span>
            <button type="button" onClick={() => setUsesPublicTransport(!usesPublicTransport)} className={`relative h-5 w-9 rounded-full transition-colors ${usesPublicTransport ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform dark:bg-gray-900 ${usesPublicTransport ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Energy</p>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {ENERGY_SOURCES.map((source) => (
            <button key={source.value} type="button" onClick={() => setEnergySource(source.value)} className={`flex flex-col items-center gap-1 rounded-md border p-2.5 transition-colors ${energySource === source.value ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
              <span className="text-base">{source.icon}</span>
              <span className={`text-[10px] font-medium ${energySource === source.value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{source.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="sm">Save Profile</Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">Appearance</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-3.5 w-3.5 text-gray-400" /> : <Sun className="h-3.5 w-3.5 text-gray-400" />}
            <span className="text-xs text-gray-700 dark:text-gray-300">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
          </div>
          <button type="button" onClick={toggleTheme} className={`relative h-5 w-9 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform dark:bg-gray-900 ${theme === 'dark' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">Data</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-gray-100 p-3 dark:border-gray-800">
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Export</p>
              <p className="text-[10px] text-gray-500">{activities.length} activities, {goals.length} goals</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-1 h-3 w-3" /> Export</Button>
          </div>
          <div className="flex items-center justify-between rounded-md border border-gray-100 p-3 dark:border-gray-800">
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Import</p>
              <p className="text-[10px] text-gray-500">Restore from JSON</p>
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="mr-1 h-3 w-3" /> Import</Button>
            </div>
          </div>
          {importSuccess && (
            <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" /> Imported!
            </div>
          )}
          <div className="flex items-center justify-between rounded-md border border-red-100 p-3 dark:border-red-900/40">
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400">Clear All Data</p>
              <p className="text-[10px] text-gray-500">Delete everything</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowClearConfirm(true)}><Trash2 className="mr-1 h-3 w-3" /> Clear</Button>
          </div>
          {showClearConfirm && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="mb-2 text-xs text-red-700 dark:text-red-300">This cannot be undone.</p>
              <div className="flex gap-1.5">
                <Button variant="danger" size="sm" onClick={() => { clearAllData(); setShowClearConfirm(false); }}>Delete</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">About</p>
        </div>
        <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-500">
          <p><span className="font-medium text-gray-900 dark:text-white">CarbonLens</span> v1.0.0</p>
          <p>Track your carbon footprint and reduce your impact.</p>
        </div>
      </div>
    </div>
  );
}
