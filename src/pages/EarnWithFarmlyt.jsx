import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DollarSign, Camera, Users, Store, ChevronRight, Gift, Target, Zap, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import { APP_NAME } from '../constants';
import api from '../services/api';

export default function EarnWithFarmlyt() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [referrerCode, setReferrerCode] = useState(searchParams.get('ref') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLoading(false); return; }
    const u = JSON.parse(stored);
    setUser(u);
    api.volunteer.profile(u.user_id).then(setVolunteer).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleActivate = async () => {
    if (!user) return navigate('/login');
    setActivating(true); setError(''); setSuccess('');
    try {
      const res = await api.volunteer.activate(user.user_id, referrerCode);
      setSuccess(`Volunteer activated! Your referral code: ${res.referral_code}`);
      const profile = await api.volunteer.profile(user.user_id);
      setVolunteer(profile);
    } catch (err) { setError(err.message); }
    setActivating(false);
  };

  const ways = [
    { icon: Camera, label: 'Send Images', desc: 'Upload crop/plant images — 2rs per image', path: '/volunteer-upload', color: 'bg-blue-500' },
    { icon: Users, label: 'Refer Members', desc: 'Invite friends to join — 50rs per referral', path: '/volunteer-refer', color: 'bg-green-500' },
    { icon: Store, label: 'Refer Shop Owners', desc: 'Refer shop owners — 200rs after shop approved', path: '/volunteer-refer', color: 'bg-purple-500' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 py-12 px-4 mt-12">
      <SEO title="Earn With Farmlyt AI" description="Join as a volunteer and earn real money with Farmlyt AI" url="/earn" />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earn With {APP_NAME}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
            Join as a volunteer and earn real money by contributing to our agricultural AI platform
          </p>
        </motion.div>

        {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600 dark:text-red-400">{error}</p></div>}
        {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>
        ) : volunteer ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 text-center">
              <CheckCircle size={40} className="text-emerald-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Volunteer Active</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Referral Code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{volunteer.referral_code}</span></p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{volunteer.total_earnings?.toFixed(2) || '0'}</p>
                  <p className="text-[10px] text-gray-500">Total Earned</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{volunteer.images_approved || 0}</p>
                  <p className="text-[10px] text-gray-500">Images</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(volunteer.referrals || 0) + (volunteer.shop_referrals || 0)}</p>
                  <p className="text-[10px] text-gray-500">Referrals</p>
                </div>
              </div>
              <Link to="/volunteer-dashboard" className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">View Full Dashboard <ChevronRight size={12} /></Link>
            </div>

            <div className="grid gap-4">
              {ways.map((w, i) => (
                <Link key={i} to={w.path} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl ${w.color} flex items-center justify-center flex-shrink-0`}>
                    <w.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{w.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{w.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {!user && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 text-center">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Login to Get Started</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Create an account or login to join as a volunteer</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/login"><Button size="sm">Login</Button></Link>
                  <Link to="/register"><Button variant="outline" size="sm">Register</Button></Link>
                </div>
              </div>
            )}

            {user && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 space-y-4">
                  <div className="text-center">
                    <Gift size={36} className="text-emerald-500 mx-auto mb-2" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activate Your Volunteer Account</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Start earning real money by contributing to AI training</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Referral Code (optional)</label>
                    <input value={referrerCode} onChange={(e) => setReferrerCode(e.target.value)} placeholder="Enter referrer code if you have one" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                  <Button onClick={handleActivate} disabled={activating} className="w-full justify-center">
                    {activating ? <Loader size={16} className="animate-spin" /> : null}
                    {activating ? 'Activating...' : 'Activate Now'}
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Target size={20} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">How it works</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Send images → earn 2rs each | Refer members → 50rs each | Refer shops → 200rs each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Zap size={20} className="text-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Reward Rules</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Min 100rs for recharge | Min 1000rs for withdrawal via UPI/bank</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}