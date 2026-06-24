import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import Skeleton, { SkeletonRow } from '../components/common/Skeleton';
import api from '../services/api';

const emptyForm = () => ({ name: '', price: '', requests: '', features: [], popular: false, featureInput: '' });

export default function AdminApiPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { setPlans(await api.admin.getApiPlans()); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const show = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const resetForm = () => { setEdit(null); setShowAdd(false); setForm(emptyForm()); setError(''); };

  const openEdit = (p) => {
    let features = p.features;
    if (typeof features === 'string') { try { features = JSON.parse(features); } catch { features = []; } }
    setEdit(p);
    setForm({ name: p.name, price: p.price, requests: p.requests, features, popular: !!p.popular, featureInput: '' });
  };

  const addFeature = () => {
    const f = form.featureInput.trim();
    if (!f) return;
    setForm((p) => ({ ...p, features: [...p.features, f], featureInput: '' }));
  };

  const removeFeature = (i) => {
    setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setFormLoading(true);
    const data = { name: form.name, price: form.price, requests: form.requests, features: form.features, popular: form.popular };
    try {
      if (edit) { await api.admin.updateApiPlan(edit.id, data); show('Updated'); }
      else { await api.admin.addApiPlan(data); show('Added'); }
      resetForm(); load();
    } catch (err) { setError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this API plan?')) return;
    try { await api.admin.deleteApiPlan(id); show('Deleted'); load(); }
    catch (err) { setError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Plans (Pricing)</h2>
        <button onClick={() => { setShowAdd(true); setEdit(null); setForm(emptyForm()); }} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Plan
        </button>
      </div>

      {success && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-gray-600 dark:text-gray-400" /><p className="text-xs text-gray-700 dark:text-gray-300">{success}</p></div>}
      {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-600 dark:text-red-400" /><p className="text-xs text-red-700 dark:text-red-300">{error}</p></div>}

      {/* Add/Edit Modal */}
      {(showAdd || edit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 w-full max-w-lg mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{edit ? 'Edit API Plan' : 'Add API Plan'}</h3>
              <button onClick={resetForm} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Plan Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. PREMIUM" className={inputClass} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Price (₹)</label>
                  <input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="₹99" className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Requests</label>
                  <input value={form.requests} onChange={(e) => setForm((p) => ({ ...p, requests: e.target.value }))} placeholder="150 Requests" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input value={form.featureInput} onChange={(e) => setForm((p) => ({ ...p, featureInput: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Add a feature..." className={inputClass} />
                  <button type="button" onClick={addFeature} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs">
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-500 cursor-pointer"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm((p) => ({ ...p, popular: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Mark as Popular</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        [1,2,3].map(i => <Skeleton key={i} className="h-12" />)
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-emerald-200 dark:border-emerald-700 text-gray-600 dark:text-gray-400 text-left">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Requests</th>
                <th className="p-3 font-medium">Popular</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-emerald-500">No API plans yet</td></tr>
              ) : plans.map((p) => (
                <tr key={p.id} className="border-b border-emerald-200 dark:border-emerald-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="p-3">{p.price}</td>
                  <td className="p-3">{p.requests}</td>
                  <td className="p-3">{!!p.popular ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-400">Yes</span> : '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
