import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, Search, Upload, ArrowRight } from 'lucide-react';
import api from '../services/api';

const titleEndpoint = {
  'tomato': '/leafs/tomato',
  'potato': '/leafs/potato',
  'brinjal': '/leafs/brinjal',
  'chilli': '/leafs/chili',
  'lady finger': '/leafs/ladyfinger',
  'brinjal veg': '/vegtables/brinjal',
  'cauliflower': '/vegtables/cauliflower',
  'cucumber': '/vegtables/cucumber',
  'ridge gourd': '/vegtables/ridge',
  'bitter gourd': '/vegtables/bitter_gourd',
  'custard apple': '/fruits/custard_apple',
  'guava': '/fruits/guava',
  'pomegranate': '/fruits/pomegranate',
  'lemon': '/fruits/lemon',
  'tomato fruit': '/fruits/tomato',
  'jasmine': '/flowers/jasmine',
  'rose': '/flowers/rose',
  'marigold': '/flowers/marigold',
  'chrysanthemum': '/flowers/chrysanthemums',
};

export default function CropDetail() {
  const { agriId, cropId } = useParams();
  const [agri, setAgri] = useState(null);
  const [crop, setCrop] = useState(null);
  const [subs, setSubs] = useState([]);

  const isLoggedIn = () => {
    try { return !!localStorage.getItem('token'); } catch { return false; }
  };

  const authLink = (path) => {
    if (!isLoggedIn()) return '/login';
    return path;
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

      setAgri(allAgri.find((a) => Number(a.id) === Number(agriId)));
      setCrop(allCrops.find((c) => Number(c.id) === Number(cropId)));
      setSubs(allSubs.filter((s) => Number(s.crop_id) === Number(cropId)));
    }
    fetch();
  }, [agriId, cropId]);

  if (!crop) return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 flex items-center justify-center">
      <p className="text-sm text-emerald-600">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to={`/agriculture/${agriId}`} className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 mb-4">
          <ArrowLeft size={14} /> Back to {agri?.title || 'Category'}
        </Link>

        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="relative flex items-center gap-5">
            {crop.image_url ? (
              <img src={crop.image_url} alt={crop.title} className="w-20 h-20 rounded-xl object-cover border-2 border-white/20" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/15 flex items-center justify-center">
                <Sprout size={36} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-emerald-100/70 text-xs mb-1">{agri?.title || 'Crop'}</p>
              <h1 className="text-2xl font-bold text-white">{crop.title}</h1>
              <p className="text-emerald-100/80 text-xs mt-1.5">
                {subs.length > 0
                  ? `Select a sub-category below to start detection`
                  : 'No sub-categories available — upload directly'}
              </p>
            </div>
          </div>
        </motion.div>

        {subs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subs.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="h-full"
              >
                <Link
                  to={authLink(`/crop/${sub.id}`)}
                  className="group block h-full rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                >
                  <div className="relative">
                    {sub.image_url ? (
                      <img src={sub.image_url} alt={sub.title} className="w-full h-36 object-contain mt-2 mb-2 rounded-[10px] bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-36 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                        <Sprout size={36} className="text-emerald-400" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur border border-emerald-200 dark:border-emerald-700">
                        {titleEndpoint[sub.title.toLowerCase().trim()] ? 'Detect' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 relative">
  <h3 className="text-sm font-bold text-center text-gray-900 dark:text-white">
    {sub.title}
  </h3>

  <ArrowRight
    size={16}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors"
  />
</div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
              <Upload size={36} className="text-emerald-400" />
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-2">No sub-categories available</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mb-6">Upload an image for direct AI-powered detection</p>
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
