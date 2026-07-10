import { useState, useEffect } from 'react';
import { Menu, Sprout, FileText, Leaf, Apple, Bug, Search, Coins, User, ChevronRight, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';
import Skeleton, { DashboardWelcomeSkeleton, GridCardSkeleton } from '../components/common/Skeleton';
import NearbyShops from '../components/common/NearbyShops';

function TipCard({ tip, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
      >
        <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{tip.title}</h4>
        {isOpen ? <ChevronUp size={12} className="text-emerald-500 flex-shrink-0" /> : <ChevronDown size={12} className="text-emerald-500 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{tip.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PlantWateringWidget({ userId }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null });
  const [preview, setPreview] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const fileRef = useRef(null);

  const load = useCallback(() => {
    if (!userId) return;
    api.plants.list(userId).then((list) => {
      setPlants(list);
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
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
  }, [userId]);

  useEffect(() => { load(); const id = setInterval(load, 60000); return () => clearInterval(id); }, [load]);

  const openEdit = (p) => {
    setEdit(p); setForm({ plant_name: p.plant_name, watering_time: p.watering_time || '08:00', interval_days: p.interval_days, image: null }); setPreview(p.image_url || '');
  };
  const resetForm = () => { setEdit(null); setShowAdd(false); setForm({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null }); setPreview(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.plant_name.trim()) return;
    try {
      if (edit) {
        await api.plants.update(edit.id, form);
      } else {
        await api.plants.add(userId, form.plant_name, form.image, form.watering_time, form.interval_days);
      }
      resetForm(); load();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plant?')) return;
    try { await api.plants.delete(id); load(); } catch {}
  };

  const handleWater = async (id) => {
    try { await api.plants.water(id); load(); } catch {}
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((p) => ({ ...p, image: f }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-sm";

  return (
    <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-emerald-200 dark:border-emerald-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Droplets size={16} className="text-blue-500" /> My Plants
        </h3>
        <button onClick={() => { setShowAdd(true); setEdit(null); setForm({ plant_name: '', watering_time: '08:00', interval_days: 1, image: null }); setPreview(''); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer">
          <Plus size={12} /> Add Plant
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(showAdd || edit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{edit ? 'Edit Plant' : 'Add Plant'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Plant Name</label>
                <input value={form.plant_name} onChange={(e) => setForm((p) => ({ ...p, plant_name: e.target.value }))} placeholder="e.g. Rose" className={inputClass} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Watering Time</label>
                  <input type="time" value={form.watering_time} onChange={(e) => setForm((p) => ({ ...p, watering_time: e.target.value }))} className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Interval (days)</label>
                  <input type="number" min="1" value={form.interval_days} onChange={(e) => setForm((p) => ({ ...p, interval_days: parseInt(e.target.value) || 1 }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image</label>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
                <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
                  {form.image ? form.image.name : 'Choose'}
                </button>
              </div>
              {preview && <img src={preview} alt="" className="w-20 h-20 rounded-lg object-cover" />}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 cursor-pointer">Save</button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plant List */}
      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1,2,3].map(i => <Skeleton key={i} className="w-36 h-40 shrink-0 rounded-xl" />)}
        </div>
      ) : plants.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No plants yet. Add your first plant!</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {plants.map((p) => {
            const needsWater = statusMap[p.id];
            return (
              <div key={p.id} className={`relative w-36 shrink-0 rounded-xl border-2 p-3 flex flex-col items-center text-center ${needsWater ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20' : 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'}`}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.plant_name} className="w-14 h-14 rounded-full object-cover mb-2" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                    <Sprout size={20} className="text-gray-400" />
                  </div>
                )}
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate w-full">{p.plant_name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{p.watering_time} · every {p.interval_days}d</p>
                <div className={`mt-2 w-3 h-3 rounded-full ${needsWater ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                {needsWater && (
                  <button onClick={() => handleWater(p.id)} className="mt-2 w-full px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-medium hover:bg-emerald-500 cursor-pointer">
                    I Watered
                  </button>
                )}
                <div className="absolute top-1 right-1 flex gap-0.5">
                  <button onClick={() => openEdit(p)} className="p-1 rounded bg-gray-800/60 text-gray-300 hover:text-white text-[10px] cursor-pointer"><Clock size={10} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 rounded bg-gray-800/60 text-red-400 hover:text-red-300 text-[10px] cursor-pointer"><Trash2 size={10} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmingTips, setFarmingTips] = useState([]);
  const [expandedTip, setExpandedTip] = useState(null);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        if (u.role === 'shop_owner') { navigate('/my-shop', { replace: true }); return; }
        api.farming.wallet(u.user_id).then((r) => setCoins(r.coins)).catch(() => {});
      } catch {}
    }

    async function fetchData() {
      const [tipsRes, agriRes] = await Promise.allSettled([
        api.farming.tips(),
        api.farming.agriTitles(),
      ]);

      const tips = tipsRes.status === 'fulfilled' && Array.isArray(tipsRes.value) ? tipsRes.value : [];
      const agri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];

      setFarmingTips(tips);
      setResources(agri);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="Dashboard" description="Your Farmlyt AI dashboard for managing crop predictions and detection history." url="/dashboard" noindex />
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-emerald-950/80 backdrop-blur border-b border-emerald-100 dark:border-emerald-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          {loading ? (
            <>
              <DashboardWelcomeSkeleton />
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-100 dark:border-gray-700">
                <Skeleton className="w-48 h-5 mb-4" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => <GridCardSkeleton key={i} />)}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-100 dark:border-gray-700">
                <Skeleton className="w-32 h-5 mb-3" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
                      <Skeleton className="w-3/4 h-4 mb-2" />
                      <Skeleton />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
          <>
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Welcome{user?.name ? `, ${user.name}` : ''}!</h2>
                  <p className="text-emerald-100/80 text-xs mt-0.5">Ready to detect and protect your crops</p>
                </div>
              </div>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 transition-colors">
                <Coins size={18} className="text-yellow-300" />
                <span className="text-sm font-bold text-white">{coins !== null ? coins : '...'}</span>
                <span className="text-[10px] text-emerald-100/70">coins</span>
              </Link>
            </div>
          </motion.div>

          {resources.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-emerald-200 dark:border-emerald-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" /> Agricultural Resources
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((agri, index) => (
                  <motion.div
                    key={agri.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/agriculture/${agri.id}`}
                      className="group block rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-0.5 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden rounded-t-xl mt-2 mb-2">
                        {agri.image_url ? (
                          <img src={agri.image_url} alt={agri.title} className="w-full h-36 object-contain bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-36 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                            <Sprout size={36} className="text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{agri.title}</h4>
                          <ArrowRight size={14} className="text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 line-clamp-1">AI-powered detection for {agri.title.toLowerCase()}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {farmingTips.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-emerald-200 dark:border-emerald-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sprout size={16} className="text-emerald-500" /> Farming Tips
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {farmingTips.slice(0, 9).map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    isOpen={expandedTip === tip.id}
                    onToggle={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <NearbyShops />
          </>
          )}
        </div>
      </main>
    </div>
  );
}
