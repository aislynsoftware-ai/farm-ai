import { useState, useEffect } from 'react';
import { Trash2, AlertCircle, CheckCircle, ExternalLink, ImageIcon } from 'lucide-react';
import api from '../services/api';

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const load = () => api.farming.cropWithProducts().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product entry?')) return;
    try { await api.admin.deleteProduct(id); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Products (crop_products)</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {items.map((crop) => (
        <div key={crop.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-3">
            {crop.image_url && <img src={crop.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
            <div>
              <p className="text-sm font-medium text-white">{crop.title}</p>
              <p className="text-xs text-gray-400">{crop.crop_name}</p>
            </div>
          </div>
          {crop.products && crop.products.length > 0 ? crop.products.map((disease, di) => (
            <div key={di} className="border-b border-gray-700/50 last:border-0">
              <div className="px-4 py-2 bg-gray-700/30">
                <p className="text-xs font-medium text-emerald-400">{disease.disease_name || 'General'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
                {disease.products && disease.products.filter((p) => p.product_name).map((prod, pi) => (
                  <div key={pi} className="rounded-lg bg-gray-700/50 border border-gray-600 overflow-hidden">
                    {prod.product_image ? (
                      <img src={prod.product_image} alt="" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-700">
                        <ImageIcon size={24} className="text-gray-500" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-medium text-white truncate">{prod.product_name}</p>
                      <a href={prod.product_url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1">
                        <ExternalLink size={10} /> Link
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {(disease.fertilizers || disease.pesticides) && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {disease.fertilizers && <span className="px-2 py-0.5 rounded bg-green-900/30 text-green-400 text-[10px]">{disease.fertilizers}</span>}
                  {disease.pesticides && <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-400 text-[10px]">{disease.pesticides}</span>}
                </div>
              )}
              <div className="px-4 pb-3 flex justify-end">
                <button onClick={() => handleDelete(disease.id || di)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-500 text-xs">No products for this sub crop</div>
          )}
        </div>
      ))}
      {items.length === 0 && <div className="p-6 text-center text-gray-500 rounded-xl bg-gray-800/80 border border-gray-700">No products found</div>}
    </div>
  );
}
