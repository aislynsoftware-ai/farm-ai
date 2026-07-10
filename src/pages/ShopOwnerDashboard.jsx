import { useState, useEffect } from 'react';
import { Menu, Store, MapPin, Phone, Image, Loader, CheckCircle, AlertCircle, ExternalLink, Home, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ShopOwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

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
    setPhotoPreview(null);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
      <Store size={48} className="text-emerald-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">You haven't registered a shop yet</p>
      <Link to="/register-shop" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">Register Now</Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <aside className="w-16 lg:w-20 flex flex-col items-center gap-4 py-6 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700/50 shrink-0">
        <Link to="/" className="flex flex-col items-center gap-1 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors" title="Home">
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <div className="flex-1" />
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer" title="Logout">
          <LogOut size={22} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 overflow-hidden">
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

          {!editing ? (
            <div className="p-6 space-y-4">
              {shop.photo_url && (
                <div className="flex justify-center py-4 border-b border-gray-100 dark:border-gray-700">
                  <img src={shop.photo_url} alt={shop.shop_name} className="w-40 h-40 rounded-2xl object-cover border-2 border-emerald-200 dark:border-emerald-700 shadow-md" />
                </div>
              )}
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{shop.shop_name}</p>
                </div>
                {shop.description && (
                  <div className="flex items-start gap-2">
                    <div className="w-4 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{shop.description}</p>
                  </div>
                )}
              </div>
              {shop.address && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{shop.address}</p>
                </div>
              )}
              {shop.phone && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 flex items-center gap-2">
                  <Phone size={16} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{shop.phone}</p>
                </div>
              )}
              {shop.latitude && shop.longitude && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4">
                  <a href={mapsUrl(shop.latitude, shop.longitude)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                    <MapPin size={14} /> View on Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              )}
              <button onClick={openEdit} className="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 cursor-pointer">Edit Shop</button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shop Name</label>
                <input value={form.shop_name} onChange={(e) => setForm((p) => ({ ...p, shop_name: e.target.value }))} placeholder="Shop name" className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0" />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe your shop" rows={2} className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none p-0" />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</label>
                <textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Shop address" rows={2} className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none p-0" />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</label>
                <div className="flex gap-2">
                  <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0" />
                  <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0" />
                  <button type="button" onClick={getLocation} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer shrink-0">Auto</button>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                <input value={form.shop_phone} onChange={(e) => setForm((p) => ({ ...p, shop_phone: e.target.value }))} placeholder="Shop phone number" className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0" />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-2">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo</label>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-xl object-cover border border-gray-200 dark:border-gray-600" />
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors">
                  <Image size={18} className="text-emerald-500" />
                  <span className="font-medium">{form.photo ? form.photo.name : 'Choose photo'}</span>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0] || null; setForm((p) => ({ ...p, photo: f })); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={16} className="animate-spin mx-auto" /> : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { setEditing(false); setPhotoPreview(null); }} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  </div>
  );
}