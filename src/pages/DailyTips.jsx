import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Leaf, Sun, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';
import SEO from '../components/common/SEO';

const categories = [
  { key: 'tip_of_day', label: 'Tip of the Day', icon: Lightbulb },
  { key: 'plant_hack', label: 'Plant Hacks', icon: Sparkles },
  { key: 'seasonal', label: 'Seasonal Alerts', icon: Sun },
];

const icons = { tip_of_day: Lightbulb, plant_hack: Sparkles, seasonal: Sun };

export default function DailyTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    api.dailyTips.list(category || undefined)
      .then(setTips)
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-14">
      <SEO title="Daily Tips" description="Get daily farming tips, plant care hacks, and seasonal alerts." url="/daily-tips" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full bg-emerald-500" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Daily Tips</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Plant care hacks, tips of the day, and seasonal alerts to keep your garden thriving.</p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setCategory('')} className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${!category ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCategory(c.key)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${category === c.key ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}>
              <c.icon size={14} />
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <Skeleton className="w-24 h-3 mb-2" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-full h-3" />
              </div>
            ))}
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No tips found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tips.map((tip, i) => {
              const Icon = icons[tip.category] || Lightbulb;
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${
                          tip.category === 'tip_of_day' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                          tip.category === 'plant_hack' ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400' :
                          'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                        }`}>
                          {tip.category === 'tip_of_day' ? 'Tip of the Day' : tip.category === 'plant_hack' ? 'Plant Hack' : 'Seasonal Alert'}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tip.title}</h3>
                        {tip.content && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tip.content}</p>}
                      </div>
                      <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}