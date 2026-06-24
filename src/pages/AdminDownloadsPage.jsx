import { useState, useEffect } from 'react';
import { Download as DownloadIcon, FolderOpen, ChevronDown, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminDownloadsPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api.admin.getPredictionsTree().then(setTree).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const download = (crop, disease, type = 'all') => {
    const label = disease ? `${crop}/${disease}` : crop;
    setDownloading(`${label}_${type}`);
    const url = api.admin.getDownloadUrl(crop, disease, type);
    const token = localStorage.getItem('admin_token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Download failed');
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `predictions_${crop}_${disease || 'all'}_${type}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => alert(err.message))
      .finally(() => setDownloading(null));
  };

  const DownloadBtn = ({ crop, disease, type, label, icon }) => {
    const key = disease ? `${crop}/${disease}_${type}` : `${crop}_${type}`;
    return (
      <button
        onClick={() => download(crop, disease, type)}
        disabled={downloading === key}
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-200 text-[10px] hover:bg-emerald-600 hover:text-white disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-all"
        title={`Download ${label}`}
      >
        {downloading === key ? <Loader size={10} className="animate-spin" /> : icon}
        {label}
      </button>
    );
  };

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Download Predictions</h2>
      <p className="text-xs text-gray-600 dark:text-gray-400">Download original & predicted images grouped by crop → disease</p>

      <div className="space-y-3">
        {tree.map((item) => (
          <div key={item.crop} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => setExpanded((p) => ({ ...p, [item.crop]: !p[item.crop] }))}>
              <div className="flex items-center gap-3">
                {expanded[item.crop] ? <ChevronDown size={16} className="text-emerald-400" /> : <ChevronRight size={16} className="text-emerald-400" />}
                <FolderOpen size={18} className="text-emerald-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{item.crop}</span>
                <span className="text-xs text-emerald-400">({item.total} images)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DownloadBtn crop={item.crop} type="original" label="Orig" icon={<DownloadIcon size={10} />} />
                <DownloadBtn crop={item.crop} type="predicted" label="Pred" icon={<DownloadIcon size={10} />} />
                <DownloadBtn crop={item.crop} type="all" label="All" icon={<DownloadIcon size={10} />} />
              </div>
            </div>

            {expanded[item.crop] && (
              <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-emerald-100 dark:divide-emerald-700">
                {item.diseases.map((d) => (
                  <div key={d.disease} className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-800 dark:text-gray-200 capitalize">{d.disease.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-emerald-400">({d.count} images)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DownloadBtn crop={item.crop} disease={d.disease} type="original" label="Orig" icon={<DownloadIcon size={10} />} />
                      <DownloadBtn crop={item.crop} disease={d.disease} type="predicted" label="Pred" icon={<DownloadIcon size={10} />} />
                      <DownloadBtn crop={item.crop} disease={d.disease} type="all" label="ZIP" icon={<DownloadIcon size={10} />} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {!loading && tree.length === 0 && <div className="p-6 text-center text-emerald-400 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">No predictions found</div>}
      </div>
    </div>
  );
}
