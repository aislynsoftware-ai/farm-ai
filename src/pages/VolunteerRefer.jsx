import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Store, Copy, Share2, Loader, CheckCircle, ExternalLink } from 'lucide-react';
import SEO from '../components/common/SEO';
import api from '../services/api';

export default function VolunteerRefer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    api.volunteer.referralStats(u.user_id).then(setStats).catch(() => navigate('/earn')).finally(() => setLoading(false));
  }, []);

  const referralLink = stats ? `${window.location.origin}/earn?ref=${stats.referral_code}` : '';
  const registerLink = stats ? `${window.location.origin}/register-shop?ref=${stats.referral_code}` : '';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 py-8 px-4">
      <SEO title="Refer & Earn" description="Refer friends and earn rewards" url="/volunteer-refer" />
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Refer & Earn</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Share your referral code and earn rewards</p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 text-center mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Referral Code</p>
            <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{stats?.referral_code}</p>
            <button onClick={() => copyToClipboard(stats?.referral_code || '')} className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
              <Copy size={12} /> {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="grid gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Refer Members</h3>
                  <p className="text-xs text-gray-500">50rs per referral</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Share this link with friends to invite them to join as volunteers:</p>
              <div className="flex gap-2">
                <input readOnly value={referralLink} className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600" />
                <button onClick={() => copyToClipboard(referralLink)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer"><Copy size={14} /></button>
              </div>
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20">
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Referred: {stats?.member_referrals?.length || 0} members</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Store size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Refer Shop Owners</h3>
                  <p className="text-xs text-gray-500">200rs per approved shop</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Share this link with shop owners to register:</p>
              <div className="flex gap-2">
                <input readOnly value={registerLink} className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600" />
                <button onClick={() => copyToClipboard(registerLink)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer"><Copy size={14} /></button>
              </div>
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Referred: {stats?.shop_referrals?.length || 0} shops</span>
              </div>
            </div>
          </div>

          {stats?.member_referrals?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Users size={14} className="text-green-500" /> Member Referrals</h3>
              <div className="space-y-2">
                {stats.member_referrals.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{r.name || r.email}</span>
                    <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats?.shop_referrals?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Store size={14} className="text-purple-500" /> Shop Referrals</h3>
              <div className="space-y-2">
                {stats.shop_referrals.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{r.shop_name}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}