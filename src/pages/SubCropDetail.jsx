import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, Search, Upload, AlertCircle, Loader, Bug, Droplets, AlertTriangle, ShoppingCart, Lightbulb, CheckCircle, X, Shield, Zap, ImageIcon, Target, FlaskConical, Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';
import PredictionProgress from '../components/common/PredictionProgress';

function SubCropTipCard({ tip }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
      >
        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{tip.tip_title || tip.title}</p>
        {open ? <ChevronUp size={14} className="text-amber-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-amber-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3">
          <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">{tip.tip_description || tip.description}</p>
        </div>
      )}
    </div>
  );
}

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

export default function SubCropDetail() {
  const { id } = useParams();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictStartTime, setPredictStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [tips, setTips] = useState([]);
  const [agriTitle, setAgriTitle] = useState('');
  const [agriLinkId, setAgriLinkId] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [lightbox, setLightbox] = useState(null);

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setProfile(u);
    } catch { setProfile(null); }
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        const [subsRes, tipsRes, cropsRes] = await Promise.allSettled([
          api.farming.crops(),
          api.farming.tips(),
          api.farming.allCrops(),
        ]);
        const subs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];
        const found = subs.find((s) => Number(s.id) === Number(id));
        setSub(found || null);
        const allTips = tipsRes.status === 'fulfilled' && Array.isArray(tipsRes.value) ? tipsRes.value : [];
        setTips(allTips.filter((t) => Number(t.crop_sub_id) === Number(id)));
        const allCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
        if (found) {
          const parent = allCrops.find((c) => Number(c.id) === Number(found.crop_id));
          setAgriTitle(parent?.agri_title || '');
          setAgriLinkId(parent?.agri_id || '');
        }
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;

  const getEndpoint = () => {
    if (!sub) return null;
    const key = sub.title.toLowerCase().trim();
    return titleEndpoint[key] || null;
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  const handlePredict = async () => {
    if (!file) { setError('Please upload an image'); return; }
    const endpoint = getEndpoint();
    if (!endpoint) { setError('No prediction endpoint for this crop'); return; }
    if (!profile?.user_id) { setError('Please log in to use detection'); return; }

    setPredictLoading(true);
    setPredictStartTime(Date.now());
    setError('');
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('user_id', profile.user_id);
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
      setPredictLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="w-20 h-4" />
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-green-700/20 to-blue-800/20 p-6 lg:p-8">
          <div className="flex items-center gap-5">
            <Skeleton variant="icon" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-16 h-3" />
              <Skeleton variant="title" className="w-1/2" />
              <Skeleton className="w-2/3" />
            </div>
          </div>
        </div>
        <Skeleton variant="card" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );

  if (!sub) return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 flex items-center justify-center">
      <p className="text-sm text-emerald-600">Sub-crop not found</p>
    </div>
  );

  const resultLabel = result?.food_name || result?.identified_plant || result?.disease || result?.prediction || result?.prediction_result;
  const isHealthy = !result?.disease || result?.disease?.toLowerCase().includes('healthy');
  const diseaseFound = result?.disease && !result?.disease?.toLowerCase().includes('healthy');
  const parseConfidence = (str) => {
    if (!str) return null;
    const m = str.match(/\((\d+\.\d+)\)/);
    if (m) return Math.round(parseFloat(m[1]) * 100);
    return result?.confidence ? Math.round(result.confidence) : null;
  };
  const yoloConf = parseConfidence(result?.prediction || result?.prediction_result);

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-14">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Link to={sub?.crop_id && agriLinkId ? `/agriculture/${agriLinkId}/crop/${sub.crop_id}` : '/services'} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-700 dark:hover:bg-emerald-200 hover:text-white dark:hover:text-emerald-700 hover:border-emerald-700 dark:hover:border-emerald-200 transition-all duration-200 mb-4 shadow-sm">
          <ArrowLeft size={13} /> Back{agriTitle ? ` to ${agriTitle}` : ''}
        </Link>

        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="relative flex items-center gap-5">
            {sub.image_url ? (
              <img src={sub.image_url} alt={sub.title} className="w-20 h-20 rounded-xl object-cover border-2 border-white/20" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/15 flex items-center justify-center">
                <Sprout size={36} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-emerald-100/70 text-xs mb-1">{sub.crop_name || ''}</p>
              <h1 className="text-2xl font-bold text-white">{sub.title}</h1>
              <p className="text-emerald-100/80 text-xs mt-1.5">Upload an image to detect diseases and get recommendations</p>
            </div>
          </div>
        </motion.div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
          >
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                <div className="flex items-center justify-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Change Image</button>
                  <span className="text-xs text-emerald-400">|</span>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }} className="text-xs text-red-500 hover:underline cursor-pointer">Remove</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
                  <Upload size={24} className="text-emerald-500" />
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-emerald-600">JPG, PNG up to 10MB</p>
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

          <button
            onClick={handlePredict}
          disabled={predictLoading || !file}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {predictLoading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
            {predictLoading ? 'Analyzing...' : 'Detect Disease'}
          </button>

          {predictLoading && predictStartTime && (
            <PredictionProgress startTime={predictStartTime} />
          )}

          {result && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis Results</h3>

              </div>

              {/* Section 1: Prediction Summary Card */}
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-emerald-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Prediction Summary</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${diseaseFound ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'}`}>
                    {diseaseFound ? 'Disease Detected' : isHealthy ? 'Healthy' : 'Identified'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${diseaseFound ? 'bg-red-100 dark:bg-red-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40'}`}>
                      {diseaseFound ? <Bug size={24} className="text-red-500" /> : <CheckCircle size={24} className="text-emerald-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{resultLabel || 'Analysis Complete'}</p>
                      {result.confidence && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Target size={12} className="text-emerald-500" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">AI Accuracy: <strong>{Math.round(Number(result.confidence))}%</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  {result.prediction_result && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">{result.prediction_result}</p>
                  )}
                </div>
              </motion.div>

              {/* Section 2: Image Comparison */}
              {(result.original_image || result.predicted_image) && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('images')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Image Comparison</span>
                    </div>
                    {expandedSections.images ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.images !== false && (
                    <div className="px-4 pb-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.original_image && (
                          <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                            <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
                              <p className="text-[10px] font-medium text-emerald-600">Original Image</p>
                            </div>
                            <img src={result.original_image} alt="Original" className="w-full h-48 object-contain cursor-zoom-in" onClick={() => setLightbox(result.original_image)} />
                          </div>
                        )}
                        {result.predicted_image && (
                          <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                            <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
                              <p className="text-[10px] font-medium text-emerald-600">Detection Output</p>
                            </div>
                            <img src={result.predicted_image} alt="Predicted" className="w-full h-48 object-contain cursor-zoom-in" onClick={() => setLightbox(result.predicted_image)} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 3: Disease Information */}
              {result.disease && !isHealthy && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('disease')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Bug size={16} className="text-red-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Disease Information</span>
                    </div>
                    {expandedSections.disease ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.disease !== false && (
                    <div className="px-4 pb-4">
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-red-800 dark:text-red-300">Detected Disease</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${diseaseFound ? 'bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300' : 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'}`}>
                            {diseaseFound ? 'Diseased' : 'Healthy'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{result.disease}</p>
                      </div>
                      {yoloConf !== null && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                          <Target size={12} />
                          YOLO Confidence: <strong>{yoloConf}%</strong>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 4: Recommended Fertilizers */}
              {result.fertilizers?.length > 0 && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('fertilizers')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Recommended Fertilizers</span>
                    </div>
                    {expandedSections.fertilizers ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.fertilizers !== false && (
                    <div className="px-4 pb-4">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {result.fertilizers.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                              <FlaskConical size={14} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{f}</p>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Recommended</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 5: Recommended Pesticides */}
              {result.pesticides?.length > 0 && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('pesticides')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-orange-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Recommended Pesticides</span>
                    </div>
                    {expandedSections.pesticides ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.pesticides !== false && (
                    <div className="px-4 pb-4">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {result.pesticides.map((p, pi) => (
                          <div key={pi} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-200 dark:border-orange-800">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
                              <AlertTriangle size={14} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{p}</p>
                              <span className="text-[10px] text-orange-600 dark:text-orange-400">Recommended</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 6: Crop Care Tips */}
              {result.care_points?.length > 0 && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('care')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sprout size={16} className="text-blue-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Crop Care Tips</span>
                    </div>
                    {expandedSections.care ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.care !== false && (
                    <div className="px-4 pb-4">
                      <div className="space-y-2">
                        {result.care_points.map((cp, ci) => (
                          <div key={ci} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                            <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">{cp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 7: Recommended Products */}
              {result.products?.length > 0 && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => toggleSection('products')}
                    className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-purple-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Recommended Products</span>
                    </div>
                    {expandedSections.products ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {expandedSections.products !== false && (
                    <div className="px-4 pb-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {result.products.filter((pr) => pr.product_name).map((pr, pi) => (
                          <a
                            key={pi}
                            href={pr.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                          >
                            {pr.product_image ? (
                              <img src={pr.product_image} alt={pr.product_name} className="w-full h-28 object-contain bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-28 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-purple-50 dark:from-emerald-950/30 dark:to-purple-950/30">
                                <ShoppingCart size={28} className="text-emerald-400" />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200 line-clamp-2 mb-2">{pr.product_name}</p>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-medium group-hover:bg-emerald-700 transition-colors">
                                Buy Now <ExternalLink size={10} />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section 8: AI Recommendations */}
              {!isHealthy && (
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-5 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-yellow-300" />
                    <span className="text-xs font-bold text-white">AI Recommendations</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                    <p className="text-sm font-bold text-white mb-2">
                      {diseaseFound ? `Disease Detected: ${result.disease}` : resultLabel ? `Identified: ${resultLabel}` : 'Analysis Complete'}
                    </p>
                    <ul className="space-y-1.5">
                      {result.fertilizers?.length > 0 && (
                        <li className="flex items-start gap-2 text-xs text-emerald-100">
                          <CheckCircle size={12} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                          Apply suggested fertilizers: {result.fertilizers.join(', ')}
                        </li>
                      )}
                      {result.pesticides?.length > 0 && (
                        <li className="flex items-start gap-2 text-xs text-emerald-100">
                          <CheckCircle size={12} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                          Use recommended pesticides: {result.pesticides.join(', ')}
                        </li>
                      )}
                      {result.care_points?.length > 0 && (
                        <li className="flex items-start gap-2 text-xs text-emerald-100">
                          <CheckCircle size={12} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                          Follow {result.care_points.length} crop care tips for better yield
                        </li>
                      )}
                      {result.products?.length > 0 && (
                        <li className="flex items-start gap-2 text-xs text-emerald-100">
                          <CheckCircle size={12} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                          {result.products.filter((p) => p.product_name).length} recommended products available for purchase
                        </li>
                      )}
                      {!result.fertilizers?.length && !result.pesticides?.length && !result.care_points?.length && (
                        <li className="flex items-start gap-2 text-xs text-emerald-100">
                          <CheckCircle size={12} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                          No specific recommendations available for this detection
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
              )}
            </div>
          )}
        </div>

        {tips.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-emerald-500" /> Farming Tips for {sub.title}
            </h3>
            <div className="space-y-2">
              {tips.map((tip) => (
                <SubCropTipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10">
            <X size={20} />
          </button>
          <img src={lightbox} alt="Full size" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      </div>
    </div>
  );
}
