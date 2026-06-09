import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Globe, AlertCircle, Sprout, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES, APP_NAME } from '../constants';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password.trim()) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await api.auth.login(form.email, form.password);
      if (res.otp) sessionStorage.setItem('pending_otp', res.otp);
      if (res.token) localStorage.setItem('token', res.token);
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      if (res.otp) {
        navigate(`${ROUTES.VERIFY}?email=${encodeURIComponent(form.email)}`);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border text-sm transition-all duration-200 outline-none ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500'
    } focus:ring-2 focus:ring-emerald-500/20 text-gray-900 dark:text-white placeholder-gray-400`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       

        <div className="glass rounded-2xl p-6 mt-10 lg:p-8">
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
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`${inputClass('email')} pl-10`}
                />
              </div>
              {errors.email && <p className="input-error mt-1"><AlertCircle size={12} />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass('password')} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="input-error mt-1"><AlertCircle size={12} />{errors.password}</p>}
            </div>

            
             
            

            <Button type="submit" icon={loading ? null : LogIn} disabled={loading} className="w-full justify-center">
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
            <Globe size={18} />
            Sign in with Google
          </button>

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
