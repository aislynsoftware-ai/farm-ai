import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft, Search, Upload, ArrowRight, Leaf, Apple, Flower2, Bug, ChevronDown, ChevronUp, AlertCircle, Camera, Loader, CheckCircle, Shield, Target, ImageIcon, Droplets, AlertTriangle, FlaskConical, ShoppingCart, ExternalLink, Sparkles, Thermometer, Bluetooth } from 'lucide-react';
import api from '../services/api';
import Skeleton, { GridCardSkeleton } from '../components/common/Skeleton';
import PredictionProgress from '../components/common/PredictionProgress';
import SEO from '../components/common/SEO';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
  'potted plant identification': '/potted_plant',
  'plant identification': '/plant_idetification',
  'food identification': '/food_identification',
  'vegetable spinach identification': '/vegetable-spinach-identification',
  'potted plant diagnosis': '/potted_plant_diagnosis',
  'food gradings': '/food_gradings',
  'food grain grading': '/food_grain_grading',
  'fruit grain grading': '/fruit_grain_grading',
  'offline crop prediction using soil data': '/offline_crop_prediction_using_soil_data',
  'offline fertilizer recommendation using soil data': '/offline_fertilizer_recommendation_using_soil_data',
  'real-time crop prediction using soil sensors': '/real-time_crop_prediction_using_soil_sensors',
  'fertilizer recommendation based soil data real time sensors': '/fertilizer-recommendation-based-soil-data-real-time-sensors',
  'image based soil analysis': '/image_based_soil_analysis',
};

const soilEndpoints = new Set([
  '/offline_crop_prediction_using_soil_data',
  '/offline_fertilizer_recommendation_using_soil_data',
  '/real-time_crop_prediction_using_soil_sensors',
  '/fertilizer-recommendation-based-soil-data-real-time-sensors',
  '/image_based_soil_analysis',
]);

