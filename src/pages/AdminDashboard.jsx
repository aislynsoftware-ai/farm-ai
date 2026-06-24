import { useState, useEffect } from 'react';
import { Users, CreditCard, Leaf, ShoppingBag } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getUsers().catch(() => []),
      api.admin.getPayments().catch(() => []),
      api.farming.agriTitles().catch(() => []),
      api.farming.cropWithProducts().catch(() => []),
    ]).then(([u, p, a, pr]) => {
      setStats({ users: u.length, payments: p.length, agriTitles: a.length, products: pr.length });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
    </div>
  );

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-emerald-400' },
    { label: 'Total Orders', value: stats.payments, icon: CreditCard, color: 'text-blue-400' },
    { label: 'Agri Titles', value: stats.agriTitles, icon: Leaf, color: 'text-green-400' },
    { label: 'Products', value: stats.products, icon: ShoppingBag, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-900 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700 p-5">
            <c.icon className={`w-6 h-6 ${c.color} mb-2`} />
            <p className="text-2xl font-bold text-emerald-900 dark:text-white">{c.value}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
