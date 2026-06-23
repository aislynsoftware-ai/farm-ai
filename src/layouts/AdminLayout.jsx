import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Leaf, Sprout, ShoppingBag, CreditCard, Menu, X, LogOut, Brain, Crown } from 'lucide-react';
import api from '../services/api';

const SIDEBAR = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/plans', label: 'Plans', icon: Crown },
  { path: '/admin/agri-titles', label: 'Agri Titles', icon: Leaf },
  { path: '/admin/crops', label: 'Crops', icon: Sprout },
  { path: '/admin/sub-crops', label: 'Sub Crops', icon: Sprout },
  { path: '/admin/products', label: 'Products', icon: ShoppingBag },
  { path: '/admin/orders', label: 'Orders', icon: CreditCard },
  { path: '/admin/predictions', label: 'Predictions', icon: Brain },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login', { replace: true }); return; }
    api.admin.verify().then(() => setLoading(false)).catch(() => {
      localStorage.removeItem('admin_token');
      navigate('/admin/login', { replace: true });
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur border-r border-gray-700 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-65px)]">
          {SIDEBAR.map((s) => (
            <button
              key={s.path}
              onClick={() => { navigate(s.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${location.pathname === s.path ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          ))}
          <hr className="my-3 border-gray-700" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all cursor-pointer">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="lg:ml-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 lg:hidden bg-gray-800/80 backdrop-blur border-b border-gray-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-700 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-white">Admin</span>
        </div>
        <div className="flex-1 p-4 lg:p-6 space-y-5 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
