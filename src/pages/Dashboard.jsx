import { useState, useEffect } from 'react';
import { Menu, Sprout, FileText, Leaf, Apple, Bug, Search, Coins, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmingTips, setFarmingTips] = useState([]);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        api.farming.wallet(u.user_id).then((r) => setCoins(r.coins)).catch(() => {});
      } catch {}
    }

    async function fetchData() {
      const [tipsRes, agriRes, cropsRes, subsRes] = await Promise.allSettled([
        api.farming.tips(),
        api.farming.agriTitles(),
        api.farming.allCrops(),
        api.farming.crops(),
      ]);

      const tips = tipsRes.status === 'fulfilled' && Array.isArray(tipsRes.value) ? tipsRes.value : [];
      const agri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
      const allCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
      const subs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];

      setFarmingTips(tips);
      setResources(agri.map((a) => ({
        ...a,
        crops: allCrops.filter((c) => Number(c.agri_id) === Number(a.id)).map((c) => ({
          ...c,
          subs: subs.filter((s) => Number(s.crop_id) === Number(c.id)),
        })),
      })));
    }
    fetchData();
  }, []);

  const quickActions = [
    { label: 'Disease Detection', path: '/predict', icon: Bug, color: 'from-emerald-500 to-green-600' },
    { label: 'Plant Identification', path: '/predict?type=plant', icon: Leaf, color: 'from-blue-500 to-indigo-600' },
    { label: 'Food Identification', path: '/predict?type=food', icon: Apple, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          {/* Welcome Banner with Coins */}
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

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                  <action.icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold">{action.label}</p>
                  <p className="text-[10px] text-white/70">Upload & Detect</p>
                </div>
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </Link>
            ))}
          </div>

          {/* Agricultural Resources with sub-crop links */}
          {resources.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" /> Agricultural Resources
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((agri) => (
                  <div key={agri.id} className="rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <Link to={`/agriculture/${agri.id}`}>
                      {agri.image_url ? (
                        <img src={agri.image_url} alt={agri.title} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30">
                          <Sprout size={32} className="text-emerald-400" />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{agri.title}</h4>
                      </div>
                    </Link>
                    <div className="px-3 pb-3 space-y-0.5">
                      {agri.crops.map((crop) => (
                        <div key={crop.id}>
                          {crop.subs.length > 0 ? (
                            crop.subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/crop/${sub.id}`}
                                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
                              >
                                {sub.image_url ? (
                                  <img src={sub.image_url} alt={sub.title} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <Sprout size={10} className="text-emerald-500 flex-shrink-0" />
                                )}
                                <span className="text-[11px] text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 flex-1 truncate">{sub.title}</span>
                                <ChevronRight size={8} className="text-gray-300 group-hover:text-emerald-400 flex-shrink-0" />
                              </Link>
                            ))
                          ) : (
                            <Link to="/predict" className="flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] hover:bg-emerald-100 transition-colors">
                              <Search size={10} /> Detect
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Farming Tips */}
          {farmingTips.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sprout size={16} className="text-emerald-500" /> Farming Tips
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {farmingTips.slice(0, 9).map((tip, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{tip.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
