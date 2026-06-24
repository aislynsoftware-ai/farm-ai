import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coins, CreditCard, Plus, Loader, AlertCircle, Sprout, Menu, Check, Zap, Star, Crown } from 'lucide-react';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import Sidebar from '../components/dashboard/Sidebar';
import { ROUTES, APP_NAME } from '../constants';
import api from '../services/api';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

const PLANS = [
  { id: 'FREE',  price: 0,   label: 'Free',        icon: Sprout,  desc: 'Get started' },
  { id: 'BASIC', price: 99,  label: 'Basic',        icon: Zap,     desc: 'For regular users' },
  { id: 'STANDARD', price: 299, label: 'Standard',  icon: Star,    desc: 'For power users' },
  { id: 'PRO',   price: 499, label: 'Professional', icon: Crown,   desc: 'Unlimited access' },
];

export default function Wallet() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [rechargeAmount, setRechargeAmount] = useState(50);
  const [recharging, setRecharging] = useState(false);
  const [buyingPlan, setBuyingPlan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        fetchCoins(u.user_id);
        fetchPlan(u.user_id);
      } catch {}
    }
  }, []);

  const fetchCoins = async (uid) => {
    if (!uid) return;
    try { const res = await api.farming.wallet(uid); setCoins(res.coins); } catch {}
  };

  const fetchPlan = async (uid) => {
    if (!uid) return;
    try { const res = await api.plan.get(uid); setCurrentPlan((res.plan || 'free').toLowerCase()); } catch {}
  };

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
  };

  const handleBuyPlan = async (planId) => {
    const userId = getUserId();
    if (!userId) return;
    if (planId === 'FREE') {
      setBuyingPlan('FREE');
      try {
        await api.plan.activate(userId, 'FREE');
        await fetchCoins(userId);
        await fetchPlan(userId);
      } catch (err) { setError(err.message); }
      finally { setBuyingPlan(null); }
      return;
    }
    setBuyingPlan(planId);
    setError('');
    try {
      if (typeof window.Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }
      const order = await api.plan.createOrder(userId, planId);
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: 'INR',
        name: APP_NAME,
        description: `${planId} Plan`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            await api.plan.verifyPayment({
              user_id: userId,
              plan: planId,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: order.amount,
            });
            await fetchCoins(userId);
            await fetchPlan(userId);
          } catch { setError('Payment verification failed'); }
        },
        modal: { ondismiss: () => setBuyingPlan(null) },
        prefill: { email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#059669' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setError('Payment failed'));
      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setBuyingPlan(null);
    }
  };

  const handleRecharge = async () => {
    const userId = getUserId();
    if (!userId || rechargeAmount < 1) return;
    setRecharging(true);
    setError('');
    try {
      if (typeof window.Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }
      const order = await api.payment.createOrder(userId, rechargeAmount);
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rechargeAmount * 100,
        currency: 'INR',
        name: APP_NAME,
        description: `Add ${rechargeAmount} Coins`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            await api.payment.verifyPayment({
              user_id: userId,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: rechargeAmount,
            });
            fetchCoins(userId);
            setRechargeAmount(50);
          } catch { setError('Payment verification failed'); }
        },
        modal: { ondismiss: () => setRecharging(false) },
        prefill: { email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#059669' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setError('Payment failed'));
      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setRecharging(false);
    }
  };

  if (!localStorage.getItem('token')) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  const isActive = (id) => currentPlan === id.toLowerCase();

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="Wallet" description="Manage your Farmlyt AI wallet and coins." url="/wallet" noindex />
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-emerald-950/80 backdrop-blur border-b border-emerald-100 dark:border-emerald-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-emerald-900 dark:text-white">Wallet</span>
        </div>
        <h1 className="sr-only">Wallet</h1>

        <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">

          {/* Balance Card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <div className="relative">
              <p className="text-emerald-100/70 text-xs mb-1">Available Balance</p>
              <div className="flex items-center gap-3">
                <Coins size={32} className="text-yellow-300" />
                <span className="text-4xl font-bold text-white">{coins !== null ? coins : '...'}</span>
                <span className="text-emerald-100/70 text-sm">coins</span>
              </div>
              <p className="text-emerald-100/60 text-xs mt-2">
                Current plan: <span className="capitalize font-semibold text-white">{currentPlan}</span>
              </p>
            </div>
          </motion.div>

          {/* Plan Cards */}
          <motion.div
            className="rounded-2xl bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Crown size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-emerald-900 dark:text-white">Choose a Plan</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const coinsAmount = plan.price * 2 || 50;
                const active = isActive(plan.id);
                return (
                  <button
                    key={plan.id}
                    onClick={() => handleBuyPlan(plan.id)}
                    disabled={buyingPlan === plan.id || (active && plan.id !== 'FREE')}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-800/50'
                        : 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 bg-white dark:bg-emerald-900/50'
                    } disabled:opacity-60`}
                  >
                    {active && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                    <Icon size={20} className={`mb-2 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'}`} />
                    <p className={`text-xs font-bold mb-0.5 ${active ? 'text-emerald-900 dark:text-white' : 'text-emerald-900 dark:text-white'}`}>
                      {plan.label}
                    </p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      ₹{plan.price}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                      {coinsAmount} coins
                    </p>
                    <p className="text-[10px] text-emerald-500 dark:text-emerald-500 mt-0.5">{plan.desc}</p>
                    {buyingPlan === plan.id && (
                      <div className="absolute inset-0 rounded-xl bg-white/60 dark:bg-emerald-900/60 flex items-center justify-center">
                        <Loader size={20} className="animate-spin text-emerald-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Add Coins Card */}
          <motion.div
            className="rounded-2xl bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-emerald-900 dark:text-white">Add Coins</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-2">Quick Select</label>
                <div className="flex flex-wrap gap-2">
                  {[10, 50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        rechargeAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-600 hover:border-emerald-400'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1.5">Custom Amount</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-600">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-emerald-800 border border-emerald-200 dark:border-emerald-600 text-sm text-emerald-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleRecharge}
                disabled={recharging || !rechargeAmount || rechargeAmount < 1}
                className="w-full sm:w-auto justify-center"
              >
                {recharging ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                {recharging ? ' Processing...' : ` Add ₹${rechargeAmount}`}
              </Button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="rounded-2xl bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sprout size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-emerald-900 dark:text-white">About Coins</h3>
            </div>
            <ul className="space-y-2 text-xs text-emerald-700 dark:text-emerald-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                Each AI detection costs 2 coins per scan
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                Coins never expire — use them anytime
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                Plans give bonus coins: price × 2
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                Add coins securely via Razorpay (UPI, Cards, Net Banking)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                New users get 50 free starter coins on registration
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
