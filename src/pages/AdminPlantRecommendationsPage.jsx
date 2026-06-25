import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Leaf, Image } from 'lucide-react';
import api from '../services/api';

export default function AdminPlantRecommendationsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ category: '', plant_name: '', scientific_name: '', description: '', benefits: '', care_tips: '', image: null, image_url: '' });

  const fetch = () => {
    setLoading(true);
    api.plantRecs.admin.list().then(setPlants).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEdit(null); setForm({ category: '', plant_name: '', scientific_name: '', description: '', benefits: '', care_tips: '', image: null, image_url: '' }); setShowModal(true); };
  const openEdit = (p) => { setEdit(p); setForm({ category: p.category, plant_name: p.plant_name, scientific_name: p.scientific_name || '', description: p.description || '', benefits: p.benefits || '', care_tips: p.care_tips || '', image: null, image_url: p.image_url || '' }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.category.trim() || !form.plant_name.trim()) return;
    if (edit) { await api.plantRecs.admin.update(edit.id, form); } else { await api.plantRecs.admin.add(form); }
    setShowModal(false); fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plant?')) return;
    await api.plantRecs.admin.delete(id); fetch();
  };

  const inputClass = "w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Plant Recommendations</h2>
          <p className="text-xs text-gray-500">Manage plants by category (bedroom, office, air-purifying, etc.)</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer">
          <Plus size={14} /> Add Plant
        </button>
      </div>

      {loading ? <p className="text-xs text-gray-400">Loading...</p> : plants.length === 0 ? (
        <p className="text-xs text-gray-400">No plants yet.</p>
      ) : (
        <div className="space-y-2">
          {plants.map((p) => (
            <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 overflow-hidden">
                {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <Leaf size={18} className="text-emerald-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 mb-1">{p.category}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.plant_name}</p>
                {p.scientific_name && <p className="text-[11px] text-gray-400 italic">{p.scientific_name}</p>}
                {p.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"><Edit3 size={13} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{edit ? 'Edit Plant' : 'Add Plant'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Category (e.g. Bedroom, Office)" className={inputClass} />
              <input value={form.plant_name} onChange={(e) => setForm(p => ({ ...p, plant_name: e.target.value }))} placeholder="Plant name *" className={inputClass} />
              <input value={form.scientific_name} onChange={(e) => setForm(p => ({ ...p, scientific_name: e.target.value }))} placeholder="Scientific name (optional)" className={inputClass} />
              <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
              <textarea value={form.benefits} onChange={(e) => setForm(p => ({ ...p, benefits: e.target.value }))} placeholder="Benefits (comma separated or short text)" rows={2} className={`${inputClass} resize-none`} />
              <textarea value={form.care_tips} onChange={(e) => setForm(p => ({ ...p, care_tips: e.target.value }))} placeholder="Care tips (comma separated or short text)" rows={2} className={`${inputClass} resize-none`} />
              <div>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 hover:border-emerald-400 cursor-pointer">
                  <Image size={14} className="text-emerald-500" />
                  {form.image ? form.image.name : form.image_url ? 'Change image' : 'Upload plant image'}
                  <input type="file" accept="image/*" onChange={(e) => setForm(p => ({ ...p, image: e.target.files[0] || null }))} className="hidden" />
                </label>
                {form.image && <p className="text-[10px] text-emerald-600 mt-1">{form.image.name}</p>}
                {form.image_url && !form.image && <p className="text-[10px] text-gray-400 mt-1">Current: {form.image_url.split('/').pop()}</p>}
              </div>
              <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer">
                {edit ? 'Update' : 'Add'} Plant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}