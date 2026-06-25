import { useState, useEffect } from 'react';
import { Store, MapPin, ExternalLink, Loader } from 'lucide-react';
import api from '../../services/api';

export default function NearbyShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation not available'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await api.shops.nearby(pos.coords.latitude, pos.coords.longitude);
          setShops(data);
        } catch { setError('Could not fetch nearby shops'); }
        setLoading(false);
      },
      () => { setError('Location access denied'); setLoading(false); },
      { timeout: 10000 }
    );
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Loader size={12} className="animate-spin" /> Finding nearby shops...
    </div>
  );

  if (error) return null;

  if (shops.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden">
      <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
        <p className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Store size={13} className="text-emerald-500" /> Nearby Fertilizer Shops
        </p>
      </div>
      <div className="divide-y divide-emerald-100 dark:divide-emerald-700">
        {shops.map((s) => (
          <a
            key={s.id}
            href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            {s.photo_url ? (
              <img src={s.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Store size={18} className="text-emerald-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{s.shop_name}</p>
              {s.address && <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{s.address}</p>}
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={9} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{s.distance ? `${s.distance.toFixed(1)} km` : ''}</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
