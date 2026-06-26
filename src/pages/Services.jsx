import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Upload, Leaf, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';
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
  'potted plant': '/potted_plant',
  'plant identification': '/plant_idetification',
  'food identification': '/food_identification',
};

export default function Services() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agriTitles, setAgriTitles] = useState([]);
  const [crops, setCrops] = useState([]);
  const [subCrops, setSubCrops] = useState([]);
  const [selectedAgri, setSelectedAgri] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [predError, setPredError] = useState('');

  useEffect(() => {
    Promise.all([
      api.farming.agriTitles().then(setAgriTitles).catch(() => {}),
      api.farming.allCrops().then(setCrops).catch(() => {}),
      api.farming.crops().then(setSubCrops).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredCrops = selectedAgri ? crops.filter((c) => c.agri_id === selectedAgri.id) : [];
  const filteredSubs = selectedCrop ? subCrops.filter((s) => s.crop_id === selectedCrop.id) : [];

  const getEndpoint = (name) => {
    const key = Object.keys(titleEndpoint).find((k) => name?.toLowerCase().includes(k));
    return key ? titleEndpoint[key] : null;
  };

  const handlePredict = async () => {
    if (!file) { setPredError('Please select an image'); return; }
    setPredicting(true); setPredError(''); setResult(null);
    const userId = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}').user_id; } catch { return ''; } })();
    if (!userId) { setPredError('Please login first'); setPredicting(false); return; }
    const name = selectedSub?.title || selectedCrop?.title || '';
    const ep = getEndpoint(name);
    if (!ep) { setPredError(`No prediction model for "${name}"`); setPredicting(false); return; }
    try {
      const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file);
      const res = await fetch(ep, { method: 'POST', body: fd });
      const data = await res.json();
      setResult(data);
    } catch (err) { setPredError(err.message); }
    setPredicting(false);
  };

  const resetSelection = () => { setSelectedCrop(null); setSelectedSub(null); setFile(null); setPreview(null); setResult(null); setPredError(''); };

  const tagClass = (active) => `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border ${active ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`;

  return (
    <main>
      <SEO title="Services" description="Explore Farmlyt AI services including crop disease detection, plant identification, food analysis, and smart agriculture solutions." url="/services" />
      <PageHeader title="Our Services" description="Comprehensive AI-powered solutions designed to address every aspect of modern agriculture and farming." />

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-wrap gap-3">{[1,2,3,4,5,6].map(i => <div key={i} className="w-28 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />)}</div>
          ) : (
            <>
              {/* Agri Title Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {agriTitles.map((a) => (
                  <button key={a.id} onClick={() => { setSelectedAgri(selectedAgri?.id === a.id ? null : a); resetSelection(); }} className={tagClass(selectedAgri?.id === a.id)}>
                    {a.title} {selectedAgri?.id === a.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ))}
              </div>

              {/* Crops */}
              {selectedAgri && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Crops in {selectedAgri.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredCrops.length === 0 && <p className="text-xs text-gray-400">No crops found</p>}
                    {filteredCrops.map((c) => (
                      <button key={c.id} onClick={() => { setSelectedCrop(selectedCrop?.id === c.id ? null : c); setSelectedSub(null); setFile(null); setPreview(null); setResult(null); setPredError(''); }} className={tagClass(selectedCrop?.id === c.id)}>
                        {c.title} {selectedCrop?.id === c.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub Crops */}
              {selectedCrop && filteredSubs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Sub Types in {selectedCrop.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredSubs.map((s) => (
                      <button key={s.id} onClick={() => { setSelectedSub(selectedSub?.id === s.id ? null : s); setFile(null); setPreview(null); setResult(null); setPredError(''); }} className={tagClass(selectedSub?.id === s.id)}>
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Predict Section - shown when leaf reached */}
              {((selectedSub) || (selectedCrop && filteredSubs.length === 0)) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 p-6 max-w-xl">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    Predict: {selectedSub?.title || selectedCrop?.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Upload an image to get AI-powered prediction</p>

                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => document.getElementById('svc-file-input')?.click()} className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800 cursor-pointer flex items-center gap-1.5">
                      <Upload size={14} /> {file ? file.name : 'Choose Image'}
                    </button>
                    <input id="svc-file-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); const r = new FileReader(); r.onload = (ev) => setPreview(ev.target.result); r.readAsDataURL(f); setPredError(''); } }} />
                    {preview && <img src={preview} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                  </div>

                  {file && (
                    <button onClick={handlePredict} disabled={predicting} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer flex items-center gap-1.5">
                      {predicting ? <Loader size={14} className="animate-spin" /> : null}
                      {predicting ? 'Predicting...' : 'Predict'}
                    </button>
                  )}

                  {predError && <div className="flex items-center gap-2 p-3 mt-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600 dark:text-red-400">{predError}</p></div>}

                  {result && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-emerald-600" /><p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Prediction Result</p></div>
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
