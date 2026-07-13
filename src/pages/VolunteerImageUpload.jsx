import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, Loader, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import api from '../services/api';

const CATEGORIES = [
  { id: 1, name: 'Tomato' },
  { id: 2, name: 'Potato' },
  { id: 3, name: 'Brinjal' },
  { id: 4, name: 'Chili' },
  { id: 5, name: 'Cauliflower' },
  { id: 6, name: 'Cucumber' },
  { id: 7, name: 'Potted Plant' },
  { id: 8, name: 'Rose' },
  { id: 9, name: 'Marigold' },
  { id: 10, name: 'Other' },
];

export default function VolunteerImageUpload() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, []);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => {
      const combined = [...prev, ...selected].slice(0, 10);
      setPreviews(combined.map((f) => URL.createObjectURL(f)));
      return combined;
    });
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      setPreviews(updated.map((f) => URL.createObjectURL(f)));
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) { setError('Please select a category'); return; }
    if (files.length === 0) { setError('Please select at least one image'); return; }
    setUploading(true); setError(''); setSuccess('');
    try {
      const res = await api.volunteer.uploadImages(user.user_id, categoryId, files);
      setSuccess(`${res.count} image(s) uploaded successfully! 2rs each will be credited after admin approval.`);
      setFiles([]);
      setPreviews([]);
      setCategoryId('');
    } catch (err) { setError(err.message); }
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 py-8 px-4">
      <SEO title="Upload Images" description="Upload crop images and earn rewards" url="/volunteer-upload" />
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Upload Images</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Earn 2rs per approved image</p>

          {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600 dark:text-red-400">{error}</p></div>}
          {success && <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={14} className="text-emerald-500" /><p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p></div>}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Select Category</label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map((c) => (
                  <button type="button" key={c.id} onClick={() => setCategoryId(c.id)} className={`px-2 py-2 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${categoryId === c.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-emerald-300'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Upload Images (up to 10)</label>
              <div className="flex flex-wrap gap-3">
                {previews.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"><X size={11} /></button>
                  </div>
                ))}
                {files.length < 10 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 cursor-pointer transition-colors">
                    <Image size={24} />
                    <span className="text-[10px] mt-1">Add</span>
                    <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" disabled={uploading} className="w-full justify-center">
              {uploading ? <Loader size={16} className="animate-spin" /> : null}
              {uploading ? 'Uploading...' : `Upload ${files.length} Image(s)`}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
            <p className="text-[11px] text-amber-700 dark:text-amber-300">Images will be reviewed by admin before reward is credited. Only high-quality, relevant images will be approved.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}