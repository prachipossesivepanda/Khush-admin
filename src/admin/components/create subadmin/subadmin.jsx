// src/components/SubAdmin.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubAdmins, toggleSubAdminStatus } from "../../apis/subadminapi";

const SubAdmin = () => {
  console.log("🚀 SubAdmin Component Rendered");

  const navigate = useNavigate();

  const [subAdmins, setSubAdmins] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(true);

  console.log("📌 Current State:");
  console.log("SubAdmins:", subAdmins);
  console.log("Pagination:", pagination);
  console.log("Page:", page);
  console.log("Search:", search);
  console.log("Status Filter:", isActive);

  const fetchSubAdmins = async () => {
    console.log("🔄 Fetching SubAdmins...");
    console.log("Sending Params:", {
      page,
      limit,
      search,
      isActive,
    });

    setLoading(true);

    try {
      const res = await getSubAdmins(page, limit, search, isActive);

      console.log("✅ API Response:", res);

      if (res?.success) {
        console.log("📦 SubAdmin Data:", res.data.subadmins);
        console.log("📄 Pagination Data:", res.data.pagination);

        setSubAdmins(res.data.subadmins || []);
        setPagination(res.data.pagination || {});
      } else {
        console.warn("⚠️ API Success False:", res);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      console.log("🛑 Fetch Finished");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📌 useEffect Triggered");
    fetchSubAdmins();
  }, [page, search, isActive]);

  const handleCreate = () => {
    console.log("➕ Navigating to Create Page");
    navigate("/subadmin/create");
  };

  const handleEdit = (id) => {
    console.log("✏️ Edit Clicked:", id);
    navigate(`/subadmin/edit/${id}`);
  };

  const handleToggle = async (id) => {
    console.log("🔄 Toggling Status for:", id);

    try {
      const res = await toggleSubAdminStatus(id);
      console.log("✅ Toggle Response:", res);
      fetchSubAdmins();
    } catch (err) {
      console.error("❌ Toggle Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Sub-Admin Management</h1>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            + Create
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 mb-4 flex gap-4 rounded shadow">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              console.log("🔍 Search Changed:", e.target.value);
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded flex-1"
          />

          <select
            value={isActive}
            onChange={(e) => {
              console.log("📌 Status Changed:", e.target.value);
              setIsActive(e.target.value === "true");
              setPage(1);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow border">

          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : subAdmins.length === 0 ? (
            <div className="p-8 text-center text-red-500">
              ❌ No sub-admins found
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">City</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subAdmins.map((item) => {
                    console.log("🧾 Rendering Row:", item);

                    return (
                      <tr key={item._id} className="border-t">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.email}</td>
                        <td className="p-3">
                          {item.countryCode} {item.phoneNumber}
                        </td>
                        <td className="p-3">{item.city}</td>
                        <td className="p-3">
                          {item.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-3 text-center space-x-3">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggle(item._id)}
                            className="text-purple-600"
                          >
                            {item.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between p-4 border-t">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    console.log("⬅️ Previous Clicked");
                    setPage(page - 1);
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Previous
                </button>

                <span>
                  Page {pagination.page || 1} of {pagination.totalPages || 1}
                </span>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => {
                    console.log("➡️ Next Clicked");
                    setPage(page + 1);
                  }}
                  className="border px-4 py-2 rounded"
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

export default SubAdmin;
