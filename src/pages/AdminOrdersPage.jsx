import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.admin.getPayments().then(setOrders).catch(() => {});
  }, []);

  const statusClass = (status) => {
    if (status === 'success') return 'bg-emerald-900/50 text-emerald-400';
    if (status?.startsWith('plan_')) return 'bg-blue-900/50 text-blue-400';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Orders</h2>
      <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Order ID</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((p) => (
              <tr key={p.id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3">{p.id}</td>
                <td className="p-3 font-mono text-xs">{p.user_id}</td>
                <td className="p-3 font-mono text-xs">{p.order_id}</td>
                <td className="p-3">₹{p.amount}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClass(p.status)}`}>{p.status}</span></td>
                <td className="p-3 text-xs">{p.created_at || '-'}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
