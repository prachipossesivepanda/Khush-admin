import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFilters,
  deleteFilter,
} from '../../apis/Filterapi';

import { Plus, Trash2, Edit } from 'lucide-react';

const FilterPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFilters({});

      if (response?.data?.filters && Array.isArray(response.data.filters)) {
        setFilters(response.data.filters);
      } else {
        setFilters([]);
      }
    } catch (err) {
      console.error('Fetch filters error:', err);
      setError('Failed to load filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this filter?')) return;

    try {
      setLoading(true);
      await deleteFilter(id);
      await fetchFilters();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete filter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Product Filters</h1>
            <button
              onClick={() => navigate("/admin/filters/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
            >
              <Plus size={18} />
              Add New Filter
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

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading filters...</div>
        ) : filters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 mb-4">No filters found</p>
            <button
              onClick={() => navigate("/admin/filters/create")}
              className="text-black hover:underline font-medium"
            >
              Create your first filter →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Key</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Label</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Values</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filters.map((filter) => (
                    <tr key={filter._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{filter.key}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{filter.label}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {filter.description || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {filter.values?.length || 0} values
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            filter.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {filter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/filters/edit/${filter._id}`)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(filter._id)}
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

export default FilterPage;