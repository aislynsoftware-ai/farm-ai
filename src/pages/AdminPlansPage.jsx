import { useState, useEffect } from 'react';
import Skeleton, { SkeletonRow } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminPlansPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getUserPlans().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const planColor = (plan) => {
    const p = plan?.toLowerCase();
    if (p === 'free') return 'bg-gray-700 text-gray-400';
    if (p === 'basic') return 'bg-blue-900/50 text-blue-400';
    if (p === 'standard') return 'bg-purple-900/50 text-purple-400';
    if (p === 'pro') return 'bg-yellow-900/50 text-yellow-400';
    if (p === 'enterprise') return 'bg-red-900/50 text-red-400';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">User Plans</h2>
      <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Coins</th>
              <th className="p-3 font-medium">Plan</th>
              <th className="p-3 font-medium">Plan Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [1,2,3,4,5].map(i => <SkeletonRow key={i} cols={7} />) : data.map((u) => (
              <tr key={u.user_id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3 font-mono text-xs">{u.user_id}</td>
                <td className="p-3">{u.name || '-'}</td>
                <td className="p-3">{u.email || '-'}</td>
                <td className="p-3">{u.phone || '-'}</td>
                <td className="p-3">{u.coins}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${planColor(u.plan)}`}>{u.plan || 'free'}</span></td>
                <td className="p-3 text-xs">{u.plan_updated || '-'}</td>
              </tr>
            ))}
            {!loading && data.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-500">No data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
