// src/pages/admin/DeliveryAgents.jsx
import React, { useState, useEffect } from 'react';
import { 
  getDeliveryAgents, 
  deleteDeliveryAgent, 
  toggleDeliveryAgentStatus 
} from '../../apis/Driverapi'; // adjust path
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // assuming you use react-toastify
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  PowerIcon 
} from '@heroicons/react/24/outline';

const DeliveryAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(true);

  const navigate = useNavigate();

const fetchAgents = async () => {
  setLoading(true);
  try {
    const response = await getDeliveryAgents(page, limit, search, activeFilter);
    
    // ─────────────── Debug prints ───────────────
    console.log("Full response:", response);
    console.log("response.data:", response?.data);
    console.log("response.data.deliveryAgents:", response?.data?.deliveryAgents);
    console.log("Number of agents:", response?.data?.deliveryAgents?.length ?? 0);

    setAgents(response?.data?.deliveryAgents || []);
    setTotalPages(response?.data?.pagination?.totalPages || 1);

  } catch (error) {
    console.error("Fetch error:", error);
    toast.error('Failed to load delivery agents');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAgents();
  }, [page, search, activeFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    
    try {
      await deleteDeliveryAgent(id);
      toast.success('Delivery agent deleted');
      fetchAgents();
    } catch (err) {
      toast.error('Failed to delete agent');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleDeliveryAgentStatus(id);
      toast.success('Status updated');
      fetchAgents();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Delivery Agents</h1>
        
        <button
          onClick={() => navigate('/admin/driver/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Agent
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, phone, email..."
          value={search}
          onChange={handleSearch}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        
        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value === 'true'); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="true">Active Only</option>
          <option value="false">All (Active + Inactive)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : agents.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No delivery agents found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{agent.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{agent.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{agent.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{agent.bikeNumber || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          agent.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/driver/edit/${agent._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(agent._id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title={agent.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <PowerIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryAgents;