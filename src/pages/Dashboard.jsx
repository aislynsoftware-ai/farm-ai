import { useState, useEffect } from 'react';
import { Menu, Bug, Leaf, Apple, History, FileText, Sprout, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatsCards from '../components/dashboard/StatsCards';
import RecentPredictions from '../components/dashboard/RecentPredictions';
import ProfileSummary from '../components/dashboard/ProfileSummary';
import DashboardCard from '../components/ui/DashboardCard';
import api from '../services/api';

const dashboardItems = [
  { id: 1, icon: Bug, title: 'Disease Detection', description: 'Upload plant images to detect diseases, pests, and nutrient deficiencies instantly.' },
  { id: 2, icon: Leaf, title: 'Plant Identification', description: 'Identify plant species from photos with our comprehensive plant database.' },
  { id: 3, icon: Apple, title: 'Food Identification', description: 'Analyze food items to get nutritional information and dietary insights.' },
  { id: 4, icon: History, title: 'Prediction History', description: 'View your past analyses, results, and track changes over time.' },
  { id: 5, icon: FileText, title: 'AI Reports', description: 'Access detailed AI-generated reports with actionable recommendations.' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmingTips, setFarmingTips] = useState([]);
  const [crops, setCrops] = useState([]);
  const [agriTitles, setAgriTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tipsRes, cropsRes, titlesRes] = await Promise.allSettled([
          api.farming.tips(),
          api.farming.crops(),
          api.farming.agriTitles(),
        ]);
        if (tipsRes.status === 'fulfilled') setFarmingTips(tipsRes.value.data || tipsRes.value.tips || []);
        if (cropsRes.status === 'fulfilled') setCrops(cropsRes.value.data || cropsRes.value.crops || []);
        if (titlesRes.status === 'fulfilled') setAgriTitles(titlesRes.value.data || titlesRes.value.titles || []);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl">
          <WelcomeBanner />
          <StatsCards />

          {/* Farming Tips from API */}
          {farmingTips.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sprout size={16} className="text-emerald-500" /> Farming Tips
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {farmingTips.slice(0, 6).map((tip, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                    <p className="text-xs text-gray-700 dark:text-gray-300">{typeof tip === 'string' ? tip : tip.title || tip.tip || tip.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Crops from API */}
          {crops.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" /> Available Crops
              </h3>
              <div className="flex flex-wrap gap-2">
                {crops.map((crop, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    {typeof crop === 'string' ? crop : crop.name || crop.title || crop.crop}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2"><RecentPredictions /></div>
            <div><ProfileSummary /></div>
          </div>

          {/* Agri Titles from API */}
          {agriTitles.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" /> Agricultural Resources
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {agriTitles.map((title, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{typeof title === 'string' ? title : title.title || title.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Available Tools</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardItems.map((item, index) => (
                <DashboardCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
