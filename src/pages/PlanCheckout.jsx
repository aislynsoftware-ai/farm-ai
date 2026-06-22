import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, ArrowLeft, Sparkles, Loader } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';
import api from '../services/api';

const PLANS = {
  BASIC: { price: 99, requests: '150 Requests', features: ['150 API requests per month', 'All detection models', 'Standard response time', 'Email support', 'Basic analytics'] },
  STANDARD: { price: 299, requests: '500 Requests', features: ['500 API requests per month', 'All detection models', 'Priority response time', 'Priority support', 'Advanced analytics', 'API key management'] },
  PRO: { price: 499, requests: '1000 Requests', features: ['1000 API requests per month', 'All detection models', 'Priority response time', 'Dedicated support', 'Advanced analytics', 'API key management', 'Custom integrations'] },
};

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const APP_NAME = 'Farmlyt AI';

export default function PlanCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get('plan') || 'BASIC';
  const plan = PLANS[planName];
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    try { setUser(JSON.parse(stored)); } catch { navigate('/login'); }
  }, []);

  if (!plan) {
    return (
      <main className="pt-24 text-center">
        <p className="text-gray-500">Invalid plan selected.</p>
        <Link to="/pricing" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">Back to Pricing</Link>
      </main>
    );
  }

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== 'undefined') return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });

  const handlePurchase = async () => {
    if (!user) return;
    setProcessing(true);
    setError('');
    try {
      await loadRazorpay();
      const order = await api.plan.createOrder(user.user_id, planName);
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: 'INR',
        name: APP_NAME,
        description: `${planName} Plan`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            await api.plan.verifyPayment({
              user_id: user.user_id,
              plan: planName,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: order.amount,
            });
            setSuccess(true);
          } catch {
            setError('Payment verification failed');
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        prefill: { email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#059669' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setError('Payment failed'));
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main>
      <SEO title={`Buy ${planName} Plan`} url={`/plan-checkout?plan=${planName}`} />
      <PageHeader title="Complete Your Purchase" description={`You are purchasing the ${planName} plan.`} />

      <section className="py-12 bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20 min-h-[60vh]">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/pricing" className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline mb-6">
            <ArrowLeft size={13} /> Back to Pricing
          </Link>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{planName} Plan Activated!</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Your plan has been activated successfully.</p>
              <Link to="/dashboard/api-keys" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all duration-200">
                Go to API Keys
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">{planName} Plan</span>
                  </div>
                  <Shield size={18} className="text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">/mo</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{plan.requests}</p>
              </div>

              <div className="p-6">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Check size={13} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">{error}</div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {processing ? (
                    <><Loader size={14} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Sparkles size={14} /> Pay ₹{plan.price} — Activate {planName}</>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3">
                  Secure payment via Razorpay (UPI, Cards, Net Banking)
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}