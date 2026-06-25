import { useState, useEffect } from 'react';
import { Leaf, Droplets, Sun, Shield, ChevronRight, Loader } from 'lucide-react';
import api from '../services/api';

export default function PlantGuide() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.plantRecs.categories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setActiveCat(cats[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    setLoading(true);
    api.plantRecs.list(activeCat).then(setPlants).catch(() => {}).finally(() => setLoading(false));
  }, [activeCat]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Leaf size={36} className="text-emerald-500 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plant Guide</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find the best plants for your home, office, or specific needs</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${activeCat === cat ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader size={20} className="animate-spin text-emerald-500" /></div>
        ) : plants.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">No plants in this category yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {p.image_url && (
                  <img src={p.image_url} alt={p.plant_name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{p.plant_name}</h3>
                  {p.scientific_name && <p className="text-[11px] text-gray-400 italic mt-0.5">{p.scientific_name}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">{p.description}</p>
                  {p.benefits && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.benefits.split(',').slice(0, 3).map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[10px] text-emerald-600 dark:text-emerald-400">{b.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between px-4 py-2 text-[11px] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 transition-colors cursor-pointer">
                  {expanded === p.id ? 'Show Less' : 'Care Tips & More'}
                  <ChevronRight size={12} className={`transition-transform ${expanded === p.id ? 'rotate-90' : ''}`} />
                </button>
                {expanded === p.id && (
                  <div className="px-4 pb-4 pt-2 space-y-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    {p.care_tips && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"><Droplets size={11} /> Care Tips</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{p.care_tips}</p>
                      </div>
                    )}
                    {p.benefits && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"><Shield size={11} /> Benefits</p>
                        <ul className="mt-0.5 space-y-0.5">
                          {p.benefits.split(',').map((b, i) => (
                            <li key={i} className="flex items-start gap-1 text-[11px] text-gray-500 dark:text-gray-400"><ChevronRight size={10} className="text-emerald-400 mt-0.5 shrink-0" />{b.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}