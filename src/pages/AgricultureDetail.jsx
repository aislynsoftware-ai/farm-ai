import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, ChevronRight, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Skeleton, { DetailHeaderSkeleton, GridCardSkeleton } from '../components/common/Skeleton';

export default function AgricultureDetail() {
  const { id } = useParams();
  const [agri, setAgri] = useState(null);
  const [crops, setCrops] = useState([]);
  const [subs, setSubs] = useState([]);

  const isLoggedIn = () => {
    try { return !!localStorage.getItem('token'); } catch { return false; }
  };

  const authLink = (path) => {
    if (!isLoggedIn()) return '/login';
    return path;
  };

  const cropClickPath = (crop) => {
    const cropSubs = subs.filter((s) => Number(s.crop_id) === Number(crop.id));
    if (cropSubs.length === 0) return authLink('/predict');
    return authLink(`/agriculture/${id}/crop/${crop.id}`);
  };

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
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="w-32 h-4 mb-4" />
        <DetailHeaderSkeleton />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <GridCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/services" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 mb-4">
          <ArrowLeft size={14} /> Back to Services
        </Link>

        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          {agri.image_url && (
            <div className="relative mb-4">
              <img src={agri.image_url} alt={agri.title} className="w-full h-40 object-contain rounded-xl" />
            </div>
          )}
          <div className="relative">
            <p className="text-emerald-100/70 text-xs mb-1">Category</p>
            <h1 className="text-2xl font-bold text-white">{agri.title}</h1>
            <p className="text-emerald-100/80 text-sm mt-2">Select a crop type to begin detection</p>
          </div>
        </motion.div>

        {crops.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {crops.map((crop, index) => {
              const cropSubs = subs.filter((s) => Number(s.crop_id) === Number(crop.id));
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="h-full"
                >
                  {cropSubs.length > 0 ? (
                    <Link
                      to={`/agriculture/${id}/crop/${crop.id}`}
                      className="group block h-full rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                    >
                      <div className="relative mt-2 mb-2 rounded-[20px] mb-4">
                        {crop.image_url ? (
                          <img src={crop.image_url} alt={crop.title} className="w-full h-40 object-contain rounded-[20px] bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                            <Sprout size={40} className="text-emerald-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            {cropSubs.length} {cropSubs.length === 1 ? 'type' : 'types'}
                          </span>
                        </div>
                      </div>
                     <div className="p-4">
  <div className="relative flex items-center justify-center">
    <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center">
      {crop.title}
    </h3>
    <ArrowRight
      size={16}
      className="absolute right-0 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors flex-shrink-0"
    />
  </div>
</div>
                    </Link>
                  ) : (
                    <Link
                      to={authLink('/predict')}
                      className="group block h-full rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                    >
                      <div className="relative">
                        {crop.image_url ? (
                          <img src={crop.image_url} alt={crop.title} className="w-full h-40 object-contain mt-2 mb-2 rounded-[20px] bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                            <Sprout size={40} className="text-emerald-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-600 text-xs font-bold">
                            <Search size={14} /> Upload & Detect
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{crop.title}</h3>
                     
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {crops.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
              <Sprout size={40} className="text-emerald-400" />
            </div>
           
         
            <Link
              to={authLink('/predict')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-200/50 dark:shadow-none"
            >
              <Search size={16} /> Upload & Detect
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
