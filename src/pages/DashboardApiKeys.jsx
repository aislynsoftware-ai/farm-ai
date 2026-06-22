import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, RefreshCw, XCircle, Plus, Eye, EyeOff, Clock, Menu, Coins } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';

function maskKey(key) {
  if (!key || key.length < 12) return key;
  return key.slice(0, 12) + '••••••••••••';
}

export default function DashboardApiKeys() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [revealedIdx, setRevealedIdx] = useState(null);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        loadPlan(u.user_id);
        loadKeys(u.user_id);
        loadCoins(u.user_id);
      } catch { setLoading(false); }
    } else {
      setLoading(false);
    }
  }, []);

  const loadPlan = async (userId) => {
    try { const res = await api.plan.get(userId); setPlan(res.plan); } catch { setPlan('free'); }
  };

  const loadCoins = async (userId) => {
    try { const res = await api.farming.wallet(userId); setCoins(res.coins); } catch {}
  };

  const loadKeys = async (userId) => {
    setLoading(true); setError(null);
    try { setKeys(await api.apiKeys.list(userId)); } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const createKey = async () => {
    if (!user) return;
    setCreating(true); setError(null);
    try { const newKey = await api.apiKeys.create(user.user_id); setKeys((prev) => [newKey, ...prev]); } catch (e) { setError(e.message); }
    setCreating(false);
  };

  const revokeKey = async (id) => {
    if (!user) return;
    try {
      await api.apiKeys.revoke(id, user.user_id);
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
    } catch (e) { setError(e.message); }
  };

  const regenerateKey = async (id) => {
    if (!user) return;
    try {
      const res = await api.apiKeys.regenerate(id, user.user_id);
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, api_key: res.api_key, status: 'active' } : k)));
    } catch (e) { setError(e.message); }
  };

  const copyKey = (key, idx) => {
    navigator.clipboard.writeText(key);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700';
      case 'revoked': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const requestLimit = plan === 'free' ? 10 : plan === 'basic' || plan === 'BASIC' ? 150 : plan === 'standard' || plan === 'STANDARD' ? 500 : plan === 'pro' || plan === 'PRO' ? 1000 : 99999;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 mt-10">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="API Keys" url="/dashboard/api-keys" />
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">API Keys</span>
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
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Key size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">API Keys</h2>
                <p className="text-emerald-100/80 text-xs mt-0.5">Manage your API keys for programmatic access</p>
                {user && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(user.user_id); }}
                    className="text-emerald-100/60 text-[10px] mt-1 hover:text-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                    title="Click to copy"
                  >
                    User ID: {user.user_id}
                    <Copy size={9} className="opacity-60" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur">
                  <Coins size={14} className="text-yellow-300" />
                  <span className="text-sm font-bold text-white">{coins !== null ? coins : '...'}</span>
                  <span className="text-[10px] text-emerald-100/70">coins</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur text-[11px] font-medium text-emerald-100">
                  {plan ? plan.toUpperCase() : 'FREE'} · {requestLimit} total
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <motion.div
              className="text-center py-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Key size={40} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No API Keys Yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Generate your first API key to start integrating Farmlyt AI models into your application.</p>
              <button
                onClick={createKey}
                disabled={creating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                <Plus size={14} />
                {creating ? 'Creating...' : 'Create New API Key'}
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">{keys.length} key{keys.length > 1 ? 's' : ''}</p>
                <button
                  onClick={createKey}
                  disabled={creating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  <Plus size={14} />
                  {creating ? 'Creating...' : 'Create New Key'}
                </button>
              </div>

              <div className="space-y-3">
                {keys.map((k, idx) => (
                  <motion.div
                    key={k.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-emerald-500" />
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getStatusColor(k.status)}`}>
                          {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {k.status === 'active' ? (
                          <>
                            <button
                              onClick={() => regenerateKey(k.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer"
                              title="Regenerate"
                            >
                              <RefreshCw size={13} />
                            </button>
                            <button
                              onClick={() => revokeKey(k.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                              title="Revoke"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={createKey}
                            disabled={creating}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer disabled:opacity-50"
                            title="Create New API Key"
                          >
                            <Plus size={12} />
                            {creating ? '...' : 'Create New'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="flex-1 text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 select-all">
                        {revealedIdx === idx ? k.api_key : maskKey(k.api_key)}
                      </code>
                      <button
                        onClick={() => setRevealedIdx(revealedIdx === idx ? null : idx)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                        title={revealedIdx === idx ? 'Hide' : 'Show'}
                      >
                        {revealedIdx === idx ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyKey(k.api_key, idx)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          copiedIdx === idx
                            ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                        }`}
                        title="Copy"
                      >
                        {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
                      <span>Created: {k.created_at ? new Date(k.created_at).toLocaleDateString() : '-'}</span>
                      {k.last_used && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Last used: {new Date(k.last_used).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}