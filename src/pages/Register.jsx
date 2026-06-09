import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Lock, User, Phone, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES, APP_NAME } from '../constants';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.password.trim()) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must agree to the terms';
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

  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

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
            Join thousands of farmers using AI to increase crop yields, reduce losses, and farm smarter.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {['Free to Start', '100+ Crops', '24/7 Support'].map((tag) => (
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Start your AI-powered farming journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className={iconClass} />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={`${inputClass('name')} pl-10`} />
                </div>
                {errors.name && <p className="input-error mt-1"><AlertCircle size={12} />{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className={iconClass} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={`${inputClass('email')} pl-10`} />
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className={iconClass} />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 8 chars" className={`${inputClass('password')} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="input-error mt-1"><AlertCircle size={12} />{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm</label>
                  <div className="relative">
                    <Lock size={16} className={iconClass} />
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={`${inputClass('confirmPassword')} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="input-error mt-1"><AlertCircle size={12} />{errors.confirmPassword}</p>}
                </div>
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

              <Button type="submit" icon={UserPlus} className="w-full justify-center">
                Create Account
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
    </div>
  );
}
