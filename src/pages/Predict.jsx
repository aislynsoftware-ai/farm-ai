import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import { Upload, Leaf, Apple, Sprout, Bug, AlertCircle, Loader, Search, Menu, ChevronDown, ShoppingCart, Droplets, AlertTriangle, CheckCircle, Shield, Target, ImageIcon, FlaskConical, Sparkles, ChevronUp, ExternalLink } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';
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

export default function Predict() {
  const fileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictStartTime, setPredictStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const profile = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;

  useEffect(() => {
    async function loadCats() {
      try {
        const [agriRes, cropsRes, subsRes] = await Promise.allSettled([
          api.farming.agriTitles(),
          api.farming.allCrops(),
          api.farming.crops(),
        ]);

        const agriTitles = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
        const allCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
        const allSubs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];

        const deriveSubLabel = (seg) => {
          let s = seg;
          if (s.endsWith('s')) s = s.slice(0, -1);
          return s
            .split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        };

        const groups = {};
        agriTitles.forEach((a) => {
          groups[a.id] = { label: a.title, icon: Sprout, subs: {} };
        });

        allCrops.forEach((crop) => {
          const g = groups[crop.agri_id];
          if (!g) return;
          allSubs.filter((s) => Number(s.crop_id) === Number(crop.id)).forEach((sub) => {
            const key = sub.title.toLowerCase().trim();
            const endpoint = titleEndpoint[key];
            if (!endpoint) return;
            const seg = endpoint.split('/')[1];
            const subLabel = deriveSubLabel(seg);
            if (!g.subs[subLabel]) {
              g.subs[subLabel] = { label: subLabel, icon: Sprout, items: [] };
            }
            g.subs[subLabel].items.push({ label: sub.title, endpoint });
          });
        });

        const built = Object.values(groups).filter((g) => Object.keys(g.subs).length > 0);
        built.push(
          { label: 'Potted Plant', icon: Bug, subs: { 'Potted Plant': { label: 'Potted Plant', icon: Bug, items: [{ label: 'Potted Plant', endpoint: '/potted_plant' }] } } },
          { label: 'Plant Identification', icon: Leaf, subs: { 'Plant Identification': { label: 'Plant Identification', icon: Leaf, items: [{ label: 'Plant Identification', endpoint: '/plant_idetification' }] } } },
          { label: 'Food Identification', icon: Apple, subs: { 'Food Identification': { label: 'Food Identification', icon: Apple, items: [{ label: 'Food Identification', endpoint: '/food_identification' }] } } },
        );
        setCategories(built);
      } finally { setLoadingCats(false); }
    }
    loadCats();
  }, []);

  // URL-based auto-selection when categories load or URL changes
  const location = useLocation();
  useEffect(() => {
    if (categories.length === 0) return;
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const sub = params.get('sub');
    let found = false;

    if (sub) {
      const sl = sub.toLowerCase().trim();
      for (let ci = 0; ci < categories.length && !found; ci++) {
        const subGroups = Object.values(categories[ci].subs);
        for (let si = 0; si < subGroups.length && !found; si++) {
          for (let ii = 0; ii < subGroups[si].items.length && !found; ii++) {
            if (subGroups[si].items[ii].label.toLowerCase().trim() === sl) {
              setSelectedCat(ci); setSelectedSub(si); setSelectedItem(ii); setExpanded(ci);
              found = true;
            }
          }
        }
      }
    }
    if (!found && type) {
      const typeMap = { 'plant': 'Plant Identification', 'food': 'Food Identification' };
      const target = typeMap[type];
      if (target) {
        for (let ci = 0; ci < categories.length; ci++) {
          if (categories[ci].label === target) {
            setSelectedCat(ci); setSelectedSub(0); setSelectedItem(0); setExpanded(ci);
            break;
          }
        }
      }
    }
  }, [location, categories]);

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
  };

  const getSelectedItem = () => {
    if (selectedCat === null || selectedSub === null || selectedItem === null) return null;
    const subGroups = Object.values(categories[selectedCat]?.subs || {});
    return subGroups[selectedSub]?.items[selectedItem] || null;
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

    const userId = getUserId();
    const item = getSelectedItem();

    setLoading(true);
    setPredictStartTime(Date.now());
    setError('');
    setResult(null);
    try {
      const fd = new FormData();
      if (userId) fd.append('user_id', userId);
      fd.append('image', file);
      const endpoint = item?.endpoint || '/plant_idetification';
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

  if (loadingCats) return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <div className="flex-1 overflow-x-hidden">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 space-y-2">
              <Skeleton className="w-24 h-5 mb-3" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-3">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="icon" className="h-8 w-8" />
                    <Skeleton className="flex-1 h-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-5">
                <Skeleton className="w-48 h-4 mb-4" />
                <Skeleton variant="card" className="h-48" />
                <Skeleton className="h-12 w-full rounded-xl mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const resultLabel = result?.food_name || result?.identified_plant || result?.disease || result?.prediction || result?.prediction_result;
  const isHealthy = !result?.disease || result?.disease?.toLowerCase().includes('healthy');
  const diseaseFound = result?.disease && !result?.disease?.toLowerCase().includes('healthy');

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-emerald-950/80 backdrop-blur border-b border-emerald-100 dark:border-emerald-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Detection</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Type</h3>
              {categories.map((cat, ci) => {
                const subGroups = Object.values(cat.subs);
                return (
                <div key={ci} className="rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === ci ? null : ci)}
                    className="w-full flex items-center gap-2 p-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <cat.icon size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 flex-1">{cat.label}</span>
                    <ChevronDown size={14} className={`text-emerald-500 transition-transform duration-200 ${expanded === ci ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  {expanded === ci && (
                    <div className="px-3 pb-3 space-y-3">
                      {subGroups.map((sg, si) => (
                        <div key={si}>
                          <div className="flex items-center gap-1.5 mb-1.5 mt-1">
                            <sg.icon size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{sg.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {sg.items.map((item, ii) => (
                              <button
                                key={ii}
                                onClick={() => { setSelectedCat(ci); setSelectedSub(si); setSelectedItem(ii); setResult(null); setError(''); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                  selectedCat === ci && selectedSub === si && selectedItem === ii
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedCat !== null && selectedSub !== null && selectedItem !== null && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3">
                    Selected: {categories[selectedCat]?.label} &gt; {Object.values(categories[selectedCat]?.subs || {})[selectedSub]?.label} &gt; {getSelectedItem()?.label}
                  </p>

                  <div
                    onClick={() => fileRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-emerald-200 dark:border-emerald-700 rounded-xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors"
                  >
                    {preview ? (
                      <div className="space-y-3">
                        <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Change Image</button>
                          <span className="text-xs text-emerald-500">|</span>
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

                  <button
                    onClick={handlePredict}
                    disabled={loading || !file}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                    {loading ? 'Analyzing...' : 'Detect'}
                  </button>

                  {loading && predictStartTime && (
                    <PredictionProgress startTime={predictStartTime} />
                  )}

                  {result && (
                    <div className="mt-6 space-y-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-5 rounded-full bg-emerald-500" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis Results</h3>
                      </div>

                      {/* Section 1: Prediction Summary */}
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
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Confidence: <strong>{result.confidence}%</strong></span>
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
                                    <a href={result.original_image} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                                      <img src={result.original_image} alt="Original" className="w-full h-48 object-contain" />
                                    </a>
                                  </div>
                                )}
                                {result.predicted_image && (
                                  <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                                    <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
                                      <p className="text-[10px] font-medium text-emerald-600">Detection Output</p>
                                    </div>
                                    <a href={result.predicted_image} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                                      <img src={result.predicted_image} alt="Predicted" className="w-full h-48 object-contain" />
                                    </a>
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
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Section 4: Fertilizers */}
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
                                  <div key={fi} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
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

                      {/* Section 5: Pesticides */}
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
                                  <div key={pi} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
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

                      {/* Section 6: Care Tips */}
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
                                  <div key={ci} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                    <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">{cp}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Section 7: Products */}
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
                                    className="group block rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300"
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
                </motion.div>
              )}

              {selectedCat === null && (
                <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-8 text-center">
                  <Leaf size={40} className="text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-emerald-600">Select a detection type from the left to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
