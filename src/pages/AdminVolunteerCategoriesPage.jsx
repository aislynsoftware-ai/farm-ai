import { useState, useEffect } from 'react';
import { List, Plus, Loader, CheckCircle, AlertCircle, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';

export default function AdminVolunteerCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetch = () => {
    setLoading(true);
    api.volunteer.admin.categories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (editing) {
        await api.volunteer.admin.updateCategory(editing.id, form);
        setSuccess('Category updated');
      } else {
        await api.volunteer.admin.addCategory(form);
        setSuccess('Category added');
      }
      fetch();
      setTimeout(() => setShowModal(false), 800);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.name}"?`)) return;
    try {
      await api.volunteer.admin.deleteCategory(c.id);
      setSuccess('Category deleted');
      fetch();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><List size={20} className="text-emerald-500" /> Volunteer Categories</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600 dark:text-red-400">{error}</p></div>}
      {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-3 text-gray-400">{c.id}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.description || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">No categories</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Tomato" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Optional description" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {saving ? <Loader size={14} className="animate-spin mx-auto" /> : editing ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}