import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Key, Globe, Calendar, TrendingUp, Coins, Menu } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
      </div>
      {sub && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</div>
      )}
    </motion.div>
  );
}

export default function DashboardDeveloper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [plan, setPlan] = useState('free');
  const [planLimit, setPlanLimit] = useState(10);
  const [usage, setUsage] = useState({ total_requests: 0, requests_today: 0, endpoints: [] });
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      setUser(u);
      loadData(u.user_id);
    } catch {}
  }, []);

  const loadData = async (userId) => {
    try {
      const [planRes, usageRes, keysRes, walletRes] = await Promise.allSettled([
        api.plan.get(userId),
        api.apiKeys.usage(userId),
        api.apiKeys.list(userId).catch(() => []),
        api.farming.wallet(userId),
      ]);
      if (planRes.status === 'fulfilled') { setPlan(planRes.value.plan || 'free'); setPlanLimit(planRes.value.limit || 10); }
      if (usageRes.status === 'fulfilled') setUsage(usageRes.value);
      if (keysRes.status === 'fulfilled') setKeys(keysRes.value.filter((k) => k.status === 'active'));
      if (walletRes.status === 'fulfilled') setCoins(walletRes.value.coins || 0);
    } catch {}
    const keyData = localStorage.getItem('api_keys');
    if (keyData && keys.length === 0) {
      try { setKeys(JSON.parse(keyData).filter((k) => k.status === 'active')); } catch {}
    }
  };

  const limit = planLimit;
  const used = usage.total_requests || 0;
  const remaining = Math.max(limit - used, 0);

  const stats = [
    { icon: Key, label: 'Active Keys', value: keys.length, color: 'from-emerald-500 to-teal-500' },
    { icon: Activity, label: 'Total Requests', value: used, color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Requests Today', value: usage.requests_today || 0, color: 'from-purple-500 to-violet-500' },
    { icon: TrendingUp, label: 'Remaining', value: remaining, sub: `of ${limit} limit`, color: 'from-orange-500 to-red-500' },
  ];

  const endpoints = usage.endpoints?.length > 0
    ? usage.endpoints.map((e) => ({ path: e.endpoint, count: e.count }))
    : [];

  const maxEndpoint = Math.max(...endpoints.map((e) => e.count), 1);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="Developer Dashboard" url="/dashboard/developer" />
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Developer</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          {/* Greeting card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white">Developer Dashboard</h2>
                  <p className="text-emerald-100/80 text-xs mt-0.5">Monitor your API usage and performance</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur">
                  <Coins size={14} className="text-yellow-300" />
                  <span className="text-sm font-bold text-white">{coins !== null ? coins : '...'}</span>
                  <span className="text-[10px] text-emerald-100/70">coins</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur text-[11px] font-medium text-emerald-100">
                  {plan ? plan.toUpperCase() : 'FREE'} · {remaining} remaining
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Endpoint Usage */}
          {endpoints.length > 0 && (
            <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe size={15} className="text-emerald-500" />
                Endpoint Usage
              </h3>
              <div className="space-y-1">
                {endpoints.map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 py-1.5 min-w-0">
                    <code className="text-[10px] font-mono text-gray-600 dark:text-gray-400 w-24 sm:w-32 truncate shrink-0">{ep.path}</code>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(ep.count / maxEndpoint) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 w-10 text-right">{ep.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active API Keys */}
          {keys.length > 0 && (
            <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Key size={15} className="text-emerald-500" />
                Active API Keys
              </h3>
              <div className="space-y-2">
                {keys.map((k) => (
                  <div key={k.id} className="flex items-center gap-3 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <code className="flex-1 font-mono text-gray-600 dark:text-gray-400">
                      {(k.api_key || '').slice(0, 12)}••••••••••
                    </code>
                    <span className="text-gray-400">{k.created_at ? new Date(k.created_at).toLocaleDateString() : '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
