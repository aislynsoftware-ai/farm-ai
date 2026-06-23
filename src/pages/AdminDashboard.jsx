import { useState, useEffect } from 'react';
import { Users, CreditCard, Leaf, ShoppingBag } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, payments: 0, agriTitles: 0, products: 0 });

  useEffect(() => {
    Promise.all([
      api.admin.getUsers().catch(() => []),
      api.admin.getPayments().catch(() => []),
      api.farming.agriTitles().catch(() => []),
      api.farming.cropWithProducts().catch(() => []),
    ]).then(([u, p, a, pr]) => {
      setStats({ users: u.length, payments: p.length, agriTitles: a.length, products: pr.length });
    });
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-emerald-400' },
    { label: 'Total Orders', value: stats.payments, icon: CreditCard, color: 'text-blue-400' },
    { label: 'Agri Titles', value: stats.agriTitles, icon: Leaf, color: 'text-green-400' },
    { label: 'Products', value: stats.products, icon: ShoppingBag, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-gray-800/80 border border-gray-700 p-5">
            <c.icon className={`w-6 h-6 ${c.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
