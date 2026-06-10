import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, ChevronRight, Search } from 'lucide-react';
import api from '../services/api';

export default function AgricultureDetail() {
  const { id } = useParams();
  const [agri, setAgri] = useState(null);
  const [crops, setCrops] = useState([]);
  const [subs, setSubs] = useState([]);

  const isLoggedIn = () => {
    try { return !!JSON.parse(localStorage.getItem('user') || '{}').user_id; } catch { return false; }
  };

  const authLink = (path) => {
    if (!isLoggedIn()) return '/login';
    return path;
  };

  const predictLink = (sub) => authLink(`/crop/${sub.id}`);

  useEffect(() => {
    async function fetch() {
      const [agriRes, cropsRes, subsRes] = await Promise.allSettled([
        api.farming.agriTitles(),
        api.farming.allCrops(),
        api.farming.crops(),
      ]);

      const allAgri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
      const allCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
      const allSubs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];

      const found = allAgri.find((a) => Number(a.id) === Number(id));
      setAgri(found);
      setCrops(allCrops.filter((c) => Number(c.agri_id) === Number(id)));
      setSubs(allSubs);
    }
    fetch();
  }, [id]);

  if (!agri) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/services" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ArrowLeft size={14} /> Back to Services
        </Link>

        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {agri.image_url && (
            <img src={agri.image_url} alt={agri.title} className="w-full h-48 object-contain rounded-xl mb-4" />
          )}
          <h1 className="text-2xl font-bold text-white">{agri.title}</h1>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {crops.map((crop) => {
            const cropSubs = subs.filter((s) => Number(s.crop_id) === Number(crop.id));
            return (
              <motion.div
                key={crop.id}
                className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {crop.image_url ? (
                  <img src={crop.image_url} alt={crop.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30">
                    <Sprout size={40} className="text-emerald-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{crop.title}</h3>

                  {cropSubs.length > 0 ? (
                    <div className="space-y-1">
                      {cropSubs.map((sub) => (
                        <Link
                          key={sub.id}
                          to={predictLink(sub)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
                        >
                          {sub.image_url ? (
                            <img src={sub.image_url} alt={sub.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <Sprout size={18} className="text-emerald-500 flex-shrink-0" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-1 font-medium">{sub.title}</span>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={authLink('/predict')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                    >
                      <Search size={14} /> Upload & Detect
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {crops.length === 0 && (
          <div className="text-center py-16">
            <Sprout size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No crops found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
