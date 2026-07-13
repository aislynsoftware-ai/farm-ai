import { useState, useEffect } from 'react';
import { Hand, Search, Loader, CheckCircle, X } from 'lucide-react';
import api from '../services/api';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.volunteer.admin.volunteers().then(setVolunteers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = volunteers.filter((v) =>
    !search || v.name?.toLowerCase().includes(search.toLowerCase()) || v.email?.toLowerCase().includes(search.toLowerCase()) || v.referral_code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Hand size={20} className="text-emerald-500" /> Volunteers</h1>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or referral code..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Referral Code</th>
                <th className="text-center px-4 py-3 font-medium">Total Earnings</th>
                <th className="text-center px-4 py-3 font-medium">Images</th>
                <th className="text-center px-4 py-3 font-medium">Pending</th>
                <th className="text-center px-4 py-3 font-medium">Active</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{v.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-500">{v.email || 'N/A'}</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">{v.referral_code}</td>
                  <td className="px-4 py-3 text-center font-medium">{parseFloat(v.total_earnings || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">{v.total_images || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${v.pending_images > 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'text-gray-400'}`}>{v.pending_images || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-center">{v.is_active ? <CheckCircle size={14} className="text-emerald-500 inline" /> : <X size={14} className="text-red-500 inline" />}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(v.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400">No volunteers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}