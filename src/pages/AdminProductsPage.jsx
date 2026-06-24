import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, ExternalLink, ImageIcon, Loader, X } from 'lucide-react';
import Skeleton, { SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [subCrops, setSubCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [prodPreviews, setProdPreviews] = useState([]);
  const fileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const emptyForm = (cropSubId = '') => ({
    crop_sub_id: cropSubId,
    disease_name: '',
    product1_name: '', product1_url: '', product1_image: null,
    product2_name: '', product2_url: '', product2_image: null,
    product3_name: '', product3_url: '', product3_image: null,
    product4_name: '', product4_url: '', product4_image: null,
    fertilizers: '', pesticides: '', care_points: ''
  });

  const [form, setForm] = useState(emptyForm());

  const load = () => {
    setLoading(true);
    Promise.all([
      api.farming.cropWithProducts().then(setItems).catch(() => {}),
      api.farming.crops().then(setSubCrops).catch(() => {}),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const show = (msg) => { setFormSuccess(msg); setTimeout(() => setFormSuccess(''), 3000); };

  const handleDelete = async (productId) => {
    if (!productId || !confirm('Delete this product entry?')) return;
    try { await api.admin.deleteProduct(productId); show('Deleted'); load(); }
    catch (err) { setFormError(err.message); }
  };

  const handleProductFile = (i, e) => {
    const f = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, [`product${i}_image`]: f }));
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const next = [...prodPreviews];
        next[i - 1] = ev.target.result;
        setProdPreviews(next);
      };
      reader.readAsDataURL(f);
    }
  };

  const openAdd = () => {
    setShowAdd(true);
    setForm(emptyForm());
    setProdPreviews(['', '', '', '']);
    setFormError('');
  };

  const openEdit = (disease) => {
    setEditModal(disease);
    setProdPreviews([
      disease.products?.[0]?.product_image || '',
      disease.products?.[1]?.product_image || '',
      disease.products?.[2]?.product_image || '',
      disease.products?.[3]?.product_image || '',
    ]);
    setForm({
      crop_sub_id: '',
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

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('crop_sub_id', form.crop_sub_id);
    fd.append('disease_name', form.disease_name);
    fd.append('product1_name', form.product1_name);
    fd.append('product1_url', form.product1_url);
    if (form.product1_image) fd.append('product1_image', form.product1_image);
    fd.append('product2_name', form.product2_name);
    fd.append('product2_url', form.product2_url);
    if (form.product2_image) fd.append('product2_image', form.product2_image);
    fd.append('product3_name', form.product3_name);
    fd.append('product3_url', form.product3_url);
    if (form.product3_image) fd.append('product3_image', form.product3_image);
    fd.append('product4_name', form.product4_name);
    fd.append('product4_url', form.product4_url);
    if (form.product4_image) fd.append('product4_image', form.product4_image);
    fd.append('fertilizers', form.fertilizers);
    fd.append('pesticides', form.pesticides);
    fd.append('care_points', form.care_points);
    return fd;
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const fd = buildFormData();
      await api.admin.updateProduct(editModal.product_id, fd);
      show('Product updated');
      setEditModal(null);
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.crop_sub_id) { setFormError('Select a sub crop'); setFormLoading(false); return; }
    if (!form.product1_name || !form.product1_url) { setFormError('Product 1 name and URL are required'); return; }
    setFormLoading(true);
    try {
      const fd = buildFormData();
      await api.admin.addProduct(fd);
      show('Product added');
      setShowAdd(false);
      setForm(emptyForm());
      load();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const closeModal = () => { setEditModal(null); setShowAdd(false); };

  const Modal = ({ title, onSubmit }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto py-8" onClick={closeModal}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={closeModal} className="text-gray-600 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {!editModal && (
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Sub Crop</label>
              <select value={form.crop_sub_id} onChange={(e) => setForm((p) => ({ ...p, crop_sub_id: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs">
                <option value="">Select sub crop</option>
                {subCrops.map((s) => <option key={s.id} value={s.id}>{s.title} ({s.crop_name || ''})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Disease Name</label>
            <input value={form.disease_name} onChange={(e) => setForm((p) => ({ ...p, disease_name: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-emerald-200 dark:border-emerald-700 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Product {i}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input value={form[`product${i}_name`]} onChange={(e) => setForm((p) => ({ ...p, [`product${i}_name`]: e.target.value }))} placeholder="Name" className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" />
                <input value={form[`product${i}_url`]} onChange={(e) => setForm((p) => ({ ...p, [`product${i}_url`]: e.target.value }))} placeholder="URL" className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" />
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" ref={fileRefs[i - 1]} className="hidden" onChange={(e) => handleProductFile(i, e)} />
                  <button type="button" onClick={() => fileRefs[i - 1].current?.click()} className="px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-xs hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Image</button>
                  {prodPreviews[i - 1] && <img src={prodPreviews[i - 1]} alt="" className="w-8 h-8 rounded object-cover" />}
                </div>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Fertilizers</label><input value={form.fertilizers} onChange={(e) => setForm((p) => ({ ...p, fertilizers: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" /></div>
            <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Pesticides</label><input value={form.pesticides} onChange={(e) => setForm((p) => ({ ...p, pesticides: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" /></div>
            <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Care Points</label><input value={form.care_points} onChange={(e) => setForm((p) => ({ ...p, care_points: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-900 dark:text-white text-xs" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
              {formLoading ? <Loader size={14} className="animate-spin" /> : 'Save'}
            </button>
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Products (crop_products)</h2>
        <button onClick={openAdd} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

      {showAdd && <Modal title="Add Product" onSubmit={handleAdd} />}
      {editModal && <Modal title={`Edit Product #${editModal.product_id}`} onSubmit={handleSaveEdit} />}

      {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-44" />) : items.map((crop) => (
        <div key={crop.id} className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden">
          <div className="p-4 border-b border-emerald-200 dark:border-emerald-700 flex items-center gap-3">
            {crop.image_url && <img src={crop.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{crop.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{crop.crop_name}</p>
            </div>
          </div>
          {crop.products && crop.products.length > 0 ? crop.products.map((disease, di) => (
            <div key={di} className="border-b border-emerald-200/50 dark:border-emerald-700/50 last:border-0">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700/30 flex items-center justify-between">
                <p className="text-xs font-medium text-emerald-400">{disease.disease_name || 'General'}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(disease)} className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Edit2 size={11} /></button>
                  <button onClick={() => handleDelete(disease.product_id)} className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><Trash2 size={11} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
                {disease.products && disease.products.filter((p) => p.product_name).map((prod, pi) => (
                  <div key={pi} className="rounded-lg bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                    {prod.product_image ? (
                      <img src={prod.product_image} alt="" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700"><ImageIcon size={24} className="text-emerald-500" /></div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{prod.product_name}</p>
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
            <div className="p-4 text-center text-emerald-500 text-xs">No products for this sub crop</div>
          )}
        </div>
      ))}
      {!loading && items.length === 0 && <div className="p-6 text-center text-emerald-500 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">No products found</div>}
    </div>
  );
}
