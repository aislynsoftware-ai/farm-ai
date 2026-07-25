import { useState, useEffect, useMemo } from 'react';
import { Image, Loader, CheckCircle, X, ExternalLink, Download, FolderOpen } from 'lucide-react';
import api from '../services/api';

export default function AdminVolunteerImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectNote, setRejectNote] = useState({});
  const [bulkNote, setBulkNote] = useState('');
  const [selected, setSelected] = useState({});
  const [bulkBusy, setBulkBusy] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const load = (status) => {
    setLoading(true);
    setSelected({});
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

  const selectedIds = Object.keys(selected).filter((id) => selected[id]).map(Number);

  const toggleSelect = (id) => {
    setSelected((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggleSelectCategory = (categoryImages) => {
    const allSelected = categoryImages.every((img) => selected[img.id]);
    setSelected((p) => {
      const next = { ...p };
      categoryImages.forEach((img) => { next[img.id] = !allSelected; });
      return next;
    });
  };

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      await api.volunteer.admin.bulkApproveImages(selectedIds);
      load(filter);
    } catch (err) { alert(err.message); }
    finally { setBulkBusy(false); }
  };

  const handleBulkReject = async () => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      await api.volunteer.admin.bulkRejectImages(selectedIds, bulkNote);
      setBulkNote('');
      load(filter);
    } catch (err) { alert(err.message); }
    finally { setBulkBusy(false); }
  };

  const downloadCategory = async (categoryId, categoryName) => {
    const key = categoryId || 'all';
    setDownloading(key);
    const url = api.volunteer.admin.getImagesDownloadUrl(categoryId, filter || 'approved');
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `volunteer_images_${categoryName || 'all'}_${filter || 'approved'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const grouped = useMemo(() => {
    const groups = {};
    images.forEach((img) => {
      const key = img.category_name || 'Uncategorized';
      if (!groups[key]) groups[key] = { categoryId: img.category_id, categoryName: key, items: [] };
      groups[key].items.push(img);
    });
    return Object.values(groups);
  }, [images]);

  if (loading) return <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Image size={20} className="text-emerald-500" /> Volunteer Images</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', ''].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${filter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        <button
          onClick={() => downloadCategory(null, 'all')}
          disabled={downloading === 'all' || images.length === 0}
          className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-600 hover:text-white disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          {downloading === 'all' ? <Loader size={12} className="animate-spin" /> : <Download size={12} />}
          Download All ({filter || 'all statuses'})
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 p-3">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{selectedIds.length} selected</span>
          <button onClick={handleBulkApprove} disabled={bulkBusy} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer flex items-center gap-1">
            <CheckCircle size={12} /> Approve Selected
          </button>
          <input
            value={bulkNote}
            onChange={(e) => setBulkNote(e.target.value)}
            placeholder="Rejection note (optional)"
            className="w-40 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs bg-white dark:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button onClick={handleBulkReject} disabled={bulkBusy} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-50 cursor-pointer flex items-center gap-1">
            <X size={12} /> Reject Selected
          </button>
          <button onClick={() => setSelected({})} className="text-xs text-gray-500 hover:underline cursor-pointer ml-auto">Clear</button>
        </div>
      )}

      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.categoryName} className="rounded-xl border border-emerald-200 dark:border-emerald-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={group.items.every((img) => selected[img.id])}
                  onChange={() => toggleSelectCategory(group.items)}
                  className="cursor-pointer"
                />
                <FolderOpen size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{group.categoryName}</span>
                <span className="text-xs text-emerald-500">({group.items.length})</span>
              </div>
              <button
                onClick={() => downloadCategory(group.categoryId, group.categoryName)}
                disabled={downloading === (group.categoryId || 'all')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium hover:bg-emerald-600 hover:text-white disabled:opacity-50 flex items-center gap-1 cursor-pointer border border-emerald-200 dark:border-emerald-700"
              >
                {downloading === (group.categoryId || 'all') ? <Loader size={11} className="animate-spin" /> : <Download size={11} />}
                Download ZIP
              </button>
            </div>

            <div className="grid gap-3 p-4 bg-white dark:bg-gray-800">
              {group.items.map((img) => (
                <div key={img.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
                  <input
                    type="checkbox"
                    checked={!!selected[img.id]}
                    onChange={() => toggleSelect(img.id)}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <img src={img.image_url} alt="" className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{img.user_name || img.user_email}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${img.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : img.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>{img.status}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">{new Date(img.created_at).toLocaleString()}</p>
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
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-center py-8 text-xs text-gray-400">No images found</p>}
      </div>
    </div>
  );
}
