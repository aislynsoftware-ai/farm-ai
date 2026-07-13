import { useState, useEffect } from 'react';
import { Image, Loader, CheckCircle, X, ExternalLink, Filter } from 'lucide-react';
import api from '../services/api';

export default function AdminVolunteerImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectNote, setRejectNote] = useState({});

  const load = (status) => {
    setLoading(true);
    api.volunteer.admin.images(status).then(setImages).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await api.volunteer.admin.approveImage(id);
      load(filter);
    } catch (err) { alert(err.message); }
  };

  const handleReject = async (id) => {
    const note = rejectNote[id] || '';
    try {
      await api.volunteer.admin.rejectImage(id, note);
      setRejectNote((p) => ({ ...p, [id]: '' }));
      load(filter);
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Image size={20} className="text-emerald-500" /> Volunteer Images</h1>
      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${filter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
            <img src={img.image_url} alt="" className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{img.user_name || img.user_email}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${img.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : img.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>{img.status}</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Category: {img.category_name} | {new Date(img.created_at).toLocaleString()}</p>
              <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mb-2"><ExternalLink size={11} /> View Full</a>
              {img.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleApprove(img.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer"><CheckCircle size={12} className="inline mr-1" />Approve (2rs)</button>
                  <div className="flex gap-1">
                    <input value={rejectNote[img.id] || ''} onChange={(e) => setRejectNote((p) => ({ ...p, [img.id]: e.target.value }))} placeholder="Rejection note" className="w-32 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400" />
                    <button onClick={() => handleReject(img.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 cursor-pointer"><X size={12} className="inline mr-1" />Reject</button>
                  </div>
                </div>
              )}
              {img.admin_note && <p className="text-[11px] text-red-500 mt-1">Note: {img.admin_note}</p>}
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-center py-8 text-xs text-gray-400">No images found</p>}
      </div>
    </div>
  );
}