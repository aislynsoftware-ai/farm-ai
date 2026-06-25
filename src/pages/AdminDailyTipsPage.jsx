import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Lightbulb, Sparkles, Sun } from 'lucide-react';
import api from '../services/api';

const categories = [
  { key: 'tip_of_day', label: 'Tip of the Day', icon: Lightbulb },
  { key: 'plant_hack', label: 'Plant Hack', icon: Sparkles },
  { key: 'seasonal', label: 'Seasonal Alert', icon: Sun },
];

export default function AdminDailyTipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ category: 'tip_of_day', title: '', content: '', image_url: '' });

  const fetchTips = () => { api.dailyTips.admin.list().then(setTips).catch(() => {}); };

  useEffect(() => { fetchTips(); }, []);

  const openAdd = () => { setEdit(null); setForm({ category: 'tip_of_day', title: '', content: '', image_url: '' }); setShowModal(true); };
  const openEdit = (tip) => { setEdit(tip); setForm({ category: tip.category, title: tip.title, content: tip.content || '', image_url: tip.image_url || '' }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (edit) {
      await api.dailyTips.admin.update(edit.id, form);
    } else {
      await api.dailyTips.admin.add(form);
    }
    setShowModal(false);
    fetchTips();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tip?')) return;
    await api.dailyTips.admin.delete(id);
    fetchTips();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Daily Tips</h2>
          <p className="text-xs text-gray-500">Manage tips of the day, plant hacks, and seasonal alerts</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer">
          <Plus size={14} /> Add Tip
        </button>
      </div>

      {tips.length === 0 ? (
        <p className="text-xs text-gray-400">No tips yet.</p>
      ) : (
        <div className="space-y-2">
          {tips.map((tip) => (
            <div key={tip.id} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 text-emerald-600">
                {(() => { const Icon = categories.find(c => c.key === tip.category)?.icon || Lightbulb; return <Icon size={14} />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-1 ${
                  tip.category === 'tip_of_day' ? 'bg-amber-100 text-amber-700' :
                  tip.category === 'plant_hack' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>{tip.category === 'tip_of_day' ? 'Tip of Day' : tip.category === 'plant_hack' ? 'Plant Hack' : 'Seasonal'}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{tip.title}</p>
                {tip.content && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{tip.content}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(tip)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"><Edit3 size={13} /></button>
                <button onClick={() => handleDelete(tip.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{edit ? 'Edit Tip' : 'Add Tip'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none">
                {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none" />
              <textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Content" rows={3} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none resize-none" />
              <input value={form.image_url} onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="Image URL (optional)" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white outline-none" />
              <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer">
                {edit ? 'Update' : 'Add'} Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}