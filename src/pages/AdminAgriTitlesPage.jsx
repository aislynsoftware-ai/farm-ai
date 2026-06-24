import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import Skeleton, { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminAgriTitlesPage() {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [aiServiceId, setAiServiceId] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.farming.agriTitles().then(setItems).catch(() => {}),
      api.admin.getAIServices().then(setServices).catch(() => {}),
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

  const resetForm = () => { setEdit(null); setTitle(''); setAiServiceId(''); setImage(null); setPreview(''); };

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) { setFormError('Title is required'); return; }
    setFormLoading(true);
    try {
      if (edit) {
        await api.admin.updateAgriTitle(edit.id, title, image, aiServiceId || null);
      } else {
        if (!image) { setFormError('Image is required'); setFormLoading(false); return; }
        await api.admin.addAgriTitle(title, image, aiServiceId || null);
      }
      show(edit ? 'Updated' : 'Added');
      resetForm();
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this title?')) return;
    try { await api.admin.deleteAgriTitle(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-sm";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Agri Titles</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      <form onSubmit={handleSave} className="rounded-xl bg-gray-800/80 border border-gray-700 p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-400 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Agri title name" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">AI Service</label>
          <select value={aiServiceId} onChange={(e) => setAiServiceId(e.target.value)} className={inputClass}>
            <option value="">Select service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
        {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : items.map((a) => (
          <div key={a.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden group">
            {a.image_url && <img src={a.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm text-white truncate">{a.title}</span>
              <div className="flex gap-1">
                <button onClick={() => { setEdit(a); setTitle(a.title); setAiServiceId(a.ai_service_id || ''); setImage(null); setPreview(a.image_url || ''); }} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
