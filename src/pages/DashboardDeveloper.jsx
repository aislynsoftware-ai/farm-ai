import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Key, Globe, Calendar, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';

const ENDPOINTS = [
  { path: '/leafs/tomato', count: 145 },
  { path: '/leafs/potato', count: 98 },
  { path: '/leafs/brinjal', count: 76 },
  { path: '/leafs/chili', count: 54 },
  { path: '/flowers/rose', count: 42 },
  { path: '/plant_idetification', count: 120 },
  { path: '/food_identification', count: 88 },
  { path: '/vegetable-spinach-identification', count: 35 },
];

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
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
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

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const keyData = localStorage.getItem('api_keys');
    if (keyData) {
      try { setKeys(JSON.parse(keyData).filter((k) => k.status === 'active')); } catch {}
    }
  }, []);

  const stats = [
    { icon: Key, label: 'Active Keys', value: keys.length, color: 'from-emerald-500 to-teal-500' },
    { icon: Activity, label: 'Total Requests', value: 12580, sub: '+12% this month', trend: 'up', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Requests Today', value: 248, sub: '+8% vs yesterday', trend: 'up', color: 'from-purple-500 to-violet-500' },
    { icon: TrendingUp, label: 'Monthly Usage', value: 1620, sub: 'of 2000 limit', trend: 'up', color: 'from-orange-500 to-red-500' },
  ];

  const maxMonthly = Math.max(...MONTHLY_DATA.map((d) => d.requests));

  return (
    <div className="p-4 sm:p-6">
      <SEO title="Developer Dashboard" url="/dashboard/developer" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monitor your API usage and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Usage Chart */}
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

          {/* Endpoint Usage */}
          <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={15} className="text-emerald-500" />
              Endpoint Usage
            </h3>
            <div className="space-y-1">
              {ENDPOINTS.map((ep) => {
                const maxCount = Math.max(...ENDPOINTS.map((e) => e.count));
                return (
                  <div key={ep.path} className="flex items-center gap-3 py-1.5">
                    <code className="text-[10px] font-mono text-gray-600 dark:text-gray-400 w-32 truncate">{ep.path}</code>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(ep.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 w-10 text-right">{ep.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* API Key Quick View */}
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
                    {k.api_key.slice(0, 12)}••••••••••
                  </code>
                  <span className="text-gray-400">{new Date(k.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
