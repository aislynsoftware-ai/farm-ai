import { motion } from 'framer-motion';
import { Bug, Leaf, Apple, History, FileText, Bell } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import DashboardCard from '../components/ui/DashboardCard';

const dashboardItems = [
  {
    id: 1,
    icon: Bug,
    title: 'Disease Detection',
    description: 'Upload plant images to detect diseases, pests, and nutrient deficiencies instantly.',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Plant Identification',
    description: 'Identify plant species from photos with our comprehensive plant database.',
  },
  {
    id: 3,
    icon: Apple,
    title: 'Food Identification',
    description: 'Analyze food items to get nutritional information and dietary insights.',
  },
  {
    id: 4,
    icon: History,
    title: 'Prediction History',
    description: 'View your past analyses, results, and track changes over time.',
  },
  {
    id: 5,
    icon: FileText,
    title: 'AI Reports',
    description: 'Access detailed AI-generated reports with actionable recommendations.',
  },
];

export default function Dashboard() {
  return (
    <main>
      <PageHeader
        title="Coming Soon Dashboard"
        description="Our intelligent dashboard is under development. Get ready for a powerful suite of AI tools."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="glass rounded-3xl p-8 lg:p-12 mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-800">
              <Bell className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              We are Building Something Amazing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our team is working hard to bring you a comprehensive dashboard with all the tools you need.
              Stay tuned for the launch!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dashboardItems.map((item, index) => (
              <DashboardCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
