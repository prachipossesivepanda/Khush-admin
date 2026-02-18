import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInfluencers,
  toggleInfluencerStatus,
} from "../../apis/Influencer";

const Influencer = () => {
  const navigate = useNavigate();

  const [influencers, setInfluencers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const res = await getInfluencers(page, limit, search, isActive);
      if (res?.success) {
        setInfluencers(res.data.influencers || []);
        setPagination(res.data.pagination || {});
      }
    } catch (err) {
      console.error("Fetch Influencers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [page, search, isActive]);

  const handleToggle = async (id) => {
    try {
      await toggleInfluencerStatus(id);
      fetchInfluencers();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Influencer Management
          </h1>
          <button
            onClick={() => navigate("/admin/influencer/create")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md"
          >
            + Create Influencer
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-4 py-2 rounded-lg flex-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="border px-4 py-2 rounded-lg"
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value === "true");
              setPage(1);
            }}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : influencers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No Influencers Found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">City</th>
                      <th className="p-4 text-left">Followers</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {influencers.map((item) => {
                      const totalFollowers =
                        item.digitalSources?.reduce(
                          (sum, src) => sum + (src.followers || 0),
                          0
                        ) || 0;

                      return (
                        <tr key={item._id} className="border hover:bg-gray-50">
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4">{item.email}</td>
                          <td className="p-4">{item.city}</td>
                          <td className="p-4">{totalFollowers}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                item.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-3">
                            <button
                              onClick={() =>
                                navigate(`/admin/influencer/edit/${item._id}`)
                              }
                              className="text-indigo-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggle(item._id)}
                              className="text-purple-600"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between p-4 border-t bg-gray-50">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page || 1} of{" "}
                  {pagination.totalPages || 1}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Influencer;
