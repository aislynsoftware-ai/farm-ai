import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Skeleton, { DetailHeaderSkeleton, GridCardSkeleton } from '../components/common/Skeleton';
import SEO from '../components/common/SEO';

export default function AgricultureDetail() {
  const { id } = useParams();
  const [agri, setAgri] = useState(null);
  const [crops, setCrops] = useState([]);
  const [subs, setSubs] = useState([]);

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
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-14">
      <SEO title={agri?.title || 'Agriculture'} description={`Learn about ${agri?.title || 'agriculture'} on Farmlyt AI.`} url={window.location.pathname} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/services" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-700 dark:hover:bg-emerald-200 hover:text-white dark:hover:text-emerald-700 hover:border-emerald-700 dark:hover:border-emerald-200 transition-all duration-200 mb-4 shadow-sm">
          <ArrowLeft size={13} /> Back to Services
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
                  <Link
                    to={`/agriculture/${id}/crop/${crop.id}`}
                    className="group block h-full rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                  >
                    <div className="relative">
                      {crop.image_url ? (
                        <img src={crop.image_url} alt={crop.title} className="w-full h-64 object-cover bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                          <Sprout size={48} className="text-emerald-400" />
                        </div>
                      )}
                      {cropSubs.length > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            {cropSubs.length} {cropSubs.length === 1 ? 'type' : 'types'}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                        <h3 className="text-sm font-bold text-white text-center">
                          {crop.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}