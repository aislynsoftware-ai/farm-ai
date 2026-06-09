import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatsCards from '../components/dashboard/StatsCards';
import RecentPredictions from '../components/dashboard/RecentPredictions';
import ProfileSummary from '../components/dashboard/ProfileSummary';
import DashboardCard from '../components/ui/DashboardCard';
import { Bug, Leaf, Apple, History, FileText } from 'lucide-react';

const dashboardItems = [
  { id: 1, icon: Bug, title: 'Disease Detection', description: 'Upload plant images to detect diseases, pests, and nutrient deficiencies instantly.' },
  { id: 2, icon: Leaf, title: 'Plant Identification', description: 'Identify plant species from photos with our comprehensive plant database.' },
  { id: 3, icon: Apple, title: 'Food Identification', description: 'Analyze food items to get nutritional information and dietary insights.' },
  { id: 4, icon: History, title: 'Prediction History', description: 'View your past analyses, results, and track changes over time.' },
  { id: 5, icon: FileText, title: 'AI Reports', description: 'Access detailed AI-generated reports with actionable recommendations.' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl">
          <WelcomeBanner />
          <StatsCards />

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <RecentPredictions />
            </div>
            <div>
              <ProfileSummary />
            </div>
          </div>

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
