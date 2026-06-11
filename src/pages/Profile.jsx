import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Mail, Phone, Camera, Save, AlertCircle, Loader, CheckCircle, Coins } from 'lucide-react';
import Button from '../components/common/Button';
import Sidebar from '../components/dashboard/Sidebar';
import { ROUTES, APP_NAME } from '../constants';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '' });
        fetchCoins(u.user_id);
      } catch {}
    }
  }, []);

  const fetchCoins = async (uid) => {
    if (!uid) return;
    try {
      const res = await api.farming.wallet(uid);
      setCoins(res.coins);
    } catch {}
  };

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);
    try {
      const userId = getUserId();
      await api.auth.updateProfile(userId, form.name, form.phone);
      const updated = { ...(JSON.parse(localStorage.getItem('user') || '{}')), name: form.name, phone: form.phone };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const userId = getUserId();
      const res = await api.auth.updateProfilePic(userId, file);
      const updated = { ...(JSON.parse(localStorage.getItem('user') || '{}')), profile_image: res.profile_image };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Profile</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          {/* User info card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                >
                  {uploading ? <Loader size={12} className="animate-spin" /> : <Camera size={12} />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{user?.name || 'Farmer'}</h2>
                <p className="text-emerald-100/80 text-xs mt-0.5">{user?.email || ''}</p>
              </div>
              {/* Wallet Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur">
                <Coins size={18} className="text-yellow-300" />
                <span className="text-sm font-bold text-white">{coins !== null ? coins : '...'}</span>
                <span className="text-[10px] text-emerald-100/70">coins</span>
              </div>
            </div>
          </motion.div>

          {/* Profile form */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass rounded-2xl p-6 lg:p-8">
              {saved && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Profile updated successfully!</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={form.email} placeholder="your@email.com" className={`${inputClass} pl-10`} readOnly />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555..." className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" icon={loading ? null : Save} disabled={loading}>
                    {loading ? <Loader size={16} className="animate-spin" /> : null}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
