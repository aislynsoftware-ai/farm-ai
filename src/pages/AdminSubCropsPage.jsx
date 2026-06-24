import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminSubCropsPage() {
  const [items, setItems] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [cropId, setCropId] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.farming.crops().then(setItems).catch(() => {}),
      api.farming.allCrops().then(setCrops).catch(() => {}),
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

  const resetForm = () => { setEdit(null); setTitle(''); setCropId(''); setImage(null); setPreview(''); };

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !cropId) { setFormError('Title and Crop required'); return; }
    setFormLoading(true);
    try {
      if (edit) {
        await api.admin.updateSubCrop(edit.id, cropId, title, image);
      } else {
        if (!image) { setFormError('Image required'); setFormLoading(false); return; }
        await api.admin.addSubCrop(cropId, title, image);
      }
      show(edit ? 'Updated' : 'Added');
      resetForm();
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sub crop?')) return;
    try { await api.admin.deleteSubCrop(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 text-sm";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sub Crops</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      <form onSubmit={handleSave} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sub crop name" className={`${inputClass} w-48`} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Crop</label>
          <select value={cropId} onChange={(e) => setCropId(e.target.value)} className={`${inputClass} w-40`}>
            <option value="">Select</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Image</label>
          <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
            {image ? image.name : 'Choose'}
          </button>
        </div>
        {preview && <img src={preview} alt="" className="w-12 h-12 rounded-lg object-cover" />}
        <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
          {formLoading ? <Loader size={14} className="animate-spin" /> : edit ? 'Update' : 'Add'}
        </button>
        {edit && <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>}
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : items.map((s) => (
          <div key={s.id} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden group">
            {s.image_url && <img src={s.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{s.crop_name || ''}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => { setEdit(s); setTitle(s.title); setCropId(s.crop_id || ''); setImage(null); setPreview(s.image_url || ''); }} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
