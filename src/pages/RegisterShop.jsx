import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Mail, Image, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function RegisterShop() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    shop_name: '', description: '',
    address: '', latitude: '', longitude: '', shop_phone: '', photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    const t = localStorage.getItem('token');
    if (!u || !t) { navigate('/login'); return; }
    try { setUser(JSON.parse(u)); } catch { navigate('/login'); }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shop_name) { setError('Shop name is required'); return; }
    setLoading(true); setError('');
    try {
      await api.shops.register(form);
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      updatedUser.role = 'shop_owner';
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setDone(true);
      setTimeout(() => navigate('/my-shop'), 2000);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((p) => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => alert('Could not get location')
    );
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md">
        <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Your shop is pending admin approval. Redirecting...</p>
      </div>
    </div>
  );

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Store size={36} className="text-emerald-500 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Register Your Shop</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create a shop owner account for your fertilizer business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6">
          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">{error}</p>}

          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700">
              <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name || 'User'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{user.email || user.phone || ''}</p>
              </div>
              <CheckCircle size={16} className="text-emerald-500 ml-auto shrink-0" />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Store size={12} className="inline mr-1" />Shop Name *</label>
            <input value={form.shop_name} onChange={(e) => setForm((p) => ({ ...p, shop_name: e.target.value }))} placeholder="Green Fertilizers" className={inputClass} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="About your shop..." rows={2} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Address</label>
            <textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Shop address..." rows={2} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><MapPin size={12} className="inline mr-1" />Location Coordinates</label>
            <div className="flex gap-2">
              <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className={inputClass} />
              <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className={inputClass} />
              <button type="button" onClick={getLocation} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 whitespace-nowrap cursor-pointer">Get Location</button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Phone size={12} className="inline mr-1" />Shop Phone</label>
            <input value={form.shop_phone} onChange={(e) => setForm((p) => ({ ...p, shop_phone: e.target.value }))} placeholder="Shop contact number" className={inputClass} />
          </div>

          <div>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 hover:border-emerald-400 cursor-pointer">
              <Image size={16} className="text-emerald-500" />
              {form.photo ? form.photo.name : 'Upload shop photo'}
              <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files[0] || null }))} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
            {loading ? <Loader size={16} className="animate-spin" /> : <Store size={16} />}
            {loading ? 'Registering...' : 'Register Shop'}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
