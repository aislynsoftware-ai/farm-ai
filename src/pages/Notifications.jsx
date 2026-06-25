import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Lightbulb, Sparkles, Sun, CloudRain, Bell, ChevronRight, AlertTriangle, Snowflake, Droplets, X, Loader, CheckCircle, MapPin } from 'lucide-react';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';
import SEO from '../components/common/SEO';
import Sidebar from '../components/dashboard/Sidebar';

const tipCategories = [
  { key: 'tip_of_day', label: 'Tip of the Day', icon: Lightbulb },
  { key: 'plant_hack', label: 'Plant Hacks', icon: Sparkles },
  { key: 'seasonal', label: 'Seasonal Alerts', icon: Sun },
];

const tipIcons = { tip_of_day: Lightbulb, plant_hack: Sparkles, seasonal: Sun };

const weatherIcons = { 'cloud-rain': CloudRain, 'sun': Sun, 'snowflake': Snowflake, 'droplets': Droplets };

const tabs = [
  { key: 'tips', label: 'Daily Tips', icon: Lightbulb },
  { key: 'weather', label: 'Weather Alerts', icon: CloudRain },
];

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('tips');
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [tipCategory, setTipCategory] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    if (tab !== 'tips') return;
    setTipsLoading(true);
    api.dailyTips.list(tipCategory || undefined)
      .then(setTips)
      .catch(() => setTips([]))
      .finally(() => setTipsLoading(false));
  }, [tab, tipCategory]);

  const fetchWeather = (lat, lng) => {
    setWeatherLoading(true);
    setWeatherError('');
    setWeather(null);
    api.weather.alert(lat, lng)
      .then((data) => {
        setWeather(data);
      })
      .catch(() => setWeatherError('Failed to fetch weather'))
      .finally(() => setWeatherLoading(false));
  };

  const fetchByGeo = () => {
    if (!navigator.geolocation) { setWeatherError('Location not available. Enter coordinates manually below.'); return; }
    setWeatherLoading(true);
    setWeatherError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => { setWeatherError('Location access denied. Enter coordinates manually below.'); setWeatherLoading(false); },
      { timeout: 5000 }
    );
  };

  const fetchManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) { setWeatherError('Enter valid latitude and longitude'); return; }
    fetchWeather(lat, lng);
  };

  useEffect(() => {
    if (tab === 'weather') fetchByGeo();
  }, [tab]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-20 left-4 z-40 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg cursor-pointer">
        <Menu size={18} className="text-gray-700 dark:text-gray-300" />
      </button>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden mt-14">

      <SEO title="Notifications" description="Daily farming tips, plant care hacks, and weather alerts." url="/notifications" />
      <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full bg-emerald-500" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Daily tips, plant hacks, seasonal alerts, and weather-based warnings.</p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${tab === t.key ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'tips' && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              <button onClick={() => setTipCategory('')} className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${!tipCategory ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}>All</button>
              {tipCategories.map((c) => (
                <button key={c.key} onClick={() => setTipCategory(c.key)} className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${tipCategory === c.key ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}>
                  <c.icon size={12} /> {c.label}
                </button>
              ))}
            </div>

            {tipsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4"><Skeleton className="w-24 h-3 mb-2" /><Skeleton className="w-3/4 h-4 mb-2" /><Skeleton className="w-full h-3" /></div>)}</div>
            ) : tips.length === 0 ? (
              <div className="text-center py-16"><Lightbulb size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-500 dark:text-gray-400">No tips found</p></div>
            ) : (
              <div className="space-y-3">
                {tips.map((tip, i) => {
                  const Icon = tipIcons[tip.category] || Lightbulb;
                  return (
                    <motion.div key={tip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} className="rounded-2xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5"><Icon size={16} className="text-emerald-600 dark:text-emerald-400" /></div>
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${tip.category === 'tip_of_day' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' : tip.category === 'plant_hack' ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'}`}>
                              {tip.category === 'tip_of_day' ? 'Tip of the Day' : tip.category === 'plant_hack' ? 'Plant Hack' : 'Seasonal Alert'}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tip.title}</h3>
                            {tip.content && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tip.content}</p>}
                          </div>
                          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === 'weather' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Weather-based plant care alerts for your location.</p>
              <button onClick={fetchByGeo} disabled={weatherLoading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-50">
                {weatherLoading ? <Loader size={12} className="animate-spin" /> : <CloudRain size={12} />}
                Detect Location
              </button>
            </div>

            {weatherLoading ? (
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center"><Loader size={20} className="animate-spin text-emerald-500 mx-auto" /><p className="text-xs text-gray-400 mt-2">Checking weather...</p></div>
            ) : weather ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <Sun size={12} /> {weather.location} · {weather.temp}°C · Humidity {weather.humidity}%
                </div>
                {weather.alerts?.length > 0 ? weather.alerts.map((a, i) => {
                  const Icon = weatherIcons[a.icon] || AlertTriangle;
                  return (
                    <div key={i} className={`rounded-2xl border p-4 ${a.type === 'rain' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : a.type === 'heat' ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' : a.type === 'cold' ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-start gap-3">
                        <Icon size={20} className={`shrink-0 mt-0.5 ${a.type === 'rain' ? 'text-blue-500' : a.type === 'heat' ? 'text-orange-500' : a.type === 'cold' ? 'text-cyan-500' : 'text-gray-500'}`} />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{a.message}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700 p-4 text-center">
                    <CheckCircle size={24} className="text-emerald-500 mx-auto mb-1" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">All clear!</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">No weather alerts for your area right now.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
                <MapPin size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{weatherError || 'Click "Detect Location" to check weather alerts for your area.'}</p>
                <div className="flex items-center gap-2 max-w-xs mx-auto">
                  <input value={manualLat} onChange={(e) => setManualLat(e.target.value)} placeholder="Latitude" className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none" />
                  <input value={manualLng} onChange={(e) => setManualLng(e.target.value)} placeholder="Longitude" className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none" />
                  <button onClick={fetchManual} disabled={weatherLoading} className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50">Go</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}