import { useState, useEffect } from 'react';
import { Trash2, Download, AlertCircle, CheckCircle, ExternalLink, ImageIcon, Search } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

const CATEGORIES = ['All', 'leaf', 'vegetable', 'fruit', 'flower', 'potted_plant', 'plant_id', 'food'];

export default function AdminPredictionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => api.admin.getLeafPredictions().then((data) => {
    setItems(data);
    setFiltered(data);
  }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = items;
    if (category !== 'All') {
      result = result.filter((i) => i.crop?.toLowerCase().includes(category.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        (i.crop?.toLowerCase().includes(q)) ||
        (i.disease?.toLowerCase().includes(q)) ||
        (i.user_id?.toLowerCase().includes(q)) ||
        (i.prediction?.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [category, search, items]);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this prediction?')) return;
    try { await api.admin.deleteLeafPrediction(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const downloadImage = async (url, filename) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-900 dark:text-white">Predictions</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${category === c ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-800/30'}`}
            >
              {c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, disease, user..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-white placeholder-emerald-500 text-sm"
          />
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-400">{filtered.length} results</span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {loading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-36" />) : filtered.map((p) => (
          <div key={p.id} className="rounded-xl bg-white dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              {/* Images */}
              <div className="flex gap-3">
                <div className="relative">
                  {p.original_image ? (
                    <img src={p.original_image} alt="" className="w-28 h-28 rounded-lg object-cover" />
                  ) : (
                    <div className="w-28 h-28 rounded-lg bg-emerald-50 dark:bg-emerald-800 flex items-center justify-center"><ImageIcon size={24} className="text-emerald-500" /></div>
                  )}
                  <button onClick={() => downloadImage(p.original_image, `original_${p.id}`)} className="absolute top-1 right-1 p-1 rounded bg-black/50 text-white hover:bg-black/70 cursor-pointer"><Download size={12} /></button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white">Original</span>
                </div>
                <div className="relative">
                  {p.predicted_image ? (
                    <img src={p.predicted_image} alt="" className="w-28 h-28 rounded-lg object-cover" />
                  ) : (
                    <div className="w-28 h-28 rounded-lg bg-emerald-50 dark:bg-emerald-800 flex items-center justify-center"><ImageIcon size={24} className="text-emerald-500" /></div>
                  )}
                  <button onClick={() => downloadImage(p.predicted_image, `predicted_${p.id}`)} className="absolute top-1 right-1 p-1 rounded bg-black/50 text-white hover:bg-black/70 cursor-pointer"><Download size={12} /></button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white">Predicted</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-emerald-900 dark:text-white capitalize">{p.crop || 'Unknown'}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {p.user_id && <span className="font-mono">{p.user_id}</span>}
                      {p.created_at && <span className="ml-2">{p.created_at}</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-800 text-red-400 hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer"><Trash2 size={12} /></button>
                    <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer text-xs">{(expanded === p.id ? 'Less' : 'More')}</button>
                  </div>
                </div>
                {p.prediction && (
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${p.prediction === 'Healthy' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {p.prediction}
                  </span>
                )}
                {expanded === p.id && (
                  <div className="mt-3 space-y-2 text-xs text-emerald-600 dark:text-emerald-400">
                    {p.disease && <p><span className="text-emerald-500">Disease:</span> {p.disease}</p>}
                    {p.fertilizers?.length > 0 && <p><span className="text-emerald-500">Fertilizers:</span> {p.fertilizers.join(', ')}</p>}
                    {p.pesticides?.length > 0 && <p><span className="text-emerald-500">Pesticides:</span> {p.pesticides.join(', ')}</p>}
                    {p.care_points?.length > 0 && <p><span className="text-emerald-500">Care:</span> {p.care_points.join(', ')}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <div className="p-6 text-center text-emerald-500 rounded-xl bg-white dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700">No predictions found</div>}
      </div>
    </div>
  );
}
