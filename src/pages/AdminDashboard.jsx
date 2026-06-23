import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Leaf, Sprout, ShoppingBag, CreditCard,
  Menu, X, LogOut, Plus, Edit2, Trash2, Loader, AlertCircle, CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'agri-titles', label: 'Agri Titles', icon: Leaf },
  { id: 'crops', label: 'Crops', icon: Sprout },
  { id: 'sub-crops', label: 'Sub Crops', icon: Sprout },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'orders', label: 'Orders', icon: CreditCard },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [agriTitles, setAgriTitles] = useState([]);
  const [crops, setCrops] = useState([]);
  const [subCrops, setSubCrops] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fileRef = useRef(null);

  const [editAgri, setEditAgri] = useState(null);
  const [agriForm, setAgriForm] = useState({ title: '', image: null });
  const [editCrop, setEditCrop] = useState(null);
  const [cropForm, setCropForm] = useState({ title: '', agri_id: '', image: null });
  const [editSub, setEditSub] = useState(null);
  const [subForm, setSubForm] = useState({ title: '', crop_id: '', image: null });
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    crop_sub_id: '', disease_name: '',
    product1_name: '', product1_url: '', product1_image: null,
    product2_name: '', product2_url: '', product2_image: null,
    product3_name: '', product3_url: '', product3_image: null,
    product4_name: '', product4_url: '', product4_image: null,
    fertilizers: '', pesticides: '', care_points: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return; }
    api.admin.verify().then(() => {
      setValid(true);
      setLoading(false);
      loadAll();
    }).catch(() => {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    });
  }, []);

  const loadAll = async () => {
    try {
      const [u, p, a, c, s, pr] = await Promise.all([
        api.admin.getUsers().catch(() => []),
        api.admin.getPayments().catch(() => []),
        api.farming.agriTitles().catch(() => []),
        api.farming.allCrops().catch(() => []),
        api.farming.crops().catch(() => []),
        api.farming.cropWithProducts().catch(() => []),
      ]);
      setUsers(u);
      setPayments(p);
      setAgriTitles(a);
      setCrops(c);
      setSubCrops(s);
      setProducts(pr);
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const showSuccess = (msg) => {
    setFormSuccess(msg);
    setTimeout(() => setFormSuccess(''), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Loader size={32} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!valid) return null;

  const inputClass = "w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-gray-500 text-sm";

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur border-r border-gray-700 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
          <hr className="my-3 border-gray-700" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all cursor-pointer">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 lg:hidden bg-gray-800/80 backdrop-blur border-b border-gray-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-700 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-white">Admin</span>
        </div>

        <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
          {formSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800">
              <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-400">{formSuccess}</p>
            </div>
          )}
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{formError}</p>
            </div>
          )}

          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Dashboard Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-5">
                  <Users className="w-6 h-6 text-emerald-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-gray-400">Total Users</p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-5">
                  <CreditCard className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{payments.length}</p>
                  <p className="text-xs text-gray-400">Total Orders</p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-5">
                  <Leaf className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{agriTitles.length}</p>
                  <p className="text-xs text-gray-400">Agri Titles</p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-5">
                  <ShoppingBag className="w-6 h-6 text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                  <p className="text-xs text-gray-400">Products</p>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Users</h2>
              <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left">
                      <th className="p-3 font-medium">User ID</th>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Phone</th>
                      <th className="p-3 font-medium">Coins</th>
                      <th className="p-3 font-medium">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                        <td className="p-3 font-mono text-xs">{u.user_id}</td>
                        <td className="p-3">{u.name || '-'}</td>
                        <td className="p-3">{u.email || '-'}</td>
                        <td className="p-3">{u.phone || '-'}</td>
                        <td className="p-3">{u.coins}</td>
                        <td className="p-3">{u.is_verified ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span>}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={6} className="p-6 text-center text-gray-500">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Agri Titles Tab */}
          {tab === 'agri-titles' && (
            <AgriTitlesSection
              agriTitles={agriTitles}
              editAgri={editAgri} setEditAgri={setEditAgri}
              agriForm={agriForm} setAgriForm={setAgriForm}
              formLoading={formLoading} setFormLoading={setFormLoading}
              fileRef={fileRef}
              showSuccess={showSuccess} setFormError={setFormError}
              loadAll={loadAll}
              inputClass={inputClass}
            />
          )}

          {/* Crops Tab */}
          {tab === 'crops' && (
            <CropsSection
              crops={crops} agriTitles={agriTitles}
              editCrop={editCrop} setEditCrop={setEditCrop}
              cropForm={cropForm} setCropForm={setCropForm}
              formLoading={formLoading} setFormLoading={setFormLoading}
              fileRef={fileRef}
              showSuccess={showSuccess} setFormError={setFormError}
              loadAll={loadAll}
              inputClass={inputClass}
            />
          )}

          {/* Sub Crops Tab */}
          {tab === 'sub-crops' && (
            <SubCropsSection
              subCrops={subCrops} crops={crops}
              editSub={editSub} setEditSub={setEditSub}
              subForm={subForm} setSubForm={setSubForm}
              formLoading={formLoading} setFormLoading={setFormLoading}
              fileRef={fileRef}
              showSuccess={showSuccess} setFormError={setFormError}
              loadAll={loadAll}
              inputClass={inputClass}
            />
          )}

          {/* Products Tab */}
          {tab === 'products' && (
            <ProductsSection
              products={products} subCrops={subCrops}
              editProduct={editProduct} setEditProduct={setEditProduct}
              productForm={productForm} setProductForm={setProductForm}
              formLoading={formLoading} setFormLoading={setFormLoading}
              fileRef={fileRef}
              showSuccess={showSuccess} setFormError={setFormError}
              loadAll={loadAll}
              inputClass={inputClass}
            />
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Payment Orders</h2>
              <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left">
                      <th className="p-3 font-medium">ID</th>
                      <th className="p-3 font-medium">User ID</th>
                      <th className="p-3 font-medium">Order ID</th>
                      <th className="p-3 font-medium">Amount</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                        <td className="p-3">{p.id}</td>
                        <td className="p-3 font-mono text-xs">{p.user_id}</td>
                        <td className="p-3 font-mono text-xs">{p.order_id}</td>
                        <td className="p-3">₹{p.amount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === 'success' ? 'bg-emerald-900/50 text-emerald-400' : p.status?.startsWith('plan_') ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{p.created_at || '-'}</td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr><td colSpan={6} className="p-6 text-center text-gray-500">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============== Agri Titles Section ============== */
function AgriTitlesSection({ agriTitles, editAgri, setEditAgri, agriForm, setAgriForm, formLoading, setFormLoading, fileRef, showSuccess, setFormError, loadAll, inputClass }) {
  const resetForm = () => { setEditAgri(null); setAgriForm({ title: '', image: null }); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!agriForm.title.trim()) { setFormError('Title is required'); return; }
    setFormLoading(true);
    try {
      if (editAgri) {
        await api.admin.updateAgriTitle(editAgri.id, agriForm.title, agriForm.image);
      } else {
        if (!agriForm.image) { setFormError('Image is required'); setFormLoading(false); return; }
        await api.admin.addAgriTitle(agriForm.title, agriForm.image);
      }
      showSuccess(editAgri ? 'Title updated' : 'Title added');
      resetForm();
      loadAll();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this agri title?')) return;
    try {
      await api.admin.deleteAgriTitle(id);
      showSuccess('Title deleted');
      loadAll();
    } catch (err) { setFormError(err.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Agri Titles</h2>
      <form onSubmit={handleSave} className="rounded-xl bg-gray-800/80 border border-gray-700 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            value={agriForm.title} onChange={(e) => setAgriForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title name" className={inputClass}
          />
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={(e) => setAgriForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
            {agriForm.image ? agriForm.image.name : 'Image'}
          </button>
          <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
            {formLoading ? <Loader size={14} className="animate-spin" /> : editAgri ? 'Update' : 'Add'}
          </button>
          {editAgri && <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>}
        </div>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {agriTitles.map((a) => (
          <div key={a.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden group">
            {a.image_url && <img src={a.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm text-white truncate">{a.title}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditAgri(a); setAgriForm({ title: a.title, image: null }); }} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== Crops Section ============== */
function CropsSection({ crops, agriTitles, editCrop, setEditCrop, cropForm, setCropForm, formLoading, setFormLoading, fileRef, showSuccess, setFormError, loadAll, inputClass }) {
  const resetForm = () => { setEditCrop(null); setCropForm({ title: '', agri_id: '', image: null }); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!cropForm.title.trim() || !cropForm.agri_id) { setFormError('Title and Agri Title are required'); return; }
    setFormLoading(true);
    try {
      if (editCrop) {
        await api.admin.updateCrop(editCrop.id, cropForm.title, cropForm.agri_id, cropForm.image);
      } else {
        if (!cropForm.image) { setFormError('Image is required'); setFormLoading(false); return; }
        await api.admin.addCrop(cropForm.title, cropForm.agri_id, cropForm.image);
      }
      showSuccess(editCrop ? 'Crop updated' : 'Crop added');
      resetForm(); loadAll();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop?')) return;
    try { await api.admin.deleteCrop(id); showSuccess('Crop deleted'); loadAll(); }
    catch (err) { setFormError(err.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Crops</h2>
      <form onSubmit={handleSave} className="rounded-xl bg-gray-800/80 border border-gray-700 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input value={cropForm.title} onChange={(e) => setCropForm((p) => ({ ...p, title: e.target.value }))} placeholder="Crop name" className={`${inputClass} w-48`} />
          <select value={cropForm.agri_id} onChange={(e) => setCropForm((p) => ({ ...p, agri_id: e.target.value }))} className={`${inputClass} w-40`}>
            <option value="">Select Agri Title</option>
            {agriTitles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
          <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={(e) => setCropForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
            {cropForm.image ? cropForm.image.name : 'Image'}
          </button>
          <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
            {formLoading ? <Loader size={14} className="animate-spin" /> : editCrop ? 'Update' : 'Add'}
          </button>
          {editCrop && <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>}
        </div>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {crops.map((c) => (
          <div key={c.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden group">
            {c.image_url && <img src={c.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{c.title}</p>
              <p className="text-xs text-gray-400 truncate">{c.agri_title || ''}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => { setEditCrop(c); setCropForm({ title: c.title, agri_id: c.agri_id || '', image: null }); }} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== Sub Crops Section ============== */
function SubCropsSection({ subCrops, crops, editSub, setEditSub, subForm, setSubForm, formLoading, setFormLoading, fileRef, showSuccess, setFormError, loadAll, inputClass }) {
  const resetForm = () => { setEditSub(null); setSubForm({ title: '', crop_id: '', image: null }); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!subForm.title.trim() || !subForm.crop_id) { setFormError('Title and Crop are required'); return; }
    setFormLoading(true);
    try {
      if (editSub) {
        await api.admin.updateSubCrop(editSub.id, subForm.crop_id, subForm.title, subForm.image);
      } else {
        if (!subForm.image) { setFormError('Image is required'); setFormLoading(false); return; }
        await api.admin.addSubCrop(subForm.crop_id, subForm.title, subForm.image);
      }
      showSuccess(editSub ? 'Sub crop updated' : 'Sub crop added');
      resetForm(); loadAll();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sub crop?')) return;
    try { await api.admin.deleteSubCrop(id); showSuccess('Sub crop deleted'); loadAll(); }
    catch (err) { setFormError(err.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Sub Crops</h2>
      <form onSubmit={handleSave} className="rounded-xl bg-gray-800/80 border border-gray-700 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input value={subForm.title} onChange={(e) => setSubForm((p) => ({ ...p, title: e.target.value }))} placeholder="Sub crop name" className={`${inputClass} w-48`} />
          <select value={subForm.crop_id} onChange={(e) => setSubForm((p) => ({ ...p, crop_id: e.target.value }))} className={`${inputClass} w-40`}>
            <option value="">Select Crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={(e) => setSubForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 cursor-pointer">
            {subForm.image ? subForm.image.name : 'Image'}
          </button>
          <button type="submit" disabled={formLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
            {formLoading ? <Loader size={14} className="animate-spin" /> : editSub ? 'Update' : 'Add'}
          </button>
          {editSub && <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 cursor-pointer">Cancel</button>}
        </div>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {subCrops.map((s) => (
          <div key={s.id} className="rounded-xl bg-gray-800/80 border border-gray-700 overflow-hidden group">
            {s.image_url && <img src={s.image_url} alt="" className="w-full h-28 object-cover" />}
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{s.title}</p>
              <p className="text-xs text-gray-400 truncate">{s.crop_name || ''}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => { setEditSub(s); setSubForm({ title: s.title, crop_id: s.crop_id || '', image: null }); }} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== Products Section ============== */
function ProductsSection({ products, subCrops, editProduct, setEditProduct, productForm, setProductForm, formLoading, setFormLoading, fileRef, showSuccess, setFormError, loadAll, inputClass }) {
  const resetForm = () => {
    setEditProduct(null);
    setProductForm({
      crop_sub_id: '', disease_name: '',
      product1_name: '', product1_url: '', product1_image: null,
      product2_name: '', product2_url: '', product2_image: null,
      product3_name: '', product3_url: '', product3_image: null,
      product4_name: '', product4_url: '', product4_image: null,
      fertilizers: '', pesticides: '', care_points: ''
    });
  };

  const handleEdit = (item) => {
    setEditProduct(item);
    setProductForm({
      crop_sub_id: item.id.toString(),
      disease_name: '',
      product1_name: item.product1_name || '', product1_url: item.product1_url || '', product1_image: null,
      product2_name: item.product2_name || '', product2_url: item.product2_url || '', product2_image: null,
      product3_name: item.product3_name || '', product3_url: item.product3_url || '', product3_image: null,
      product4_name: item.product4_name || '', product4_url: item.product4_url || '', product4_image: null,
      fertilizers: item.fertilizers || '', pesticides: item.pesticides || '', care_points: item.care_points || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.admin.deleteProduct(id); showSuccess('Product deleted'); loadAll(); }
    catch (err) { setFormError(err.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Products (crop_products)</h2>
      <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Sub Crop</th>
              <th className="p-3 font-medium">Product 1</th>
              <th className="p-3 font-medium">Product 2</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.title || item.crop_name || '-'}</td>
                <td className="p-3">{item.product1_name || '-'}</td>
                <td className="p-3">{item.product2_name || '-'}</td>
                <td className="p-3 flex gap-1">
                  <button onClick={() => handleEdit(item)} className="p-1.5 rounded bg-gray-700 text-blue-400 hover:bg-gray-600 cursor-pointer"><Edit2 size={12} /></button>
                  <button onClick={() => handleDelete(item.product_id || item.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
