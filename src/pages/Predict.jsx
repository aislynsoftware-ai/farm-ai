import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Upload, Leaf, Apple, Sprout, Flower2, Bug, AlertCircle, Loader, Search, Menu, ChevronDown, ChevronRight, ShoppingCart, Droplets, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';

const BASE_URL = 'https://aislynajay-product-development.hf.space';

const catIcons = {
  'Leaf Detection': Leaf,
  'Fruit Detection': Apple,
  'Vegetable Detection': Sprout,
  'Flower Detection': Flower2,
};

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
  const [searchParams] = useSearchParams();
  const fileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

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

        const groups = {};
        agriTitles.forEach((a) => {
          groups[a.id] = { label: a.title, icon: catIcons[a.title] || Sprout, items: [] };
        });

        allCrops.forEach((crop) => {
          const g = groups[crop.agri_id];
          if (!g) return;
          allSubs.filter((s) => Number(s.crop_id) === Number(crop.id)).forEach((sub) => {
            const key = sub.title.toLowerCase().trim();
            const endpoint = titleEndpoint[key];
            if (endpoint) g.items.push({ label: sub.title, endpoint });
          });
        });

        const built = Object.values(groups).filter((g) => g.items.length > 0);
        built.push(
          { label: 'Potted Plant', icon: Bug, items: [{ label: 'Potted Plant', endpoint: '/potted_plant' }] },
          { label: 'Plant Identification', icon: Leaf, items: [{ label: 'Plant Identification', endpoint: '/plant_idetification' }] },
          { label: 'Food Identification', icon: Apple, items: [{ label: 'Food Identification', endpoint: '/food_identification' }] },
        );
        setCategories(built);

        const type = searchParams.get('type');
        const sub = searchParams.get('sub');
        let found = false;

        if (sub) {
          const sl = sub.toLowerCase().trim();
          for (let ci = 0; ci < built.length && !found; ci++) {
            for (let ii = 0; ii < built[ci].items.length; ii++) {
              if (built[ci].items[ii].label.toLowerCase().trim() === sl) {
                setSelectedCat(ci); setSelectedItem(ii); setExpanded(ci);
                found = true; break;
              }
            }
          }
        }
        if (!found && type) {
          const typeMap = { 'plant': 'Plant Identification', 'food': 'Food Identification' };
          const target = typeMap[type];
          if (target) {
            for (let ci = 0; ci < built.length; ci++) {
              if (built[ci].label === target) {
                setSelectedCat(ci); setSelectedItem(0); setExpanded(ci);
                break;
              }
            }
          }
        }
      } finally { setLoadingCats(false); }
    }
    loadCats();
  }, []);

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
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
    const item = selectedCat !== null && selectedItem !== null ? categories[selectedCat]?.items[selectedItem] : null;

    setLoading(true);
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Detection</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Type</h3>
              {categories.map((cat, ci) => (
                <div key={ci} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === ci ? null : ci)}
                    className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <cat.icon size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1">{cat.label}</span>
                    {expanded === ci ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                  </button>
                  {expanded === ci && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                      {cat.items.map((item, ii) => (
                        <button
                          key={ii}
                          onClick={() => { setSelectedCat(ci); setSelectedItem(ii); setResult(null); setError(''); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            selectedCat === ci && selectedItem === ii
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedCat !== null && selectedItem !== null && (
                <motion.div
                  className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Selected: {categories[selectedCat]?.label} &gt; {categories[selectedCat]?.items[selectedItem]?.label}
                  </p>

                  <div
                    onClick={() => fileRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                  >
                    {preview ? (
                      <div className="space-y-3">
                        <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Change Image</button>
                          <span className="text-xs text-gray-400">|</span>
                          <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }} className="text-xs text-red-500 hover:underline cursor-pointer">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
                          <Upload size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                    {loading ? 'Analyzing...' : 'Detect'}
                  </button>

                  {result && (
                    <motion.div
                      className="mt-4 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Results</h3>

                      {result.original_image && (
                        <img src={result.original_image} alt="Original" className="w-full max-h-48 rounded-xl object-contain bg-gray-50 dark:bg-gray-900" />
                      )}
                      {result.predicted_image && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Detection Output</p>
                          <img src={result.predicted_image} alt="Predicted" className="w-full max-h-64 rounded-xl object-contain bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
                        </div>
                      )}

                      {(result.prediction || result.prediction_result || result.identified_plant || result.food_name || result.disease) && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-1.5">Prediction</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {result.food_name || result.identified_plant || result.disease || result.prediction || result.prediction_result}
                          </p>
                          {result.confidence && (
                            <p className="text-xs text-gray-500 mt-1">Confidence: {result.confidence}%</p>
                          )}
                        </div>
                      )}

                      {result.disease && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                          <p className="text-[10px] font-medium text-red-600 dark:text-red-400 mb-1"><Bug size={12} className="inline mr-1" />Disease</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{result.disease}</p>
                        </div>
                      )}

                      {result.fertilizers?.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1"><Droplets size={12} /> Fertilizers</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.fertilizers.map((f, fi) => (
                              <span key={fi} className="px-2.5 py-1 text-[10px] rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-emerald-200 dark:border-emerald-800">{f}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.pesticides?.length > 0 && (
                        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                          <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400 mb-1.5 flex items-center gap-1"><AlertTriangle size={12} /> Pesticides</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.pesticides.map((p, pi) => (
                              <span key={pi} className="px-2.5 py-1 text-[10px] rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-200 dark:border-orange-800">{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.care_points?.length > 0 && (
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                          <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1"><Sprout size={12} /> Care Points</p>
                          <ul className="space-y-1">
                            {result.care_points.map((cp, ci) => (
                              <li key={ci} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                {cp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.products?.length > 0 && (
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1"><ShoppingCart size={12} /> Recommended Products</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {result.products.filter((pr) => pr.product_name).map((pr, pi) => (
                              <a key={pi} href={pr.product_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 transition-colors">
                                {pr.product_image ? (
                                  <img src={pr.product_image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart size={14} className="text-emerald-500" />
                                  </div>
                                )}
                                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{pr.product_name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {selectedCat === null && (
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-8 text-center">
                  <Leaf size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Select a detection type from the left to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
