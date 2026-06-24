import { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, Loader, AlertCircle, CheckCircle as CheckIcon } from 'lucide-react';
import Skeleton, { SkeletonRow } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', coins: '', is_verified: true });

  const load = () => { setLoading(true); api.admin.getUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleEdit = (u) => {
    setEditUser(u.user_id);
    setEditForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', coins: String(u.coins ?? 0), is_verified: !!u.is_verified });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await api.admin.updateUser(editUser, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        coins: parseInt(editForm.coins) || 0,
        is_verified: editForm.is_verified,
      });
      show('User updated');
      setEditUser(null);
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (userId) => {
    if (!confirm(`Delete user ${userId}?`)) return;
    try { await api.admin.deleteUser(userId); show('User deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Users</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckIcon size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit User — {editUser}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={inputClass} />
              <input value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className={inputClass} />
              <input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className={inputClass} />
              <input value={editForm.coins} onChange={(e) => setEditForm((p) => ({ ...p, coins: e.target.value }))} placeholder="Coins" type="number" className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                <input type="checkbox" checked={editForm.is_verified} onChange={(e) => setEditForm((p) => ({ ...p, is_verified: e.target.checked }))} className="rounded border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-emerald-500 focus:ring-emerald-500" />
                Verified
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-200 dark:border-emerald-700 text-gray-600 dark:text-gray-400 text-left">
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Coins</th>
              <th className="p-3 font-medium">Verified</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [1,2,3,4,5].map(i => <SkeletonRow key={i} cols={7} />) : users.length === 0 ? <tr><td colSpan={7} className="p-6 text-center text-gray-500">No users found</td></tr> : users.map((u) => (
              <tr key={u.user_id} className="border-b border-emerald-200 dark:border-emerald-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700/50">
                <td className="p-3 font-mono text-xs">{u.user_id}</td>
                <td className="p-3">{u.name || '-'}</td>
                <td className="p-3">{u.email || '-'}</td>
                <td className="p-3">{u.phone || '-'}</td>
                <td className="p-3">{u.coins}</td>
                <td className="p-3">{u.is_verified ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(u)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(u.user_id)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-500">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
