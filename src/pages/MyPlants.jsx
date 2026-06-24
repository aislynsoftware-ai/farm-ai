import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Trash2, Clock, X, Sprout, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Sidebar from '../components/dashboard/Sidebar';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function MyPlants() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null });
  const [preview, setPreview] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored || !localStorage.getItem('token')) { navigate('/login', { replace: true }); return; }
    try {
      const u = JSON.parse(stored);
      setUser(u);
    } catch { navigate('/login', { replace: true }); }
  }, [navigate]);

  const load = useCallback(() => {
    if (!user?.user_id) return;
    api.plants.list(user.user_id).then((list) => {
      setPlants(list);
      const now = new Date();
      const map = {};
      list.forEach((p) => {
        const last = p.last_watered_at ? new Date(p.last_watered_at) : null;
        let needsWater = true;
        if (last) {
          const next = new Date(last);
          next.setDate(next.getDate() + p.interval_days);
          const [h, m] = (p.watering_time || '08:00').split(':').map(Number);
          next.setHours(h, m, 0, 0);
          needsWater = next <= now;
        }
        map[p.id] = needsWater;
      });
      setStatusMap(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user?.user_id]);

  useEffect(() => { if (user) { load(); const id = setInterval(load, 60000); return () => clearInterval(id); } }, [user, load]);

  const show = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const openEdit = (p) => {
    setEdit(p); setForm({ plant_name: p.plant_name, watering_time: p.watering_time || '08:00', interval_days: p.interval_days, image: null }); setPreview(p.image_url || '');
  };
  const resetForm = () => { setEdit(null); setShowAdd(false); setForm({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null }); setPreview(''); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.plant_name.trim()) { setError('Plant name required'); return; }
    try {
      if (edit) {
        await api.plants.update(edit.id, form);
        show('Updated');
      } else {
        await api.plants.add(user.user_id, form.plant_name, form.image, form.watering_time, form.interval_days);
        show('Added');
      }
      resetForm(); load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plant?')) return;
    try { await api.plants.delete(id); show('Deleted'); load(); } catch {}
  };

  const handleWater = async (id) => {
    try { await api.plants.water(id); show('Watered!'); load(); } catch {}
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((p) => ({ ...p, image: f }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="My Plants" description="Manage your plant watering schedule" url="/my-plants" />
        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          <motion.div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">My Plants</h2>
                  <p className="text-emerald-100/80 text-xs mt-0.5">Track watering schedule for your plants</p>
                </div>
              </div>
              <button onClick={() => { setShowAdd(true); setEdit(null); setForm({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null }); setPreview(''); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 text-white text-sm font-medium transition-all cursor-pointer">
                <Plus size={16} /> Add Plant
              </button>
            </div>
          </motion.div>

          {success && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700"><CheckCircle size={14} className="text-emerald-600" /><p className="text-xs text-emerald-700">{success}</p></div>}
          {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-700"><AlertCircle size={14} className="text-red-600" /><p className="text-xs text-red-700">{error}</p></div>}

          {(showAdd || edit) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{edit ? 'Edit Plant' : 'Add Plant'}</h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"><X size={18} /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Plant Name</label>
                    <input value={form.plant_name} onChange={(e) => setForm((p) => ({ ...p, plant_name: e.target.value }))} placeholder="e.g. Rose" className={inputClass} />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Watering Time</label>
                      <input type="time" value={form.watering_time} onChange={(e) => setForm((p) => ({ ...p, watering_time: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Interval (days)</label>
                      <input type="number" min="1" value={form.interval_days} onChange={(e) => setForm((p) => ({ ...p, interval_days: parseInt(e.target.value) || 1 }))} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Image</label>
                    <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
                    <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                      {form.image ? form.image.name : 'Choose'}
                    </button>
                  </div>
                  {preview && <img src={preview} alt="" className="w-20 h-20 rounded-lg object-cover" />}
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 cursor-pointer">Save</button>
                    <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : plants.length === 0 ? (
            <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Sprout size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No plants yet</p>
              <button onClick={() => { setShowAdd(true); }} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 cursor-pointer">Add Your First Plant</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {plants.map((p) => {
                const needsWater = statusMap[p.id];
                return (
                  <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`relative rounded-2xl border-2 p-4 flex flex-col items-center text-center ${needsWater ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-gray-800' : 'border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800'}`}>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-emerald-600 cursor-pointer"><Clock size={12} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-red-500 hover:text-white hover:bg-red-600 cursor-pointer"><Trash2 size={12} /></button>
                    </div>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.plant_name} className="w-16 h-16 rounded-full object-cover mb-3 mt-2" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 mt-2">
                        <Sprout size={24} className="text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate w-full">{p.plant_name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{p.watering_time} · every {p.interval_days}d</p>
                    <div className={`mt-3 w-4 h-4 rounded-full ${needsWater ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {needsWater && (
                      <button onClick={() => handleWater(p.id)} className="mt-3 w-full px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition-all cursor-pointer">
                        I Watered
                      </button>
                    )}
                    {!needsWater && (
                      <p className="mt-3 text-[10px] text-emerald-600">Watered ✓</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
