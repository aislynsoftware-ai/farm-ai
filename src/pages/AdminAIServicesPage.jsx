import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

const emptyForm = () => ({ name: '', image: null });

export default function AdminAIServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

  const load = () => { setLoading(true); api.admin.getAIServices().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setForm((p) => ({ ...p, image: f }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const openEdit = (item) => {
    setEdit(item);
    setForm({ name: item.name, image: null });
    setPreview(item.image_url || '');
  };

  const resetForm = () => { setEdit(null); setForm(emptyForm()); setPreview(''); setShowAdd(false); };

  const handleSave = async (e) => {
    e.preventDefault(); setFormError('');
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    setFormLoading(true);
    try {
      if (edit) {
        await api.admin.updateAIService(edit.id, form);
        show('Updated');
      } else {
        if (!form.image) { setFormError('Image is required'); setFormLoading(false); return; }
        await api.admin.addAIService(form);
        show('Added');
      }
      resetForm(); load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this AI service?')) return;
    try { await api.admin.deleteAIService(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-emerald-100 placeholder-emerald-400 dark:placeholder-emerald-600 bg-white dark:bg-emerald-900/40 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-emerald-900 dark:text-white">AI Services</h2>
        <button onClick={() => { setShowAdd(true); setEdit(null); setForm(emptyForm()); setPreview(''); }} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-600 dark:text-red-400" /><p className="text-xs text-red-700 dark:text-red-300">{formError}</p></div>}

      {(showAdd || edit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
          <div className="bg-white dark:bg-emerald-900 rounded-2xl border border-emerald-100 dark:border-emerald-700 p-6 w-full max-w-lg mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-white">{edit ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={resetForm} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-emerald-700 dark:text-emerald-300 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. AI Plant Diagnosis" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-emerald-700 dark:text-emerald-300 mb-1">Image</label>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
                <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 text-sm hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer">
                  {form.image ? form.image.name : 'Choose'}
                </button>
              </div>
              {preview && <img src={preview} alt="" className="w-24 h-24 rounded-lg object-cover" />}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 text-sm hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-100 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [1,2,3].map(i => (
              <tr key={i} className="border-b border-emerald-100 dark:border-emerald-700"><td colSpan={4} className="p-3"><Skeleton className="h-6 w-full" /></td></tr>
            )) : items.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-emerald-400">No services yet</td></tr>
            ) : items.map((s) => (
              <tr key={s.id} className="border-b border-emerald-100 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.image_url ? <img src={s.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '-'}</td>
                <td className="p-3 font-medium text-emerald-900 dark:text-white">{s.name}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-800 text-blue-600 dark:text-blue-400 hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-800 text-red-500 hover:bg-emerald-100 dark:hover:bg-emerald-700 cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
