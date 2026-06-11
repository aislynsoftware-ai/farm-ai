import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, ChevronRight, Search, ArrowRight, Upload, Leaf, Apple, Shield, CheckCircle, Bug, Target, AlertCircle, Loader, FlaskConical, Droplets, AlertTriangle, ShoppingCart, ExternalLink, Sparkles, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import Skeleton, { DetailHeaderSkeleton, GridCardSkeleton } from '../components/common/Skeleton';
import PredictionProgress from '../components/common/PredictionProgress';

const BASE_URL = 'https://aislynajay-product-development.hf.space';

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

export default function AgricultureDetail() {
  const { id } = useParams();
  const [agri, setAgri] = useState(null);
  const [crops, setCrops] = useState([]);
  const [subs, setSubs] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictStartTime, setPredictStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [lightboxImg, setLightboxImg] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

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

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
  };

  const handlePredict = async () => {
    if (!file) { setError('Please upload an image'); return; }
    if (!selectedCrop) { setError('Please select a crop from the dropdown'); return; }
    const cropKey = selectedCrop.toLowerCase().trim();
    const endpoint = titleEndpoint[cropKey] || '/food_identification';
    setLoading(true);
    setPredictStartTime(Date.now());
    setError('');
    setResult(null);
    try {
      const fd = new FormData();
      const userId = getUserId();
      if (userId) fd.append('user_id', userId);
      fd.append('image', file);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.detail || data.error || 'Request failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resultLabel = result?.food_name || result?.identified_plant || result?.disease || result?.prediction || result?.prediction_result;
  const isHealthy = !result?.disease || result?.disease?.toLowerCase().includes('healthy');
  const diseaseFound = result?.disease && !result?.disease?.toLowerCase().includes('healthy');

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
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
              <Sprout size={40} className="text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">No crops listed. Use the detection panel below.</p>
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5">
          <p className="text-xs font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Upload size={14} className="text-emerald-500" /> Quick Detection
          </p>

          {crops.length > 0 && (
            <div className="mb-4">
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Select Crop</label>
              <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs text-gray-900 dark:text-white">
                <option value="">-- Select a crop --</option>
                {crops.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
            </div>
          )}

          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-emerald-200 dark:border-emerald-700 rounded-xl p-6 text-center hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors"
          >
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                <div className="flex items-center justify-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Change Image</button>
                  <span className="text-xs text-emerald-500">|</span>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }} className="text-xs text-red-500 hover:underline cursor-pointer">Remove</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
                  <Upload size={22} className="text-emerald-500" />
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-emerald-500">JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {error && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button onClick={handlePredict} disabled={loading || !file || !selectedCrop} className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed">
            {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? 'Analyzing...' : 'Detect'}
          </button>

          {loading && predictStartTime && <PredictionProgress startTime={predictStartTime} />}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis Results</h3>
              </div>

              <motion.div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Prediction Summary</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${diseaseFound ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'}`}>
                    {diseaseFound ? 'Disease Detected' : isHealthy ? 'Healthy' : 'Identified'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${diseaseFound ? 'bg-red-100 dark:bg-red-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40'}`}>
                      {diseaseFound ? <Bug size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-emerald-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900 dark:text-white">{resultLabel || 'Analysis Complete'}</p>
                      {result.confidence && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Target size={11} className="text-emerald-500" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">Confidence: <strong>{result.confidence ? (result.confidence < 1 ? (result.confidence * 100).toFixed(1) : Number(result.confidence).toFixed(1)) : ''}%</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {(result.original_image || result.predicted_image) && (
                <motion.div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <button onClick={() => toggleSection('images')} className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Image Comparison</span>
                    </div>
                    {expandedSections.images ? <ChevronUp size={13} className="text-emerald-500" /> : <ChevronDown size={13} className="text-emerald-500" />}
                  </button>
                  {expandedSections.images !== false && (
                    <div className="px-3 pb-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.original_image && (
                          <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                            <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700"><p className="text-[10px] font-medium text-emerald-600">Original Image</p></div>
                            <img src={result.original_image} alt="Original" onClick={() => setLightboxImg(result.original_image)} className="w-full h-40 object-contain cursor-zoom-in" />
                          </div>
                        )}
                        {result.predicted_image && (
                          <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                            <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700"><p className="text-[10px] font-medium text-emerald-600">Detection Output</p></div>
                            <img src={result.predicted_image} alt="Predicted" onClick={() => setLightboxImg(result.predicted_image)} className="w-full h-40 object-contain cursor-zoom-in" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center cursor-pointer">
          <img src={lightboxImg} alt="Full view" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" />
        </div>
      )}
    </div>
  );
}
