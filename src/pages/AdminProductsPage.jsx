import { useState, useEffect } from 'react';
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react';
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
      <h2 className="text-lg font-bold text-white">Products</h2>

      {formSuccess && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800"><CheckCircle size={14} className="text-emerald-400" /><p className="text-xs text-emerald-400">{formSuccess}</p></div>}
      {formError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800"><AlertCircle size={14} className="text-red-400" /><p className="text-xs text-red-400">{formError}</p></div>}

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
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.title || item.crop_name || '-'}</td>
                <td className="p-3">{item.product1_name || '-'}</td>
                <td className="p-3">{item.product2_name || '-'}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(item.product_id || item.id)} className="p-1.5 rounded bg-gray-700 text-red-400 hover:bg-gray-600 cursor-pointer"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500">No products found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
