import { useState, useEffect } from 'react';
import { Download, AlertCircle, Search, Sprout, ChevronDown, ChevronUp } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminSoilPredictionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => api.admin.getSoilPredictions().then((data) => {
    setItems(data);
    setFiltered(data);
  }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = items.filter((i) =>
        (i.best_crop?.toLowerCase().includes(q)) ||
        (i.user_id?.toLowerCase().includes(q)) ||
        String(i.id).includes(q)
      );
    }
    setFiltered(result);
  }, [search, items]);

  const handleDownload = () => {
    const token = localStorage.getItem('admin_token');
    const url = api.admin.getSoilDownloadUrl();
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error('Download failed'); return res.blob(); })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'soil_predictions.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => alert(err.message));
  };

  const levelColor = (level) => {
    if (level === 'Ideal' || level === 'Ideal Range') return 'text-emerald-600 dark:text-emerald-400';
    if (level === 'Low' || level === 'Slightly Acidic' || level === 'Slightly Alkaline') return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Soil Predictions</h2>
        <button onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer">
          <Download size={14} /> CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, user, ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const analysis = p.soil_analysis || {};
            const topCrops = p.top_crops || [];
            return (
              <div key={p.id} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Sprout size={14} className="text-emerald-500" />
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{p.best_crop || 'N/A'}</p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{p.best_confidence}%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        ID {p.id} | User: {p.user_id || '—'} | {p.created_at || ''}
                      </p>
                    </div>
                    <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                      {expanded === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {expanded === p.id && (
                    <div className="mt-4 space-y-4">
                      {/* Soil Parameters Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {[{label:'Temp',val:p.temperature},{label:'Moisture',val:p.moisture},{label:'EC',val:p.ec},{label:'pH',val:p.ph},
                          {label:'N',val:p.nitrogen},{label:'P',val:p.phosphorus},{label:'K',val:p.potassium},{label:'Humidity',val:p.humidity},
                          {label:'Rainfall',val:p.rainfall}].map((f) => (
                          <div key={f.label} className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-2 text-center border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{f.label}</p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{f.val || '—'}</p>
                          </div>
                        ))}
                      </div>

                      {/* Soil Analysis Levels */}
                      {Object.keys(analysis).filter(k => k !== '_summary').length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white mb-2">Soil Analysis</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {Object.entries(analysis).filter(([k]) => k !== '_summary').map(([key, val]) => (
                              <div key={key} className={`rounded-lg p-2 text-center border ${val.level === 'Ideal' || val.level === 'Ideal Range' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : val.level === 'Low' || val.level?.includes('Acidic') || val.level?.includes('Alkaline') ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">{key}</p>
                                <p className={`text-[11px] font-bold ${levelColor(val.level)}`}>{val.level}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Crops */}
                      {topCrops.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white mb-2">Top 5 Recommended</p>
                          <div className="flex flex-wrap gap-1.5">
                            {topCrops.slice(0, 5).map((c, i) => (
                              <span key={i} className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {c.crop} ({c.confidence}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {analysis._summary && (
                        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800">
                          <p className="text-[10px] font-bold text-gray-900 dark:text-white mb-1">Summary</p>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 whitespace-pre-line">{analysis._summary}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="p-6 text-center text-emerald-500 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">No soil predictions found</div>
          )}
        </div>
      )}
    </div>
  );
}
