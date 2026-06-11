import { useState, useEffect } from 'react';
import { Menu, Sprout, FileText, Leaf, Apple, Bug, Search, Coins, User, ChevronRight, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';
import Skeleton, { DashboardWelcomeSkeleton, GridCardSkeleton } from '../components/common/Skeleton';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmingTips, setFarmingTips] = useState([]);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(null);
  const [tipOpen, setTipOpen] = useState({});

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
                {farmingTips.slice(0, 9).map((tip, i) => {
                  const open = tipOpen[i];
                  return (
                  <div key={i} className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 overflow-hidden">
                    <button
                      onClick={() => setTipOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                    >
                      <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{tip.title}</h4>
                      {open ? <ChevronUp size={12} className="text-emerald-500 flex-shrink-0" /> : <ChevronDown size={12} className="text-emerald-500 flex-shrink-0" />}
                    </button>
                    {open && (
                      <div className="px-3 pb-3">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{tip.description}</p>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          </>
          )}
        </div>
      </main>
    </div>
  );
}
