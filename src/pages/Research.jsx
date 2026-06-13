import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Database, FolderTree,
  Leaf, Apple, Flower2, Grid3X3,
  ChevronDown, ChevronRight, Search,
  Layers, BarChart3, FileImage,
  X, Maximize2, ImageIcon, MessageCircle, Mail, Camera,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import Skeleton from '../components/common/Skeleton';

const CAT_ICONS = {
  Flowers: Flower2,
  Fruits: Apple,
  Leafs: Leaf,
  Vegitables: Grid3X3,
};

const CAT_COLORS = {
  Flowers: { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-200 dark:border-pink-800/40', text: 'text-pink-600 dark:text-pink-400', bar: 'bg-pink-500' },
  Fruits: { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800/40', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' },
  Leafs: { from: 'from-emerald-500', to: 'to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800/40', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  Vegitables: { from: 'from-purple-500', to: 'to-violet-500', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800/40', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
};

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center cursor-zoom-out"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X size={20} className="text-white" />
      </button>
      <img
        src={src}
        alt="Full view"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl select-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="relative group"
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClassBar({ name, count, maxCount, detail }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const normalPct = detail ? (detail.normal / maxCount) * 100 : 0;
  const realtimePct = detail ? (detail.realtime / maxCount) * 100 : 0;
  const fmt = (n) => n.toLocaleString();
  return (
    <div className="group/bar">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-gray-700 dark:text-gray-300 truncate">{name}</span>
        <span className="font-mono font-medium text-gray-500 dark:text-gray-400">{fmt(count)}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${normalPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${realtimePct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        />
      </div>
      <div className="flex items-center justify-between text-[9px] mt-0.5 text-gray-400 dark:text-gray-500">
        <span>&#9899; N {fmt(detail?.normal || 0)}</span>
        <span>&#9899; R {fmt(detail?.realtime || 0)}</span>
      </div>
    </div>
  );
}

function CropCard({ cropName, cropData, catColors, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasSamples = cropData.sampleImages?.length > 0;
  const hasSplits = cropData.splits && Object.keys(cropData.splits).length > 0;
  const maxCount = Math.max(...Object.values(cropData.classCounts || {}), 1);
  const classes = (cropData.classes || []).filter(c => !c.toLowerCase().endsWith('.txt'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 text-left bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${catColors.from} ${catColors.to} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
            <FileImage size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{cropName.replace(/_/g, ' ')}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{cropData.totalImages.toLocaleString()} images</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">&middot;</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{classes.length} classes</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasSplits && (
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {Object.entries(cropData.splits).map(([k, v]) => (
                <SplitBadge key={k} label={k} count={v.totalImages} />
              ))}
            </div>
          )}
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${expanded ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'}`}>
            {expanded ? (
              <ChevronDown size={14} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronRight size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            )}
          </div>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-2 px-4 py-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-700 space-y-4">
              {hasSplits && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Split Distribution</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cropData.splits).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">{k}</span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{v.totalImages.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">total</span>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{cropData.totalImages.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">Class Distribution</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {classes.map((cls) => (
                    <ClassBar
                      key={cls}
                      name={cls}
                      count={cropData.classCounts[cls] || 0}
                      maxCount={maxCount}
                      detail={cropData.classCountsDetail?.[cls]}
                    />
                  ))}
                </div>
              </div>

              {hasSamples && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sample Images</p>
                  <SampleGrid images={cropData.sampleImages} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SplitBadge({ label, count }) {
  const colors = {
    train: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    test: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    validation: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${colors[label] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
      {label}
      <span className="font-mono">{count}</span>
    </span>
  );
}

function SampleGrid({ images }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="grid grid-cols-5 gap-1.5">
        {images.slice(0, 10).map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(src)}
            className="relative group/img aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 hover:ring-2 ring-emerald-400 transition-all cursor-pointer focus:outline-none"
          >
            <img
              src={src}
              alt={`Sample ${i + 1}`}
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300 select-none"
              loading="lazy"
              draggable={false}
              onError={(e) => { e.target.style.display = 'none'; }}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <Maximize2 size={14} className="text-white/0 group-hover/img:text-white/70 transition-all duration-200" />
            </div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}

function CategorySection({ catName, crops, stageKey }) {
  const cc = CAT_COLORS[catName] || { from: 'from-emerald-500', to: 'to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800/40', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' };
  const Icon = CAT_ICONS[catName] || FolderTree;
  const entries = Object.entries(crops);
  if (entries.length === 0) return null;
  const total = entries.reduce((s, [, c]) => s + c.totalImages, 0);
  const totalClasses = entries.reduce((s, [, c]) => s + c.classes.length, 0);

  return (
    <div className="mb-5">
      <div className={`flex items-center gap-3 mb-3 px-4 py-3 rounded-xl ${cc.bg} border ${cc.border} hover:shadow-md transition-shadow duration-200`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cc.from} ${cc.to} flex items-center justify-center shadow`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{catName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{entries.length}</span> crops &middot;{' '}
            <span className="font-medium">{total.toLocaleString()}</span> images &middot;{' '}
            <span className="font-medium">{totalClasses}</span> classes
          </p>
        </div>
      </div>
      <div className="space-y-1">
        {entries.map(([name, data], i) => (
          <CropCard key={name} cropName={name} cropData={data} catColors={cc} index={i} />
        ))}
      </div>
    </div>
  );
}

function AdditionalCard({ name, data, index }) {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(data).filter(([k]) => k !== 'totalImages');
  const isFlat = name === 'Dracaena_Plant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 text-left bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <Database size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name.replace(/_/g, ' ')}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{data.totalImages?.toLocaleString() || 0} images</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${expanded ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'}`}>
            {expanded ? <ChevronDown size={14} className="text-blue-600 dark:text-blue-400" /> : <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />}
          </div>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-2 px-4 py-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-700 space-y-3">
              {entries.map(([key, val]) => (
                <div key={key}>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                    {key} {val.totalImages ? `(${val.totalImages.toLocaleString()} images)` : ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {isFlat
                      ? Object.entries(val).map(([cls, count]) => (
                          <span key={cls} className="px-2 py-0.5 text-[10px] rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            {cls} ({count})
                          </span>
                        ))
                      : (Array.isArray(val?.classes) ? val.classes : Object.keys(val?.classes || {})).map((cls) => (
                          <span key={cls} className="px-2 py-0.5 text-[10px] rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            {typeof cls === 'string' ? cls : `${cls} (${val.classes[cls] || 0})`}
                          </span>
                        ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function OverviewGrid({ data }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-shadow duration-300">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-500" />
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Stage 1 Models', value: 19, color: 'from-emerald-500 to-green-600' },
            { label: 'Stage 2 Models', value: 22, color: 'from-blue-500 to-cyan-500' },
            { label: 'Stage 1 Images', value: data.stage1.totalImages, color: 'from-purple-500 to-violet-500' },
            { label: 'Stage 2 Images', value: data.stage2.totalImages, color: 'from-orange-500 to-red-500' },
          ].map((item) => (
            <div key={item.label} className={`p-3.5 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-white/20 hover:scale-[1.02] transition-transform duration-200`}>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider">{item.label}</p>
              <p className="text-lg font-bold text-white mt-0.5">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {['stage1', 'stage2'].map((sk) => (
        <div key={sk} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-shadow duration-300">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers size={16} className="text-emerald-500" />
            {sk === 'stage1' ? 'Stage 1' : 'Stage 2'} Datasets Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data[sk].categories).map(([cat, crops]) => {
              const total = Object.values(crops).reduce((s, c) => s + c.totalImages, 0);
              const clsCount = Object.values(crops).reduce((s, c) => s + c.classes.length, 0);
              const cc = CAT_COLORS[cat];
              const Icon = CAT_ICONS[cat] || FolderTree;
              return (
                <div key={cat} className={`p-3.5 rounded-xl ${cc.bg} border ${cc.border} hover:scale-[1.02] transition-all duration-200 cursor-default`}>
                  <Icon size={16} className={`${cc.text} mb-1`} />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{cat}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {Object.keys(crops).length} crops &middot; {total.toLocaleString()} images &middot; {clsCount} classes
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-shadow duration-300">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database size={16} className="text-emerald-500" />
          Additional Datasets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(data.additional).map(([name, info]) => (
            <div key={name} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 cursor-default">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{name.replace(/_/g, ' ')}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{info.totalImages?.toLocaleString() || 0} images</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Research() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const totals = useMemo(() => {
    if (!data) return { normal: 0, realtime: 0 };
    let n = 0, r = 0;
    const sumCrop = (crop) => {
      if (!crop.classCountsDetail) return;
      Object.values(crop.classCountsDetail).forEach((d) => {
        n += d.normal || 0;
        r += d.realtime || 0;
      });
    };
    ['stage1', 'stage2'].forEach((sk) => {
      Object.values(data[sk].categories).forEach((cat) =>
        Object.values(cat).forEach(sumCrop)
      );
    });
    Object.values(data.additional).forEach((v) => {
      if (!v || typeof v !== 'object') return;
      Object.values(v).forEach((sub) => {
        if (sub && typeof sub === 'object' && sub.classCountsDetail) {
          Object.values(sub.classCountsDetail).forEach((d) => {
            n += d.normal || 0;
            r += d.realtime || 0;
          });
        }
      });
    });
    return { normal: n, realtime: r };
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/dataset-catalog.json');
        setData(await res.json());
      } catch (e) {
        console.error('Failed to load catalog:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filterCrops = useCallback((crops) => {
    if (!searchQuery) return crops;
    const q = searchQuery.toLowerCase();
    return Object.fromEntries(
      Object.entries(crops).filter(([name]) => name.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'stage1', label: 'Stage 1', icon: Layers },
    { id: 'stage2', label: 'Stage 2', icon: Layers },
    { id: 'datasets', label: 'Datasets', icon: Database },
  ];

  if (loading) {
    return (
      <main>
        <PageHeader title="Research & Development" description="Comprehensive overview of datasets, models, and training pipelines." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <Skeleton className="w-16 h-3 mb-2" />
                <Skeleton variant="title" className="w-20" />
              </div>
            ))}
          </div>
          <Skeleton variant="card" className="h-40" />
          <Skeleton variant="card" className="h-60" />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main>
        <PageHeader title="Research & Development" description="Comprehensive overview of datasets, models, and training pipelines." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
          <div className="p-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <Database size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Catalog not found. Run <code className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">python generate_dataset_catalog.py</code> to generate it.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        title="Research & Development"
        description="Comprehensive overview of AI datasets, class distributions, and training pipelines powering Farmlyt AI."
      />

      <section className="py-8 bg-emerald-50/30 dark:bg-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-6 group">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search crops or datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 dark:focus:border-emerald-700 transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard icon={Brain} label="Models" value={data.totalModels} color="from-blue-500 to-cyan-500" delay={0} />
            <StatCard icon={Database} label="Total Images" value={data.totalImages} color="from-purple-500 to-violet-500" delay={0.05} />
            <StatCard icon={FolderTree} label="Datasets" value={data.totalDatasets} color="from-orange-500 to-red-500" delay={0.1} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard icon={ImageIcon} label="Normal Images" value={totals.normal} color="from-emerald-500 to-green-600" delay={0.15} />
            <StatCard icon={Camera} label="Realtime Images" value={totals.realtime} color="from-blue-500 to-indigo-500" delay={0.2} />
          </div>

          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const T = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm'
                  }`}
                >
                  <T size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'overview' && <OverviewGrid data={data} />}

          {activeTab === 'stage1' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle title="Stage 1 Training Datasets" subtitle={`${data.stage1.totalImages.toLocaleString()} total images across all crops`} />
              {searchQuery && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                  Showing results for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
              {Object.entries(data.stage1.categories).map(([cat, crops]) => {
                const filtered = filterCrops(crops);
                return Object.keys(filtered).length > 0 ? (
                  <CategorySection key={cat} catName={cat} crops={filtered} stageKey="stage1" />
                ) : null;
              })}
              {Object.values(data.stage1.categories).every(c => Object.keys(filterCrops(c)).length === 0) && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">No crops match &ldquo;{searchQuery}&rdquo;</p>
              )}
            </motion.div>
          )}

          {activeTab === 'stage2' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle title="Stage 2 Training Datasets" subtitle={`${data.stage2.totalImages.toLocaleString()} total images across all crops`} />
              {searchQuery && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                  Showing results for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
              {Object.entries(data.stage2.categories).map(([cat, crops]) => {
                const filtered = filterCrops(crops);
                return Object.keys(filtered).length > 0 ? (
                  <CategorySection key={cat} catName={cat} crops={filtered} stageKey="stage2" />
                ) : null;
              })}
              {Object.values(data.stage2.categories).every(c => Object.keys(filterCrops(c)).length === 0) && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">No crops match &ldquo;{searchQuery}&rdquo;</p>
              )}
            </motion.div>
          )}

          {activeTab === 'datasets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle title="Additional Datasets" subtitle="Supplemental training and evaluation datasets" />
              <div className="space-y-1 max-w-3xl mx-auto">
                {Object.entries(data.additional).map(([name, info], i) => (
                  <AdditionalCard key={name} name={name} data={info} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">For Dataset Download, Contact</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Reach out for dataset access and inquiries</p>
                <div className="flex i