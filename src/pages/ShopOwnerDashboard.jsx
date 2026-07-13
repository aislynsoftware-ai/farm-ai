import { useState, useEffect, useRef } from 'react';
import { Menu, Store, MapPin, Phone, Image, Loader, CheckCircle, AlertCircle, ExternalLink, Home, LogOut, X, Gift } from 'lucide-react';
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
  const [existingUrls, setExistingUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const existingUrlsRef = useRef(existingUrls);
  const newFilesRef = useRef(newFiles);
  existingUrlsRef.current = existingUrls;
  newFilesRef.current = newFiles;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;
    const u = JSON.parse(stored);
    setUser(u);
    api.shops.myShop(u.user_id).then(setShop).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openEdit = () => {
    const urls = shop.photo_url ? shop.photo_url.split(',').map((u) => u.trim()).filter(Boolean) : [];
    setForm({
      shop_name: shop.shop_name, description: shop.description || '',
      address: shop.address || '', latitude: shop.latitude, longitude: shop.longitude,
      shop_phone: shop.phone || '',
      referral_code: '',
    });
    setExistingUrls(urls);
    setNewFiles([]);
    setNewPreviews([]);
    setEditing(true);
  };

  const removeExisting = (idx) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - (existingUrls.length + newFiles.length);
    if (remaining <= 0) return;
    const slice = files.slice(0, remaining);
    setNewFiles((prev) => [...prev, ...slice]);
    setNewPreviews((prev) => [...prev, ...slice.map((f) => URL.createObjectURL(f))]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true); setError('');
    try {
      await api.shops.update({
        ...form, user_id: user.user_id,
        existing_photos: existingUrlsRef.current.join(','),
        photos: newFilesRef.current,
      });
      const updated = await api.shops.myShop(user.user_id);
      setShop(updated);
      setEditing(false);
      setNewPreviews((prev) => { prev.forEach((u) => URL.revokeObjectURL(u)); return []; });
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

  const photoUrls = shop.photo_url ? shop.photo_url.split(',').map((u) => u.trim()).filter(Boolean) : [];

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <aside className="w-16 lg:w-20 flex flex-col items-center gap-1 py-3 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700/50 shrink-0">
        <Link to="/" className="flex flex-col items-center gap-1 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors" title="Home">
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
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
              {photoUrls[0] ? <img src={photoUrls[0]} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-white/20" /> : <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center"><Store size={32} /></div>}
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
              {photoUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                  {photoUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Shop ${i + 1}`} className="w-28 h-28 rounded-xl object-cover border border-gray-200 dark:border-gray-600 shadow-sm" />
                  ))}
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
              {shop.status === 'pending' && !shop.referrer_id && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-1">
                  <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referral Code <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <input value={form.referral_code} onChange={(e) => setForm((p) => ({ ...p, referral_code: e.target.value }))} placeholder="Enter referrer code" className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0" />
                </div>
              )}
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 space-y-2">
                <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photos (up to 4)</label>
                <div className="flex flex-wrap gap-2">
                  {existingUrls.map((url, i) => (
                    <div key={`e-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExisting(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                  {newPreviews.map((url, i) => (
                    <div key={`n-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNew(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                  {existingUrls.length + newFiles.length < 4 && (
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 cursor-pointer transition-colors">
                      <Image size={22} />
                      <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={16} className="animate-spin mx-auto" /> : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { setEditing(false); setNewPreviews((prev) => { prev.forEach((u) => URL.revokeObjectURL(u)); return []; }); }} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  </div>
  );
}