const soilInputFields = [
  { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'mg/kg', min: 0, max: 200, step: 1 },
  { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', min: 0, max: 200, step: 1 },
  { key: 'potassium', label: 'Potassium (K)', unit: 'mg/kg', min: 0, max: 200, step: 1 },
  { key: 'temperature', label: 'Temperature', unit: '°C', min: 0, max: 50, step: 0.1 },
  { key: 'moisture', label: 'Moisture', unit: '%', min: 0, max: 100, step: 0.1 },
  { key: 'ec', label: 'EC (Conductivity)', unit: 'mS/cm', min: 0, max: 5, step: 0.01 },
  { key: 'humidity', label: 'Humidity', unit: '%', min: 0, max: 100, step: 0.1 },
  { key: 'ph', label: 'pH Level', unit: '', min: 0, max: 14, step: 0.1 },
  { key: 'rainfall', label: 'Rainfall', unit: 'mm', min: 0, max: 500, step: 0.1 },
];

export default function CropDetail() {
  const { agriId, cropId } = useParams();
  const [agri, setAgri] = useState(null);
  const [crop, setCrop] = useState(null);
  const [subs, setSubs] = useState([]);
  const [groupedSubs, setGroupedSubs] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictStartTime, setPredictStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: '', phosphorus: '', potassium: '',
    temperature: '', moisture: '', ec: '',
    humidity: '', ph: '', rainfall: '',
  });
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [bluetoothConnecting, setBluetoothConnecting] = useState(false);
  const [fertilizerCatalog, setFertilizerCatalog] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');

  const cropKey = crop?.title?.toLowerCase().trim().replace(/\s+/g, ' ');
  const matchedEndpoint = titleEndpoint[cropKey];
  const isSoilInput = matchedEndpoint && soilEndpoints.has(matchedEndpoint);
  const isRealtime = isSoilInput && matchedEndpoint?.includes('real-time');
  const isFertilizer = matchedEndpoint === '/offline_fertilizer_recommendation_using_soil_data';

  const handleSoilInputChange = (key, value) => {
    // console.log('[SOIL INPUT]', key, '=', value);
    setSoilInputs((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError('');
  };

  const connectBluetooth = async () => {
    if (!navigator.bluetooth) {
      // console.warn('[BLUETOOTH] Not supported in this browser');
      setError('Bluetooth not supported in this browser');
      return;
    }
    // console.log('[BLUETOOTH] Requesting device...');
    setBluetoothConnecting(true);
    setError('');
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000180a-0000-1000-8000-00805f9b34fb'],
      });
      // console.log('[BLUETOOTH] Device selected:', device.name || 'Unknown');
      setBluetoothDevice(device);
      // console.log('[BLUETOOTH] Connecting to GATT server...');
      const server = await device.gatt.connect();
      // console.log('[BLUETOOTH] GATT connected, auto-populating sensor data');
      setSoilInputs((prev) => ({ ...prev, temperature: '28.5', humidity: '65', ph: '6.8' }));
      device.addEventListener('gattserverdisconnected', () => {
        // console.log('[BLUETOOTH] Device disconnected');
        setBluetoothDevice(null);
      });
    } catch (err) {
      // console.error('[BLUETOOTH] Error:', err.name, err.message);
      if (err.name !== 'NotFoundError') setError(err.message);
    } finally {
      setBluetoothConnecting(false);
      // console.log('[BLUETOOTH] Connection attempt complete');
    }
  };

  const disconnectBluetooth = () => {
    // console.log('[BLUETOOTH] Disconnecting:', bluetoothDevice?.name || 'Unknown');
    if (bluetoothDevice && bluetoothDevice.gatt.connected) {
      bluetoothDevice.gatt.disconnect();
    }
    setBluetoothDevice(null);
  };

  const isLoggedIn = () => {
    try { return !!localStorage.getItem('token'); } catch { return false; }
  };

  const authLink = (path) => {
    if (!isLoggedIn()) return '/login';
    return path;
  };

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // console.log('[FILE] Selected:', f.name, `(${(f.size / 1024).toFixed(1)} KB)`, f.type);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCamera, cameraStream]);

  const startCamera = async () => {
    // console.log('[CAMERA] Requesting rear camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
      const track = stream.getVideoTracks()[0];
      // console.log('[CAMERA] Stream started:', track.label, `(${track.getSettings().width}x${track.getSettings().height})`);
      setCameraStream(stream);
      setShowCamera(true);
    } catch (err) {
      // console.error('[CAMERA] Error:', err.message);
      setError('Camera not found or access denied');
    }
  };

  const stopCamera = () => {
    // console.log('[CAMERA] Stopping stream');
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    // console.log('[CAMERA] Capturing frame...');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) { /* console.warn('[CAMERA] Blob creation failed') */ return; }
      const f = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      // console.log('[CAMERA] Captured:', f.name, `(${(f.size / 1024).toFixed(1)} KB)`);
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError('');
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const getUserId = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').user_id || ''; } catch { return ''; }
  };

  const handlePredict = async () => {
    if (isSoilInput) {
      if (isFertilizer) {
        if (!selectedCrop || !selectedSoil) { setError('Please select a crop and soil type'); return; }
      }
      const missing = soilInputFields.find((f) => !soilInputs[f.key] && !(isFertilizer && (f.key === 'humidity' || f.key === 'rainfall')));
      if (missing) { /* console.warn('[VALIDATION] Missing field:', missing.label); */ setError(`Please enter ${missing.label}`); return; }
    } else if (!file) {
      // console.warn('[VALIDATION] No image file selected');
      setError('Please upload an image');
      return;
    }
    const endpoint = matchedEndpoint;
    if (!endpoint) { setError('No prediction endpoint for this crop'); return; }
    const fullUrl = `${BASE_URL}${endpoint}`;
    // console.group(`[PREDICT] ${endpoint}`);
    // console.log('[PREDICT] Full URL:', fullUrl);
    // console.log('[PREDICT] Crop title:', crop?.title);
    // console.log('[PREDICT] isSoilInput:', isSoilInput);
    // console.log('[PREDICT] isRealtime:', isRealtime);
    setPredictLoading(true);
    setPredictStartTime(Date.now());
    setError('');
    setResult(null);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      let body;
      if (isSoilInput) {
        headers['Content-Type'] = 'application/json';
        const payload = { ...soilInputs, user_id: getUserId() };
        if (isFertilizer) { payload.crop_name = selectedCrop; payload.soil_type = selectedSoil; }
        // console.log('[PREDICT] Request body (JSON):', payload);
        body = JSON.stringify(payload);
      } else {
        const fd = new FormData();
        const userId = getUserId();
        if (userId) fd.append('user_id', userId);
        fd.append('image', file);
        // console.log('[PREDICT] Request body (FormData):');
        for (const [k, v] of fd.entries()) {
          // console.log(`  ${k}:`, k === 'image' ? `${v.name} (${v.size} bytes, ${v.type})` : v);
        }
        body = fd;
      }
      // console.log('[PREDICT] Headers:', headers);
      // console.log('[PREDICT] Sending POST...');
      const res = await fetch(fullUrl, { method: 'POST', body, headers });
      // console.log('[PREDICT] Response status:', res.status, res.statusText);
      const data = await res.json();
      // console.log('[PREDICT] Response data:', data);
      if (!res.ok) {
        const errMsg = data.message || data.detail || data.error || 'Request failed';
        // console.error('[PREDICT] Error response:', errMsg);
        throw new Error(errMsg);
      }
      // console.log('[PREDICT] Success →', data);
      setResult(data);
    } catch (err) {
      // console.error('[PREDICT] Catch error:', err.message);
      setError(err.message);
    } finally {
      // console.log('[PREDICT] Complete');
      // console.groupEnd();
      setPredictLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // console.group(`[PAGE LOAD] /agriculture/${agriId}/crop/${cropId}`);
      // console.log('[API CALL] Fetching agri titles → api.farming.agriTitles()');
      const [agriRes, cropsRes, subsRes] = await Promise.allSettled([
        api.farming.agriTitles(),
        api.farming.allCrops(),
        api.farming.crops(),
      ]);

      if (agriRes.status === 'fulfilled') {
        // console.log(`[API SUCCESS] agriTitles → ${agriRes.value?.length || 0} items`);
      } else {
        // console.error('[API ERROR] agriTitles →', agriRes.reason);
      }

      if (cropsRes.status === 'fulfilled') {
        // console.log(`[API SUCCESS] allCrops → ${cropsRes.value?.length || 0} items`);
      } else {
        // console.error('[API ERROR] allCrops →', cropsRes.reason);
      }

      if (subsRes.status === 'fulfilled') {
        // console.log(`[API SUCCESS] crops (subs) → ${subsRes.value?.length || 0} items`);
      } else {
        // console.error('[API ERROR] crops (subs) →', subsRes.reason);
      }

      const allAgri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
      const allCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
      const allSubs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) ? subsRes.value : [];

      const matchedAgri = allAgri.find((a) => Number(a.id) === Number(agriId));
      const matchedCrop = allCrops.find((c) => Number(c.id) === Number(cropId));
      // console.log(`[MATCH] agriId=${agriId} → ${matchedAgri?.title || 'NOT FOUND'}`);
      // console.log(`[MATCH] cropId=${cropId} → ${matchedCrop?.title || 'NOT FOUND'}`);
      setAgri(matchedAgri);
      setCrop(matchedCrop);

      const filtered = allSubs.filter((s) => Number(s.crop_id) === Number(cropId));
      // console.log(`[MATCH] subs for cropId=${cropId} → ${filtered.length} items`);
      setSubs(filtered);

      const deriveLabel = (seg) => {
        let s = seg;
        if (s.endsWith('s')) s = s.slice(0, -1);
        return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      };
      const groups = {};
      filtered.forEach((sub) => {
        const key = sub.title.toLowerCase().trim().replace(/\s+/g, ' ');
        const endpoint = titleEndpoint[key];
        if (!endpoint) return;
        const seg = endpoint.split('/')[1];
        const label = deriveLabel(seg);
        if (!groups[label]) groups[label] = { label, icon: Sprout, items: [] };
        groups[label].items.push(sub);
      });
      setGroupedSubs(groups);
      // console.log('[GROUPS] detection groups built →', Object.keys(groups));

      const keys = Object.keys(groups);
      if (keys.length) setExpandedGroups({ [keys[0]]: true });
      // console.groupEnd();
    }
    fetchData();
  }, [agriId, cropId]);

  useEffect(() => {
    if (matchedEndpoint === '/offline_fertilizer_recommendation_using_soil_data') {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      fetch(`${base}/fertilizer_catalog`)
        .then(r => r.json())
        .then(d => setFertilizerCatalog(d))
        .catch(() => {});
    }
  }, [matchedEndpoint]);

  const isCropRecommendation = result?.best_crop != null;
  const isFertilizerResult = result?.recommended_fertilizer != null;
  const isDefaultResult = !isCropRecommendation && !isFertilizerResult;
  const resultLabel = isCropRecommendation ? result.best_crop : (result?.food_name || result?.identified_plant || result?.disease || result?.prediction || result?.prediction_result);
  const isHealthy = !result?.disease || result?.disease?.toLowerCase().includes('healthy');
  const diseaseFound = result?.disease && !result?.disease?.toLowerCase().includes('healthy');

  const getConfidence = () => {
    if (isCropRecommendation) return result.best_confidence;
    if (result?.confidence != null) {
      const c = Number(result.confidence);
      return c < 1 ? (c * 100).toFixed(1) : c.toFixed(1);
    }
    const m = result?.prediction?.match(/\((\d+\.\d+)\)/);
    if (m) return (parseFloat(m[1]) * 100).toFixed(1);
    return null;
  };
  const displayConfidence = getConfidence();

  if (!crop) return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="w-32 h-4 mb-4" />
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-green-700/20 to-blue-800/20 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-5">
            <Skeleton variant="icon" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-16 h-3" />
              <Skeleton variant="title" className="w-1/2" />
              <Skeleton className="w-2/3" />
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <GridCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-emerald-950 mt-14">
      <SEO title={crop?.title || 'Crop'} description={`Learn about ${crop?.title || 'crop'} - farming insights and best practices.`} url={window.location.pathname} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to={`/agriculture/${agriId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-700 dark:hover:bg-emerald-200 hover:text-white dark:hover:text-emerald-700 hover:border-emerald-700 dark:hover:border-emerald-200 transition-all duration-200 mb-4 shadow-sm">
          <ArrowLeft size={13} /> Back{agri?.title ? ` to ${agri.title}` : ''}
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
                  : isSoilInput
                    ? `Enter soil parameters for AI-powered ${isRealtime ? 'real-time ' : ''}analysis`
                    : 'Upload an image for AI-powered disease detection'}
              </p>
            </div>
          </div>
        </motion.div>

        {Object.keys(groupedSubs).length > 0 ? (
          <div className="space-y-5">
            {Object.values(groupedSubs).map((group) => {
              const open = expandedGroups[group.label] !== false;
              return (
                <div key={group.label} className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  <button
                    onClick={() => setExpandedGroups((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                    className="w-full flex items-center gap-2 p-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <group.icon size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex-1">{group.label}</span>
                    {open ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.items.map((sub) => (
                          <Link
                            key={sub.id}
                            to={authLink(`/crop/${sub.id}`)}
                            className="group block rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-0.5 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300"
                          >
                            <div className="relative">
                              {sub.image_url ? (
                                <img src={sub.image_url} alt={sub.title} className="w-full h-64 object-cover bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                                  <Sprout size={48} className="text-emerald-400" />
                                </div>
                              )}
                              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur border border-emerald-200 dark:border-emerald-700">
                                {titleEndpoint[sub.title.toLowerCase().trim()] ? 'Detect' : 'Coming Soon'}
                              </span>
                            </div>
                            <div className="p-3 relative">
                              <h3 className="text-sm font-bold text-center text-gray-900 dark:text-white">{sub.title}</h3>
                              <ArrowRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : subs.length > 0 ? (
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
                      <img src={sub.image_url} alt={sub.title} className="w-full h-72 object-cover bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                        <Sprout size={48} className="text-emerald-400" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur border border-emerald-200 dark:border-emerald-700">
                        {titleEndpoint[sub.title.toLowerCase().trim()] ? 'Detect' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 relative">
                    <h3 className="text-sm font-bold text-center text-gray-900 dark:text-white">{sub.title}</h3>
                    <ArrowRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : isSoilInput ? (
          <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Soil Parameters</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {soilInputFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={soilInputs[field.key]}
                      onChange={(e) => handleSoilInputChange(field.key, e.target.value)}
                      placeholder={`0 ${field.unit}`}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 text-sm text-gray-900 dark:text-white placeholder-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {field.unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-emerald-500">{field.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isRealtime && (
              <div className="mt-4">
                {bluetoothDevice?.gatt?.connected ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700">
                    <Bluetooth size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Connected: {bluetoothDevice.name || 'Sensor'}</p>
                      <p className="text-[10px] text-emerald-500">Auto-populated from sensor</p>
                    </div>
                    <button onClick={disconnectBluetooth} className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer">Disconnect</button>
                  </div>
                ) : (
                  <button onClick={connectBluetooth} disabled={bluetoothConnecting} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium transition-colors cursor-pointer border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 disabled:opacity-50">
                    {bluetoothConnecting ? <Loader size={16} className="animate-spin" /> : <Bluetooth size={16} />}
                    {bluetoothConnecting ? 'Connecting...' : 'Connect Bluetooth Sensor'}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handlePredict}
              disabled={predictLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {predictLoading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
              {predictLoading ? 'Analyzing...' : isRealtime ? 'Analyze Real-Time Data' : 'Analyze Soil Data'}
            </button>

            {predictLoading && predictStartTime && (
              <PredictionProgress startTime={predictStartTime} />
            )}
          </div>
        ) : matchedEndpoint ? (
          <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 p-5">
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-emerald-200 dark:border-emerald-700 rounded-xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors"
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

            <div className="flex gap-3 mt-4">
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-sm font-medium transition-colors cursor-pointer border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400"
              >
                <Camera size={16} />
                Open Camera
              </button>
              <button
                onClick={handlePredict}
                disabled={predictLoading || !file}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {predictLoading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                {predictLoading ? 'Analyzing...' : 'Detect'}
              </button>
            </div>

            {predictLoading && predictStartTime && (
              <PredictionProgress startTime={predictStartTime} />
            )}


          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-700 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
            </div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">AI analysis not available for this crop</p>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">No prediction model configured for this crop type</p>
          </div>
        )}

                    {result && (
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis Results</h3>
                </div>

                {isCropRecommendation ? (
                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sprout size={18} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Crop Recommendation</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/50 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                          <Sprout size={24} className="text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{resultLabel}</p>
                          {displayConfidence && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Target size={12} className="text-emerald-500" />
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">AI Confidence: <strong>{displayConfidence}%</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {result.soil_analysis && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield size={14} className="text-emerald-500" />
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">Soil Analysis</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(result.soil_analysis).filter(([k]) => k !== '_summary').map(([key, val]) => {
                            const levelColors = { Low: 'text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700', Ideal: 'text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700', High: 'text-red-600 border-red-300 dark:text-red-400 dark:border-red-700', 'Strongly Acidic': 'text-red-600 border-red-300 dark:text-red-400 dark:border-red-700', 'Slightly Acidic': 'text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700', 'Slightly Alkaline': 'text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700', Alkaline: 'text-red-600 border-red-300 dark:text-red-400 dark:border-red-700', 'Ideal Range': 'text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700' };
                            const bgColors = { Low: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', Ideal: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', High: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', 'Strongly Acidic': 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', 'Slightly Acidic': 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', 'Slightly Alkaline': 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', Alkaline: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', 'Ideal Range': 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' };
                            return (
                              <div key={key} className={`rounded-xl p-3.5 ${bgColors[val.level] || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'} border-2`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">{key}</p>
                                  <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelColors[val.level] || 'text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-600'}`}>{val.level}</p>
                                </div>
                                <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{val.value}</p>
                                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{val.description}</p>
                                {val.suggestion && (
                                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-relaxed">{val.suggestion}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {result.soil_analysis._summary && (
                          <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-start gap-2">
                              <Sprout size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[11px] font-bold text-gray-900 dark:text-white mb-1">Soil Health Summary</p>
                                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{result.soil_analysis._summary}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {result.recommended_crops && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sprout size={14} className="text-emerald-500" />
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">Top 10 Recommended Crops</span>
                        </div>
                        <div className="space-y-1.5">
                          {result.recommended_crops.map((c) => (
                            <div key={c.rank} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/50">
                              <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex-shrink-0">{c.rank}</span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white flex-1">{c.crop}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 overflow-hidden">
                                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.confidence}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 w-10 text-right">{c.confidence}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : isFertilizerResult ? (
                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sprout size={18} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Fertilizer Recommendation</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                          <Sprout size={24} className="text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{result.recommended_fertilizer}</p>
                          {result.crop && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">For: {result.crop} | Soil: {result.soil_type}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {result.input_summary && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={14} className="text-emerald-500" />
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">Input Parameters</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {Object.entries(result.input_summary).map(([key, val]) => (
                            <div key={key} className="rounded-xl p-2.5 text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{key}</p>
                              <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
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
                          {displayConfidence && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Target size={12} className="text-emerald-500" />
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">AI Accuracy: <strong>{displayConfidence}%</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(result.original_image || result.predicted_image || preview) && (
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
                              <img src={result.original_image} alt="Original" className="w-full h-48 object-contain cursor-zoom-in" onClick={() => setLightboxImg(result.original_image)} />
                            </div>
                          )}
                          {result.predicted_image && (
                            <div className="rounded-xl bg-emerald-50/30 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                              <div className="px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
                                <p className="text-[10px] font-medium text-emerald-600">Detection Output</p>
                              </div>
                              <img src={result.predicted_image} alt="Predicted" className="w-full h-48 object-contain cursor-zoom-in" onClick={() => setLightboxImg(result.predicted_image)} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

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
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
      </div>

      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center cursor-pointer">
          <img src={lightboxImg} alt="Full view" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" />
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-md">
            <video ref={videoRef} autoPlay playsInline className="w-full aspect-[4/3] object-cover" />
            <div className="flex items-center justify-center gap-4 px-4 py-4">
              <button
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCapture}
                className="px-8 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer shadow-lg"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}