import { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Sun, Snowflake, Droplets, X, Loader } from 'lucide-react';
import api from '../../services/api';

const icons = {
  'cloud-rain': CloudRain,
  'sun': Sun,
  'snowflake': Snowflake,
  'droplets': Droplets,
};

export default function WeatherAlert({ className = '' }) {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api.weather.alert(pos.coords.latitude, pos.coords.longitude)
          .then((data) => {
            if (data?.alerts?.length) setAlert(data.alerts[0]);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      },
      () => setLoading(false),
      { timeout: 5000 }
    );
  }, []);

  if (loading || dismissed || !alert) return null;

  const Icon = icons[alert.icon] || AlertTriangle;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${
      alert.type === 'rain' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' :
      alert.type === 'heat' ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' :
      alert.type === 'cold' ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800' :
      'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    } ${className}`}>
      <Icon size={18} className={
        alert.type === 'rain' ? 'text-blue-500 shrink-0 mt-0.5' :
        alert.type === 'heat' ? 'text-orange-500 shrink-0 mt-0.5' :
        alert.type === 'cold' ? 'text-cyan-500 shrink-0 mt-0.5' :
        'text-gray-500 shrink-0 mt-0.5'
      } />
      <p className="flex-1 text-xs text-gray-700 dark:text-gray-300">{alert.message}</p>
      <button onClick={() => setDismissed(true)} className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}