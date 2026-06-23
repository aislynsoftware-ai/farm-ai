import { useState, useEffect } from 'react';
import { Download, FolderOpen, ChevronDown, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function AdminDownloadsPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api.admin.getPredictionsTree().then(setTree).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const download = (crop, disease) => {
    const label = disease ? `${crop}/${disease}` : crop;
    setDownloading(label);
    const url = api.admin.getDownloadUrl(crop, disease);
    const a = document.createElement('a');
    a.href = url;
    const token = localStorage.getItem('admin_token');
    if (token) a.href = url + (url.includes('?') ? '&' : '?') + `token=${token}`;
    // Use fetch with auth header
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Download failed');
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `predictions_${crop}_${disease || 'all'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => alert(err.message))
      .finally(() => setDownloading(null));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader size={24} className="animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Download Predictions</h2>
      <p className="text-xs text-gray-400">Download original & predicted images grouped by crop → disease</p>

      <div className="space-y-3">
        {tree.map((item) => (
          <div key={item.crop} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors" onClick={() => setExpanded((p) => ({ ...p, [item.crop]: !p[item.crop] }))}>
              <div className="flex items-center gap-3">
                {expanded[item.crop] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                <FolderOpen size={18} className="text-emerald-400" />
                <span className="text-sm font-medium text-white capitalize">{item.crop}</span>
                <span className="text-xs text-gray-500">({item.total} images)</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); download(item.crop); }}
                disabled={downloading === item.crop}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {downloading === item.crop ? <Loader size={12} className="animate-spin" /> : <Download size={12} />}
                All
              </button>
            </div>

            {expanded[item.crop] && (
              <div className="border-t border-gray-700/50 divide-y divide-gray-700/50">
                {item.diseases.map((d) => (
                  <div key={d.disease} className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-gray-700/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-300 capitalize">{d.disease.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-gray-500">({d.count} images)</span>
                    </div>
                    <button
                      onClick={() => download(item.crop, d.disease)}
                      disabled={downloading === `${item.crop}/${d.disease}`}
                      className="px-2.5 py-1 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-emerald-600 hover:text-white disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      {downloading === `${item.crop}/${d.disease}` ? <Loader size={11} className="animate-spin" /> : <Download size={11} />}
                      ZIP
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {tree.length === 0 && <div className="p-6 text-center text-gray-500 rounded-xl bg-gray-800/80 border border-gray-700">No predictions found</div>}
      </div>
    </div>
  );
}
