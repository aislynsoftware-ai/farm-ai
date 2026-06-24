import { useState, useEffect } from 'react';
import { Users, CreditCard, Leaf, ShoppingBag, Cpu, Sprout, Layers, IndianRupee } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getDashboardStats().then((d) => {
      if (d) setStats(d);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32" />)}
    </div>
  );

  const s = stats || {};
  const cards = [
    { label: 'Total Users', value: s.users ?? 0, icon: Users, color: 'text-emerald-500' },
    { label: 'Revenue', value: '₹' + (s.revenue || 0), icon: IndianRupee, color: 'text-emerald-500' },
    { label: 'AI Services', value: s.ai_services ?? 0, icon: Cpu, color: 'text-emerald-500' },
    { label: 'Agri Titles', value: s.agri_titles ?? 0, icon: Leaf, color: 'text-emerald-500' },
    { label: 'Crops', value: s.crops ?? 0, icon: Sprout, color: 'text-emerald-500' },
    { label: 'Sub Crops', value: s.sub_crops ?? 0, icon: Layers, color: 'text-emerald-500' },
    { label: 'Products', value: s.products ?? 0, icon: ShoppingBag, color: 'text-emerald-500' },
    { label: 'Orders', value: s.payments ?? 0, icon: CreditCard, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 p-5">
            <c.icon className={`w-6 h-6 ${c.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
