import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff, LogIn, Globe, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES, APP_NAME } from '../constants';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password.trim()) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate());
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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{APP_NAME}</h2>
          <p className="text-emerald-100/80 text-sm max-w-md leading-relaxed">
            AI-Powered Smart Agriculture Platform. Detect diseases, identify plants, and optimize your farming with artificial intelligence.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {['50+ Diseases', '95% Accuracy', 'Real-Time'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h2>
          </div>

          <div className="glass rounded-2xl p-6 lg:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Welcome Back</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Sign in to your account</p>
            </div>

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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" icon={LogIn} className="w-full justify-center">
                Sign In
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
    </div>
  );
}
