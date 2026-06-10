import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, Search, Upload, AlertCircle, Loader, Bug, Droplets, AlertTriangle, ShoppingCart, Lightbulb } from 'lucide-react';
import api from '../services/api';

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
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setProfile(u);
    } catch { setProfile(null); }
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        const [subsRes, tipsRes] = await Promise.allSettled([
          api.farming.crops(),
          api.farming.tips(),
        ]);
        const subs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];
        const found = subs.find((s) => Number(s.id) === Number(id));
        setSub(found || null);
        const allTips = tipsRes.status === 'fulfilled' && Array.isArray(tipsRes.value) ? tipsRes.value : [];
        setTips(allTips.filter((t) => Number(t.crop_sub_id) === Number(id)));
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (!profile?.user_id) return <Navigate to="/login" replace />;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );

  if (!sub) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-sm text-gray-400">Sub-crop not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Link to="/services" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <ArrowLeft size={14} /> Back
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
              <img src={sub.image_url} alt={sub.title} className="w-32 h-32 rounded-xl object-cover border-2 border-white/20" />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-white/15 flex items-center justify-center">
                <Sprout size={48} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-emerald-100/70 text-xs mb-1">{sub.crop_name || ''}</p>
              <h1 className="text-2xl font-bold text-white">{sub.title}</h1>
            </div>
          </div>
        </motion.div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-5">
          <p className="text-xs font-semibold text-gray-900 dark:text-white mb-4">Upload & Detect Disease</p>

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
            disabled={predictLoading || !file}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {predictLoading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
            {predictLoading ? 'Analyzing...' : 'Detect'}
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
        </div>

        {tips.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-5">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-emerald-500" /> Farming Tips for {sub.title}
            </h3>
            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.id} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">{tip.tip_title}</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400/80">{tip.tip_description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
