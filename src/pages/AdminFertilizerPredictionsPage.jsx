import { useState, useEffect } from 'react';
import { Download, Search, Sprout, ChevronDown, ChevronUp } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminFertilizerPredictionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => api.admin.getFertilizerPredictions().then((data) => {
    setItems(data);
    setFiltered(data);
  }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = items.filter((i) =>
        i.recommended_fertilizer?.toLowerCase().includes(q) ||
        i.crop_name?.toLowerCase().includes(q) ||
        i.soil_type?.toLowerCase().includes(q) ||
        i.user_id?.toLowerCase().includes(q) ||
        String(i.id).includes(q)
      );
    }
    setFiltered(result);
  }, [search, items]);

  const handleDownload = () => {
    const token = localStorage.getItem('admin_token');
    fetch(api.admin.getFertilizerDownloadUrl(), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!r.ok) throw new Error('Download failed'); return r.blob(); })
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fertilizer_predictions.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fertilizer Predictions</h2>
        <button onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer">
          <Download size={14} /> CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fertilizer, crop, soil, user..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Sprout size={14} className="text-emerald-500" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{p.recommended_fertilizer || 'N/A'}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      ID {p.id} | Crop: {p.crop_name || '—'} | Soil: {p.soil_type || '—'} | User: {p.user_id || '—'} | {p.created_at || ''}
                    </p>
                  </div>
                  <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                    {expanded === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {expanded === p.id && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {[{label:'Temp',val:p.temperature},{label:'Moisture',val:p.moisture},{label:'EC',val:p.ec},{label:'pH',val:p.ph},
                      {label:'N',val:p.nitrogen},{label:'P',val:p.phosphorus},{label:'K',val:p.potassium}].map((f) => (
                      <div key={f.label} className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-2 text-center border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{f.label}</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{f.val || '—'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="p-6 text-center text-emerald-500 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">No fertilizer predictions found</div>
          )}
        </div>
      )}
    </div>
  );
}
