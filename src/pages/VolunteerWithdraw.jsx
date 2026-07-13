import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, RotateCcw, Loader, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import api from '../services/api';

export default function VolunteerWithdraw() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(''); // 'recharge' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    Promise.all([
      api.volunteer.profile(u.user_id),
      api.volunteer.withdrawals(u.user_id),
    ]).then(([p, w]) => {
      setProfile(p);
      setWithdrawals(w || []);
    }).catch(() => navigate('/earn')).finally(() => setLoading(false));
  }, []);

  const totalEarnings = profile?.total_earnings || 0;

  const handleRecharge = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { setError('Minimum recharge is 100rs'); return; }
    if (amt > totalEarnings) { setError('Insufficient balance'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await api.volunteer.recharge(user.user_id, amt);
      setSuccess(res.message);
      setAmount('');
      const p = await api.volunteer.profile(user.user_id);
      setProfile(p);
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1000) { setError('Minimum withdrawal is 1000rs'); return; }
    if (amt > totalEarnings) { setError('Insufficient balance'); return; }
    if (!accountDetails && !upiId) { setError('Please provide account details or UPI ID'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await api.volunteer.requestWithdrawal(user.user_id, amt, accountDetails, upiId);
      setSuccess(res.message);
      setAmount(''); setAccountDetails(''); setUpiId('');
      const w = await api.volunteer.withdrawals(user.user_id);
      setWithdrawals(w || []);
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 py-8 px-4">
      <SEO title="Withdraw / Recharge" description="Withdraw your earnings or recharge" url="/volunteer-withdraw" />
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Wallet</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Balance: <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalEarnings.toFixed(2)} rs</span></p>

          {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600 dark:text-red-400">{error}</p></div>}
          {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

          <div className="flex gap-3 mb-6">
            <button onClick={() => setMode('recharge')} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer ${mode === 'recharge' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
              <RotateCcw size={16} className="inline mr-1" /> Recharge
            </button>
            <button onClick={() => setMode('withdraw')} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer ${mode === 'withdraw' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
              <ArrowUpRight size={16} className="inline mr-1" /> Withdraw
            </button>
          </div>

          {mode === 'recharge' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-700 dark:text-emerald-300">
                <AlertCircle size={14} className="flex-shrink-0" />
                Minimum 100rs required for recharge. You can use this balance for platform services.
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (rs)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount (min 100)" className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
              </div>
              <Button onClick={handleRecharge} disabled={submitting || totalEarnings < 100} className="w-full justify-center">
                {submitting ? <Loader size={16} className="animate-spin" /> : null}
                {submitting ? 'Processing...' : 'Recharge Now'}
              </Button>
              {totalEarnings < 100 && <p className="text-xs text-center text-gray-400">Need {(100 - totalEarnings).toFixed(2)} more rs to recharge</p>}
            </div>
          )}

          {mode === 'withdraw' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-xs text-purple-700 dark:text-purple-300">
                <AlertCircle size={14} className="flex-shrink-0" />
                Minimum 1000rs required for withdrawal. Amount will be processed after admin approval.
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (rs)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount (min 1000)" className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bank Account Details (optional if UPI provided)</label>
                <textarea value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} placeholder="Account number, IFSC, Account holder name" rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">UPI ID (optional if bank details provided)</label>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@upi" className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
              </div>
              <Button onClick={handleWithdraw} disabled={submitting || totalEarnings < 1000} className="w-full justify-center">
                {submitting ? <Loader size={16} className="animate-spin" /> : null}
                {submitting ? 'Submitting...' : 'Request Withdrawal'}
              </Button>
              {totalEarnings < 1000 && <p className="text-xs text-center text-gray-400">Need {(1000 - totalEarnings).toFixed(2)} more rs to withdraw</p>}
            </div>
          )}

          {withdrawals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mt-6">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">Withdrawal History</h3>
              <div className="space-y-2">
                {withdrawals.map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{w.amount} rs</p>
                      <p className="text-[10px] text-gray-400">{new Date(w.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${w.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : w.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>{w.status}</span>
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