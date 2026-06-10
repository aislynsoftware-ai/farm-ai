import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, User, Phone, UserPlus, AlertCircle, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES, APP_NAME } from '../constants';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.terms) errs.terms = 'You must agree to the terms';
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
      const res = await api.auth.register(form.name, form.email, form.phone);
      if (res.otp) sessionStorage.setItem('pending_otp', res.otp);
      if (res.user_id_saved) sessionStorage.setItem('pending_user_id', res.user_id_saved);
      navigate(`${ROUTES.VERIFY}?email=${encodeURIComponent(form.email)}`);
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

  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Start your AI-powered farming journey</p>
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8">
          {apiError && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className={iconClass} />
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={`${inputClass('name')} pl-10`} />
              </div>
              {errors.name && <p className="input-error mt-1"><AlertCircle size={12} />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className={iconClass} />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={`${inputClass('email')} pl-10`} />
              </div>
              {errors.email && <p className="input-error mt-1"><AlertCircle size={12} />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile</label>
              <div className="relative">
                <Phone size={16} className={iconClass} />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555..." className={`${inputClass('phone')} pl-10`} />
              </div>
              {errors.phone && <p className="input-error mt-1"><AlertCircle size={12} />{errors.phone}</p>}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="input-error"><AlertCircle size={12} />{errors.terms}</p>}

            <Button type="submit" icon={loading ? null : UserPlus} disabled={loading} className="w-full justify-center">
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
