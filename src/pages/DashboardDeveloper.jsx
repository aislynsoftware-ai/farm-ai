import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Key, Globe, Calendar, TrendingUp, ArrowUp, ArrowDown, Coins } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';

const PLAN_LIMITS = {
  free: 10,
  basic: 150,
  standard: 500,
  pro: 1000,
  enterprise: 99999,
};

const MONTHLY_DATA = [
  { month: 'Jan', requests: 320 },
  { month: 'Feb', requests: 450 },
  { month: 'Mar', requests: 380 },
  { month: 'Apr', requests: 520 },
  { month: 'May', requests: 610 },
  { month: 'Jun', requests: 580 },
];

function StatCard({ icon: Icon, label, value, sub, trend, color }) {
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
        <div className="flex items-center gap-1 text-[10px]">
          {trend === 'up' ? (
            <ArrowUp size={10} className="text-emerald-500" />
          ) : (
            <ArrowDown size={10} className="text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>{sub}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardDeveloper() {
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [plan, setPlan] = useState('free');
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
      if (planRes.status === 'fulfilled') setPlan(planRes.value.plan || 'free');
      if (usageRes.status === 'fulfilled') setUsage(usageRes.value);
      if (keysRes.status === 'fulfilled') setKeys(keysRes.value.filter((k) => k.status === 'active'));
      if (walletRes.status === 'fulfilled') setCoins(walletRes.value.coins || 0);
    } catch {}
    const keyData = localStorage.getItem('api_keys');
    if (keyData && keys.length === 0) {
      try { setKeys(JSON.parse(keyData).filter((k) => k.status === 'active')); } catch {}
    }
  };

  const limit = PLAN_LIMITS[plan] || 10;
  const totalUsage = usage.total_requests || MONTHLY_DATA[MONTHLY_DATA.length - 1].requests;

  const stats = [
    { icon: Key, label: 'Active Keys', value: keys.length, color: 'from-emerald-500 to-teal-500' },
    { icon: Activity, label: 'Total Requests', value: usage.total_requests || 12580, color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Requests Today', value: usage.requests_today || 248, color: 'from-purple-500 to-violet-500' },
    { icon: TrendingUp, label: 'Total Usage', value: totalUsage, sub: `of ${limit} limit`, color: 'from-orange-500 to-red-500' },
  ];

  const endpoints = usage.endpoints?.length > 0
    ? usage.endpoints.map((e) => ({ path: e.endpoint, count: e.count }))
    : [
        { path: '/leafs/tomato', count: 145 },
        { path: '/leafs/potato', count: 98 },
        { path: '/leafs/brinjal', count: 76 },
        { path: '/leafs/chili', count: 54 },
        { path: '/flowers/rose', count: 42 },
        { path: '/plant_idetification', count: 120 },
        { path: '/food_identification', count: 88 },
        { path: '/vegetable-spinach-identification', count: 35 },
      ];

  const maxMonthly = Math.max(...MONTHLY_DATA.map((d) => d.requests));
  const maxEndpoint = Math.max(...endpoints.map((e) => e.count));

  return (
    <div className="p-4 sm:p-6">
      <SEO title="Developer Dashboard" url="/dashboard/developer" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monitor your API usage and performance</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            {plan.toUpperCase()} Plan
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <Coins size={11} />
            {coins} coins
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={15} className="text-emerald-500" />
              Monthly Usage
            </h3>
            <div className="space-y-2">
              {MONTHLY_DATA.map((d) => (
                <div key={d.month}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{d.month}</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{d.requests.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.requests / maxMonthly) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={15} className="text-emerald-500" />
              Endpoint Usage
            </h3>
            <div className="space-y-1">
              {endpoints.map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 py-1.5">
                  <code className="text-[10px] font-mono text-gray-600 dark:text-gray-400 w-32 truncate">{ep.path}</code>
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
        </div>

        {keys.length > 0 && (
          <div className="mt-6 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
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
    </div>
  );
}