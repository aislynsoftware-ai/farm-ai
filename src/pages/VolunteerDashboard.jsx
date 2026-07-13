import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Camera, Users, Store, ChevronRight, TrendingUp, History, RotateCcw, ArrowUpRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    Promise.all([
      api.volunteer.profile(u.user_id),
      api.volunteer.earnings(u.user_id),
    ]).then(([p, e]) => {
      setProfile(p);
      setEarnings(e.earnings || []);
    }).catch(() => navigate('/earn')).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalEarnings = profile?.total_earnings || 0;
  const canRecharge = totalEarnings >= 100;
  const canWithdraw = totalEarnings >= 1000;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 py-8 px-4">
      <SEO title="Volunteer Dashboard" description="Your volunteer earnings dashboard" url="/volunteer-dashboard" />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Volunteer Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Referral Code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{profile?.referral_code}</span></p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-5">
            <DollarSign size={20} className="text-emerald-500 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEarnings.toFixed(2)}</p>
            <p className="text-[10px] text-gray-500">Total Earnings (rs)</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-5">
            <TrendingUp size={20} className="text-blue-500 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.images_approved || 0}</p>
            <p className="text-[10px] text-gray-500">Images Approved</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link to="/volunteer-upload" className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 transition-all">
            <Camera size={22} className="text-blue-500" />
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Upload</span>
          </Link>
          <Link to="/volunteer-refer" className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 transition-all">
            <Users size={22} className="text-green-500" />
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Refer</span>
          </Link>
          <Link to="/volunteer-withdraw" className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 transition-all">
            <ArrowUpRight size={22} className="text-purple-500" />
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Withdraw</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><RotateCcw size={14} className="text-emerald-500" />Quick Actions</h3>
          <div className="space-y-2">
            <Link to={canRecharge ? '#' : '#'} onClick={(e) => { if (!canRecharge) e.preventDefault(); else navigate('/volunteer-withdraw'); }} className={`flex items-center justify-between p-3 rounded-xl border ${canRecharge ? 'border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'border-gray-100 dark:border-gray-700 opacity-50'} transition-colors`}>
              <div className="flex items-center gap-2">
                <Store size={16} className="text-emerald-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Recharge ({canRecharge ? 'Available' : `Need ${(100 - totalEarnings).toFixed(2)} more rs`})</span>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
            </Link>
            <Link to={canWithdraw ? '/volunteer-withdraw' : '#'} onClick={(e) => { if (!canWithdraw) e.preventDefault(); }} className={`flex items-center justify-between p-3 rounded-xl border ${canWithdraw ? 'border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'border-gray-100 dark:border-gray-700 opacity-50'} transition-colors`}>
              <div className="flex items-center gap-2">
                <ArrowUpRight size={16} className="text-purple-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Withdraw ({canWithdraw ? 'Available' : `Need ${(1000 - totalEarnings).toFixed(2)} more rs`})</span>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><History size={14} className="text-emerald-500" />Earnings History</h3>
          {earnings.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No earnings yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {earnings.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{e.type.replace('_', ' ')}</p>
                    <p className="text-[10px] text-gray-400">{e.description || ''}</p>
                    <p className="text-[10px] text-gray-400">{new Date(e.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold ${e.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{e.amount > 0 ? '+' : ''}{e.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}