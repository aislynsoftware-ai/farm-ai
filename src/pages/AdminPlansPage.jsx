import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import Skeleton, { SkeletonRow } from '../components/common/Skeleton';
import api from '../services/api';

const emptyForm = () => ({ name: '', price: 0, coins: 0 });

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('plans');
  const [edit, setEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, u] = await Promise.all([api.admin.getPlans(), api.admin.getUserPlans()]);
      setPlans(p); setUsers(u);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const show = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const resetForm = () => { setEdit(null); setShowAdd(false); setForm(emptyForm()); setError(''); };

  const openEdit = (p) => { setEdit(p); setForm({ name: p.name, price: p.price, coins: p.coins }); };

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setFormLoading(true);
    try {
      if (edit) {
        await api.admin.updatePlan(edit.id, form); show('Updated');
      } else {
        await api.admin.addPlan(form); show('Added');
      }
      resetForm(); load();
    } catch (err) { setError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try { await api.admin.deletePlan(id); show('Deleted'); load(); }
    catch (err) { setError(err.message); }
  };

  const planColor = (plan) => {
    const p = plan?.toLowerCase();
    if (p === 'free') return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-400';
    if (p === 'basic') return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400';
    if (p === 'standard') return 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400';
    if (p === 'pro') return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400';
    return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-400';
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-gray-100 placeholder-gray-400 text-sm";

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-emerald-100 dark:bg-gray-800">
          <button onClick={() => setTab('plans')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === 'plans' ? 'bg-white dark:bg-emerald-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-800'}`}>Plans</button>
          <button onClick={() => setTab('users')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === 'users' ? 'bg-white dark:bg-emerald-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-800'}`}>Users</button>
        </div>
        {tab === 'plans' && (
          <button onClick={() => { setShowAdd(true); setEdit(null); setForm(emptyForm()); }} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Plan
          </button>
        )}
      </div>

      {success && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-gray-600 dark:text-gray-400" /><p className="text-xs text-gray-700 dark:text-gray-300">{success}</p></div>}
      {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-600 dark:text-red-400" /><p className="text-xs text-red-700 dark:text-red-300">{error}</p></div>}

      {/* Add/Edit Modal */}
      {(showAdd || edit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={resetForm}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{edit ? 'Edit Plan' : 'Add Plan'}</h3>
              <button onClick={resetForm} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. PREMIUM" className={inputClass} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))} className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Coins</label>
                  <input type="number" min="0" value={form.coins} onChange={(e) => setForm((p) => ({ ...p, coins: parseInt(e.target.value) || 0 }))} className={inputClass} />
                </div>
              </div>
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
        <div className="space-y-3">{tab === 'plans' ? [1,2,3].map(i => <Skeleton key={i} className="h-12" />) : [1,2,3].map(i => <SkeletonRow key={i} cols={7} />)}</div>
      ) : tab === 'plans' ? (
        /* Plans Table */
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-left">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Coins</th>
                <th className="p-3 font-medium">Coin/₹</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-emerald-500">No plans yet</td></tr>
              ) : plans.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.coins}</td>
                  <td className="p-3">{p.price > 0 ? (p.coins / p.price).toFixed(1) + 'x' : '-'}</td>
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
      ) : (
        /* Users Table */
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-left">
                <th className="p-3 font-medium">User ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Coins</th>
                <th className="p-3 font-medium">Plan</th>
                <th className="p-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-emerald-500">No data</td></tr>
              ) : users.map((u) => (
                <tr key={u.user_id} className="border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-3 font-mono text-xs">{u.user_id}</td>
                  <td className="p-3">{u.name || '-'}</td>
                  <td className="p-3">{u.email || '-'}</td>
                  <td className="p-3">{u.coins}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${planColor(u.plan)}`}>{u.plan || 'free'}</span></td>
                  <td className="p-3 text-xs">{u.plan_updated || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
