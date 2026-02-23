import React, { useEffect, useState } from "react";
import {
  getDeliveryAgents,
  deleteDeliveryAgent,
  toggleDeliveryAgentStatus,
} from "../../apis/Driverapi";
import { useNavigate } from "react-router-dom";

const DeliveryAgent = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setPage(1);
    }
  }, [debouncedSearch]);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);

    console.log("→ Fetching delivery agents", { page, search: debouncedSearch, onlyActive: false });

    try {
      const res = await getDeliveryAgents(page, 10, debouncedSearch, false);

      const data = res?.data;
      console.log("← API response:", data);

      if (data?.success === true || Array.isArray(data?.deliveryAgents)) {
        // Handle both wrapped ({success, data}) and direct {deliveryAgents, pagination} formats
        const agentsData = data.success ? data.data?.deliveryAgents : data.deliveryAgents;
        const paginationData = data.success ? data.data?.pagination : data.pagination;

        const fetchedAgents = Array.isArray(agentsData) ? agentsData : [];
        const pagination = paginationData || {};

        setAgents(fetchedAgents);
        setTotalPages(pagination.totalPages || 1);

        console.log(`Loaded ${fetchedAgents.length} agents`);

        // Debug each agent's status
        fetchedAgents.forEach((agent) => {
          console.log(
            `→ ${agent.name || "Unnamed"} (${agent.phoneNumber || agent._id}): ` +
            `isActive = ${agent.isActive ?? "missing"}`
          );
        });

        if (fetchedAgents.length === 0) {
          setError("No agents found in this page / search");
        }
      } else {
        const reason = data?.message || "Unexpected response format";
        console.warn("Response issue:", reason, data);
        setError(reason);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to load agents";
      console.error("Fetch error:", err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await deleteDeliveryAgent(id);
      fetchAgents();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete agent");
    }
  };

  const handleToggle = async (id) => {
    try {
      console.log(`Toggling status for agent ${id}`);
      const res = await toggleDeliveryAgentStatus(id);
      console.log("Toggle response:", res?.data);
      fetchAgents();
    } catch (err) {
      console.error("Toggle failed:", err?.response?.data || err.message);
      alert("Failed to update agent status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Agents</h1>

        <button
          onClick={() => navigate("/admin/driver/create")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          + Add New Agent
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, phone or city..."
        className="border border-gray-300 p-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* States */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading agents...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No delivery agents found {search.trim() && `matching "${search.trim()}"`}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">City</th>
                  <th className="p-4 font-semibold">Bike Brand</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{agent.name || "—"}</td>
                    <td className="p-4">
                      {agent.countryCode || ""}{agent.phoneNumber || "—"}
                    </td>
                    <td className="p-4">{agent.city || "—"}</td>
                    <td className="p-4">{agent.bikeBrand || "—"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggle(agent._id)}
                        className={`px-4 py-1 rounded-full text-sm font-medium text-white transition ${
                          agent.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-center space-x-4">
                      <button
                        onClick={() => navigate(`/admin/driver/edit/${agent._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryAgent;