import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCartCharges,
  deleteCartCharges,
  toggleCartChargeStatus,
} from '../../apis/Cartapi';

import { Plus, Trash2, Edit, Power } from 'lucide-react';

const CartChargesPage = () => {
  const navigate = useNavigate();
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCartCharges();

      // Debug: always log the full response for now
      console.log('API Response:', response);

      // Extract the actual array — most common patterns
      const chargesArray =
        response?.data?.data?.data ||    // your current structure
        response?.data?.data ||          // sometimes it's data.data
        response?.data?.charges ||       // fallback
        [];

      if (Array.isArray(chargesArray)) {
        setCharges(chargesArray);
      } else {
        setCharges([]);
        console.warn('No array found in response:', response?.data);
      }
    } catch (err) {
      console.error('Fetch cart charges error:', err);
      setError(err.response?.data?.message || 'Failed to load cart charges');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cart charge configuration?')) return;

    try {
      setLoading(true);
      await deleteCartCharges(id);
      await fetchCharges();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete cart charge');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await toggleCartChargeStatus(id);
      await fetchCharges();
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Helper to show short summary of charges
  const getChargeSummary = (cartCharge) => {
    if (!Array.isArray(cartCharge) || cartCharge.length === 0) return '—';
    return cartCharge.map(c => c.key).join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Cart Charges Configurations</h1>
            <button
              onClick={() => navigate("/admin/cart-charges/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
            >
              <Plus size={18} />
              Add New Configuration
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading cart charges...</div>
        ) : charges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 mb-4">No cart charges configurations found</p>
            <button
              onClick={() => navigate("/admin/cart-charges/create")}
              className="text-black hover:underline font-medium"
            >
              Create your first configuration →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Charges</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {charges.map((charge) => (
                    <tr key={charge._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-600 text-sm">
                        {charge._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {getChargeSummary(charge.cartCharge)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            charge.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {charge.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(charge.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/cart-charges/edit/${charge._id}`)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(charge._id)}
                            className={`p-2 rounded-lg transition ${
                              charge.isActive
                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title={charge.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Power size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(charge._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartChargesPage;