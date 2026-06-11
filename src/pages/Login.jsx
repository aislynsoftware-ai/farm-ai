import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, LogIn, AlertCircle, Sprout, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES, APP_NAME } from '../constants';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const clearErr = () => { setApiError(''); setFieldError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErr();
    if (tab === 'email') {
      if (!email.trim()) { setFieldError('Email is required'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('Invalid email'); return; }
    } else {
      if (!phone.trim()) { setFieldError('Phone is required'); return; }
      if (!/^[6-9]\d{9}$/.test(phone)) { setFieldError('Enter valid 10-digit Indian number'); return; }
    }

    setLoading(true);
    try {
      const payload = tab === 'email' ? email.trim() : phone.trim();
      const res = await api.auth.login(payload);
      if (res.user_id) sessionStorage.setItem('pending_user_id', res.user_id);
      if (res.name || res.email) {
        sessionStorage.setItem('pending_user', JSON.stringify({
          user_id: res.user_id,
          name: res.name || '',
          email: res.email || '',
          profile_image: res.profile_image || '',
        }));
      }
      navigate(`${ROUTES.VERIFY}?email=${encodeURIComponent(res.email || email)}`);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TabBtn = ({ value, label, icon: Icon }) => (
    <button type="button" onClick={() => { setTab(value); clearErr(); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${tab === value ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="glass rounded-2xl mt-14 p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Sign in to your account</p>
          </div>

          {apiError && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <TabBtn value="email" label="Email" icon={Mail} />
              <TabBtn value="phone" label="Phone" icon={Phone} />
            </div>

            {tab === 'email' ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearErr(); }} placeholder="you@example.com" className={`w-full px-3.5 py-2.5 pl-10 rounded-xl bg-white dark:bg-gray-800 border text-sm outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 ${fieldError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500'} focus:ring-2 focus:ring-emerald-500/20`} />
                </div>
                {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clearErr(); }} placeholder="9876543210" className={`w-full px-3.5 py-2.5 pl-10 rounded-xl bg-white dark:bg-gray-800 border text-sm outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 ${fieldError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500'} focus:ring-2 focus:ring-emerald-500/20`} />
                </div>
                {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
              </div>
            )}

            <Button type="submit" icon={loading ? null : LogIn} disabled={loading} className="w-full justify-center">
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
