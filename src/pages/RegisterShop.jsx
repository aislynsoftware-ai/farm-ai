import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Mail, Image, Loader, CheckCircle, Search } from 'lucide-react';
import api from '../services/api';

const OWM_KEY = '6914d2cb3f280b711105801779b3ca7f';

export default function RegisterShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', shop_name: '', description: '',
    address: '', city: '', latitude: '', longitude: '', shop_phone: '', photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    if (!form.city || form.city.length < 2) { setCitySuggestions([]); return; }
    const timer = setTimeout(async () => {
      setCityLoading(true);
      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(form.city)}&limit=5&appid=${OWM_KEY}`);
        const data = await res.json();
        setCitySuggestions(data || []);
      } catch { setCitySuggestions([]); }
      setCityLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [form.city]);

  const selectCity = (c) => {
    setForm((p) => ({ ...p, city: c.name, latitude: c.lat, longitude: c.lon }));
    setCitySuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shop_name) { setError('Shop name is required'); return; }
    if (!form.name) { setError('Your name is required'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.shops.register(form);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify({ user_id: res.user_id, name: form.name, role: 'shop_owner' }));
      setDone(true);
      setTimeout(() => navigate('/my-shop'), 2000);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const getLocation = () => {
    setGpsError('');
    if (!navigator.geolocation) { setGpsError('Geolocation not supported in this browser'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((p) => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude })); setGpsError(''); },
      (err) => {
        const msgs = {
          1: 'Permission denied — allow location access in browser settings',
          2: 'Location unavailable — try again or search city instead',
          3: 'GPS request timed out — try again',
        };
        setGpsError(msgs[err.code] || 'Could not get location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 mt-10">
      <div className="w-full max-w-lg space-y-6">
       

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6">
          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">{error}</p>}
 <div className="text-center mb-6 ">
          <Store size={36} className="text-emerald-500 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Register Your Shop</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create a shop owner account for your fertilizer business</p>
        </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Your Name *</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter your name" className={inputClass} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Mail size={12} className="inline mr-1" />Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Enter your email" className={inputClass} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Phone size={12} className="inline mr-1" />Phone</label>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter your phone number" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Store size={12} className="inline mr-1" />Shop Name *</label>
            <input value={form.shop_name} onChange={(e) => setForm((p) => ({ ...p, shop_name: e.target.value }))} placeholder="Enter your shop name" className={inputClass} />
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
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1"><Search size={12} className="inline mr-1" />City / Location</label>
            <div className="relative">
              <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="Search your city..." className={inputClass} />
              {cityLoading && <Loader size={14} className="absolute right-3 top-3 animate-spin text-gray-400" />}
              {citySuggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                  {citySuggestions.map((c, i) => (
                    <button type="button" key={i} onClick={() => selectCity(c)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                      {c.name}, {c.state || ''} {c.country}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={getLocation} className="mt-2 w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 cursor-pointer"><MapPin size={12} className="inline mr-1" />Use Current Location (GPS)</button>
            {gpsError && <p className="text-xs text-red-500 mt-1">{gpsError}</p>}
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