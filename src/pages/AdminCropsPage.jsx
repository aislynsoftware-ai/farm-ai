import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminCropsPage() {
  const [items, setItems] = useState([]);
  const [agriTitles, setAgriTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [agriId, setAgriId] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.farming.allCrops().then(setItems).catch(() => {}),
      api.farming.agriTitles().then(setAgriTitles).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview('');
    }
  };

  const resetForm = () => { setEdit(null); setTitle(''); setAgriId(''); setImage(null); setPreview(''); };

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !agriId) { setFormError('Title and Agri Title required'); return; }
    setFormLoading(true);
    try {
      if (edit) {
        await api.admin.updateCrop(edit.id, title, agriId, image);
      } else {
        if (!image) { setFormError('Image required'); setFormLoading(false); return; }
        await api.admin.addCrop(title, agriId, image);
      }
      show(edit ? 'Updated' : 'Added');
      resetForm();
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop?')) return;
    try { await api.admin.deleteCrop(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-sm";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Crops</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      <form onSubmit={handleSave} className="rounded-xl bg-gray-800/80 border border-gray-700 p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Crop name" className={`${inputClass} w-48`} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Agri Title</label>
          <select value={agriId} onChange={(e) => setAgriId(e.target.value)} className={`${inputClass} w-40`}>
            <option value="">Select</option>
            {agriTitles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Image</label>
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
            {image ? image.name : 'Choose'}
          </button>
        </div>
        {preview && <img src={preview} alt="" className="w-12 h-12 rounded-lg object-cover" />}
        <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
          {formLoading ? <Loader size={14} className="animate-spin" /> : edit ? 'Update' : 'Add'}
        </button>
        {edit && <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>}
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : items.map((c) => (
          <div key={c.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden group">
            {c.image_url && <img src={c.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{c.title}</p>
              <p className="text-xs text-gray-400 truncate">{c.agri_title || ''}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => { setEdit(c); setTitle(c.title); setAgriId(c.agri_id || ''); setImage(null); setPreview(c.image_url || ''); }} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
