import { useState, useEffect } from 'react';
import { Store, Check, X, Loader, ExternalLink, MapPin } from 'lucide-react';
import api from '../services/api';

export default function AdminShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setShops(await api.shops.admin.list()); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try { await api.shops.admin.approve(id); load(); } catch {}
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try { await api.shops.admin.reject(id); load(); } catch {}
    setActionLoading(null);
  };

  const statusBadge = (status) => {
    if (status === 'approved') return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300';
    if (status === 'rejected') return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
    return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fertilizer Shops</h2>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
          <Store size={36} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No shop registrations yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-emerald-200 dark:border-emerald-700 text-gray-600 dark:text-gray-400 text-left">
                <th className="p-3 font-medium">Shop</th>
                <th className="p-3 font-medium">Owner</th>
                <th className="p-3 font-medium">Location</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-b border-emerald-200 dark:border-emerald-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {s.photo_url ? <img src={s.photo_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <Store size={20} className="text-emerald-400" />}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">{s.shop_name}</p>
                        {s.phone && <p className="text-[10px] text-gray-500">{s.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-xs">{s.owner_name || '-'}</p>
                    <p className="text-[10px] text-gray-500">{s.owner_email || s.user_id}</p>
                  </td>
                  <td className="p-3">
                    {s.latitude ? (
                      <a href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-emerald-600 hover:underline">
                        <MapPin size={10} /> Map
                      </a>
                    ) : '-'}
                    {s.address && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{s.address}</p>}
                  </td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge(s.status)}`}>{s.status}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {s.status !== 'approved' && (
                        <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id} className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-800 disabled:opacity-50 cursor-pointer">
                          {actionLoading === s.id ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                        </button>
                      )}
                      {s.status !== 'rejected' && (
                        <button onClick={() => handleReject(s.id)} disabled={actionLoading === s.id} className="p-1.5 rounded bg-red-100 dark:bg-red-900/50 text-red-500 hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 cursor-pointer">
                          <X size={12} />
                        </button>
                      )}
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
