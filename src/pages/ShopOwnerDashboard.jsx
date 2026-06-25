import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Image, Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ShopOwnerDashboard() {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;
    const u = JSON.parse(stored);
    setUser(u);
    api.shops.myShop(u.user_id).then(setShop).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openEdit = () => {
    setForm({
      shop_name: shop.shop_name, description: shop.description || '',
      address: shop.address || '', latitude: shop.latitude, longitude: shop.longitude,
      shop_phone: shop.phone || '', photo: null,
    });
    setEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true); setError('');
    try {
      await api.shops.update({ ...form, user_id: user.user_id });
      const updated = await api.shops.myShop(user.user_id);
      setShop(updated);
      setEditing(false);
      setSuccess('Updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
    setFormLoading(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((p) => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => alert('Could not get location')
    );
  };

  const mapsUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-sm text-gray-500">Please login first</p>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader size={24} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!shop && !loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
      <Store size={48} className="text-emerald-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">You haven't registered a shop yet</p>
      <Link to="/register-shop" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">Register Now</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
            <div className="flex items-center gap-4">
              {shop.photo_url ? <img src={shop.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-white/20" /> : <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center"><Store size={32} /></div>}
              <div>
                <h1 className="text-lg font-bold">{shop.shop_name}</h1>
                <p className="text-emerald-100 text-xs">
                  Status: <span className={`font-semibold ${shop.status === 'approved' ? 'text-green-300' : shop.status === 'rejected' ? 'text-red-300' : 'text-yellow-300'}`}>{shop.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          {!editing ? (
            <div className="p-6 space-y-4">
              {shop.description && <p className="text-sm text-gray-600 dark:text-gray-300">{shop.description}</p>}
              {shop.address && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-emerald-500" />{shop.address}</p>}
              {shop.phone && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone size={14} className="text-emerald-500" />{shop.phone}</p>}
              {shop.latitude && shop.longitude && (
                <a href={mapsUrl(shop.latitude, shop.longitude)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  <MapPin size={14} /> View on Google Maps <ExternalLink size={12} />
                </a>
              )}
              <button onClick={openEdit} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 cursor-pointer">Edit Shop</button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <input value={form.shop_name} onChange={(e) => setForm((p) => ({ ...p, shop_name: e.target.value }))} placeholder="Shop name" className={inputClass} />
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
              <textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Address" rows={2} className={`${inputClass} resize-none`} />
              <div className="flex gap-2">
                <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} placeholder="Lat" className={inputClass} />
                <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} placeholder="Lng" className={inputClass} />
                <button type="button" onClick={getLocation} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 cursor-pointer">Auto</button>
              </div>
              <input value={form.shop_phone} onChange={(e) => setForm((p) => ({ ...p, shop_phone: e.target.value }))} placeholder="Shop phone" className={inputClass} />
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 hover:border-emerald-400 cursor-pointer">
                <Image size={16} className="text-emerald-500" />{form.photo ? form.photo.name : 'Change photo'}
                <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files[0] || null }))} className="hidden" />
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
