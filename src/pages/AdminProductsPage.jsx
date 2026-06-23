import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, AlertCircle, CheckCircle, ExternalLink, ImageIcon, Loader, X } from 'lucide-react';
import api from '../services/api';

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({
    disease_name: '', product1_name: '', product1_url: '', product1_image: null,
    product2_name: '', product2_url: '', product2_image: null,
    product3_name: '', product3_url: '', product3_image: null,
    product4_name: '', product4_url: '', product4_image: null,
    fertilizers: '', pesticides: '', care_points: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const fileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const load = () => api.farming.cropWithProducts().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleDelete = async (productId) => {
    if (!productId || !confirm('Delete this product entry?')) return;
    try { await api.admin.deleteProduct(productId); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const openEdit = (disease) => {
    setEditModal(disease);
    setEditForm({
      disease_name: disease.disease_name || '',
      product1_name: disease.products?.[0]?.product_name || '',
      product1_url: disease.products?.[0]?.product_url || '',
      product1_image: null,
      product2_name: disease.products?.[1]?.product_name || '',
      product2_url: disease.products?.[1]?.product_url || '',
      product2_image: null,
      product3_name: disease.products?.[2]?.product_name || '',
      product3_url: disease.products?.[2]?.product_url || '',
      product3_image: null,
      product4_name: disease.products?.[3]?.product_name || '',
      product4_url: disease.products?.[3]?.product_url || '',
      product4_image: null,
      fertilizers: disease.fertilizers || '',
      pesticides: disease.pesticides || '',
      care_points: disease.care_points || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const fd = new FormData();
      fd.append('disease_name', editForm.disease_name);
      fd.append('product1_name', editForm.product1_name);
      fd.append('product1_url', editForm.product1_url);
      if (editForm.product1_image) fd.append('product1_image', editForm.product1_image);
      fd.append('product2_name', editForm.product2_name);
      fd.append('product2_url', editForm.product2_url);
      if (editForm.product2_image) fd.append('product2_image', editForm.product2_image);
      fd.append('product3_name', editForm.product3_name);
      fd.append('product3_url', editForm.product3_url);
      if (editForm.product3_image) fd.append('product3_image', editForm.product3_image);
      fd.append('product4_name', editForm.product4_name);
      fd.append('product4_url', editForm.product4_url);
      if (editForm.product4_image) fd.append('product4_image', editForm.product4_image);
      fd.append('fertilizers', editForm.fertilizers);
      fd.append('pesticides', editForm.pesticides);
      fd.append('care_points', editForm.care_points);
      await api.admin.updateProduct(editModal.product_id, fd);
      show('Product updated');
      setEditModal(null);
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const inputClass = "w-full px-2.5 py-1.5 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-xs";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Products (crop_products)</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto py-8" onClick={() => setEditModal(null)}>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Edit Product #{editModal.product_id}</h3>
              <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Disease Name</label>
                <input value={editForm.disease_name} onChange={(e) => setEditForm((p) => ({ ...p, disease_name: e.target.value }))} className={inputClass} />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-700 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-400 mb-2">Product {i}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input value={editForm[`product${i}_name`]} onChange={(e) => setEditForm((p) => ({ ...p, [`product${i}_name`]: e.target.value }))} placeholder="Name" className={inputClass} />
                    <input value={editForm[`product${i}_url`]} onChange={(e) => setEditForm((p) => ({ ...p, [`product${i}_url`]: e.target.value }))} placeholder="URL" className={inputClass} />
                    <div className="flex items-center gap-2">
                      <input type="file" accept="image/*" ref={fileRefs[i - 1]} className="hidden" onChange={(e) => setEditForm((p) => ({ ...p, [`product${i}_image`]: e.target.files?.[0] || null }))} />
                      <button type="button" onClick={() => fileRefs[i - 1].current?.click()} className="px-2 py-1.5 rounded bg-gray-700 text-white text-xs hover:bg-gray-600 cursor-pointer">Image</button>
                      {editForm[`product${i}_image`] && <span className="text-xs text-emerald-400 truncate">{editForm[`product${i}_image`].name}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Fertilizers</label>
                  <input value={editForm.fertilizers} onChange={(e) => setEditForm((p) => ({ ...p, fertilizers: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Pesticides</label>
                  <input value={editForm.pesticides} onChange={(e) => setEditForm((p) => ({ ...p, pesticides: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Care Points</label>
                  <input value={editForm.care_points} onChange={(e) => setEditForm((p) => ({ ...p, care_points: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={() => setEditModal(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <div className="px-4 py-2 bg-gray-700/30 flex items-center justify-between">
                <p className="text-xs font-medium text-emerald-400">{disease.disease_name || 'General'}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(disease)} className="p-1 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={11} /></button>
                  <button onClick={() => handleDelete(disease.product_id)} className="p-1 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={11} /></button>
                </div>
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
                      {prod.product_url && (
                        <a href={prod.product_url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1">
                          <ExternalLink size={10} /> Link
                        </a>
                      )}
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
