import { useState, useEffect } from 'react';
import Skeleton, { SkeletonRow } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getPayments().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusClass = (status) => {
    if (status === 'success') return 'bg-emerald-900/50 text-emerald-400';
    if (status?.startsWith('plan_')) return 'bg-blue-900/50 text-blue-400';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orders</h2>
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-200 dark:border-emerald-700 text-gray-600 dark:text-gray-400 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Order ID</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [1,2,3,4,5].map(i => <SkeletonRow key={i} cols={6} />) : orders.map((p) => (
              <tr key={p.id} className="border-b border-emerald-200 dark:border-emerald-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700/50">
                <td className="p-3">{p.id}</td>
                <td className="p-3 font-mono text-xs">{p.user_id}</td>
                <td className="p-3 font-mono text-xs">{p.order_id}</td>
                <td className="p-3">₹{p.amount}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClass(p.status)}`}>{p.status}</span></td>
                <td className="p-3 text-xs">{p.created_at || '-'}</td>
              </tr>
            ))}
            {!loading && orders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-emerald-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
