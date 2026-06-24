import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

const emptyForm = () => ({ name: '', description: '', image: null });

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
    setForm({ name: item.name, description: item.description || '', image: null });
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

  const inputClass = "w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">AI Services</h2>
        <button onClick={() => { setShowAdd(true); setEdit(null); setForm(emptyForm()); setPreview(''); }} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {/* Modal */}
      {(showAdd || edit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{edit ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. AI Plant Diagnosis" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image</label>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
                <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
                  {form.image ? form.image.name : 'Choose'}
                </button>
              </div>
              {preview && <img src={preview} alt="" className="w-24 h-24 rounded-lg object-cover" />}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [1,2,3].map(i => (
              <tr key={i} className="border-b border-gray-700/50"><td colSpan={5} className="p-3"><Skeleton className="h-6 w-full" /></td></tr>
            )) : items.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No services yet</td></tr>
            ) : items.map((s) => (
              <tr key={s.id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.image_url ? <img src={s.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '-'}</td>
                <td className="p-3 font-medium text-white">{s.name}</td>
                <td className="p-3 text-xs text-gray-400 max-w-xs truncate">{s.description || '-'}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
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
