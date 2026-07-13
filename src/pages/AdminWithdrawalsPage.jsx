import { useState, useEffect } from 'react';
import { Wallet, Loader, CheckCircle, X, Filter } from 'lucide-react';
import api from '../services/api';

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectNote, setRejectNote] = useState({});

  const load = (status) => {
    setLoading(true);
    api.volunteer.admin.withdrawals(status).then(setRequests).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await api.volunteer.admin.approveWithdrawal(id);
      load(filter);
    } catch (err) { alert(err.message); }
  };

  const handleReject = async (id) => {
    const note = rejectNote[id] || '';
    try {
      await api.volunteer.admin.rejectWithdrawal(id, note);
      setRejectNote((p) => ({ ...p, [id]: '' }));
      load(filter);
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Wallet size={20} className="text-emerald-500" /> Withdrawal Requests</h1>
      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${filter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {requests.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name || r.email} <span className="text-emerald-600 dark:text-emerald-400">- {parseFloat(r.amount).toFixed(2)} rs</span></p>
                <p className="text-[11px] text-gray-500">{r.email} | {r.phone || 'No phone'}</p>
                <p className="text-[11px] text-gray-400">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : r.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>{r.status}</span>
            </div>
            {(r.account_details || r.upi_id) && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
                {r.account_details && <p>Account: {r.account_details}</p>}
                {r.upi_id && <p>UPI: {r.upi_id}</p>}
              </div>
            )}
            {r.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => handleApprove(r.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer"><CheckCircle size={12} className="inline mr-1" />Approve</button>
                <div className="flex gap-1">
                  <input value={rejectNote[r.id] || ''} onChange={(e) => setRejectNote((p) => ({ ...p, [r.id]: e.target.value }))} placeholder="Rejection note" className="w-32 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400" />
                  <button onClick={() => handleReject(r.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 cursor-pointer"><X size={12} className="inline mr-1" />Reject</button>
                </div>
              </div>
            )}
            {r.admin_note && <p className="text-[11px] text-red-500 mt-2">Note: {r.admin_note}</p>}
          </div>
        ))}
        {requests.length === 0 && <p className="text-center py-8 text-xs text-gray-400">No withdrawal requests found</p>}
      </div>
    </div>
  );
}