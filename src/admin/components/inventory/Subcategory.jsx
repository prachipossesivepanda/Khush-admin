// src/admin/components/Subcategories/Subcategories.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSubcategoriesByCategory,
  toggleSubcategoryActiveStatus,
  toggleSubcategoryNavbarStatus,
} from "../../apis/subcategoryapis";

export default function Subcategories() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!categoryId) {
      setError("Category ID is missing from URL");
      setLoading(false);
      return;
    }
    fetchSubcategories(1);
  }, [categoryId]);

  const fetchSubcategories = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSubcategoriesByCategory(categoryId, page, limit);
      const data = res.data?.data || res.data || {};
      const subs = data.subcategories || data.subCategories || data || [];
      const pag = data.pagination || null;

      // Ensure navbar field is properly mapped
      const formattedSubs = subs.map((sub) => ({
        ...sub,
        isNavbar: sub.isNavbar ?? sub.showInNavbar ?? false,
      }));

      setSubcategories(formattedSubs);
      setPagination(pag);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load subcategories."
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = subcategories.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const openCreate = () => {
    navigate(`/admin/inventory/subcategories/${categoryId}/create`);
  };

  const openEdit = (sub) => {
    navigate(`/admin/inventory/subcategories/${categoryId}/edit/${sub._id}`);
  };

  const toggleActive = async (id) => {
    try {
      await toggleSubcategoryActiveStatus(id);
      setSubcategories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err) {
      alert("Failed to toggle active status");
    }
  };

  const toggleNavbar = async (id) => {
    try {
      await toggleSubcategoryNavbarStatus(id);
      setSubcategories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isNavbar: !(s.isNavbar ?? s.showInNavbar ?? false) } : s))
      );
    } catch (err) {
      alert("Failed to toggle navbar visibility");
    }
  };


  // Render
  return (
    <div className="w-full min-h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black tracking-tight">
            Subcategories
          </h1>
        </div>
      </header>

      <main className="px-4 sm:px-5 lg:px-6 py-4 sm:py-6 bg-white">
        {/* Controls */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate("/admin/inventory/categories")}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-black text-black rounded-lg sm:rounded-xl hover:bg-black hover:text-white transition flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base font-medium"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border-2 border-black rounded-lg sm:rounded-xl shadow-sm focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none text-black placeholder-gray-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={openCreate}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-black hover:bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <span className="text-base sm:text-lg leading-none">+</span>
              New Subcategory
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border-2 border-black rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider">#</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">Order</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider">Image</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-center text-xs font-bold text-white uppercase tracking-wider">Active</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-center text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Navbar</th>
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-gray-500 italic">
                      {searchTerm ? "No matching subcategories..." : "No subcategories yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((sub, i) => (
                    <tr key={sub._id} className="group hover:bg-gray-100 transition-colors duration-150 border-b border-gray-200">
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-black font-medium">{i + 1}</td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-black hidden sm:table-cell">{sub.sortOrder || "—"}</td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          {sub.imageUrl ? (
                            <img
                              src={sub.imageUrl}
                              alt={sub.name}
                              className="h-full w-full object-cover"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/44?text=?")}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-[8px] sm:text-[10px]">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <div
                          onClick={() => navigate(`/admin/inventory/items/${categoryId}/${sub._id}`)}
                          className="font-medium text-xs sm:text-sm text-black cursor-pointer group-hover:text-gray-700 transition-colors underline-offset-2 hover:underline"
                        >
                          {sub.name}
                        </div>
                        <div className="text-xs text-gray-600 lg:hidden mt-1 line-clamp-2">
                          {sub.description || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-black hidden lg:table-cell max-w-md line-clamp-2">
                        {sub.description || <span className="text-gray-500">—</span>}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center">
                        <button
                          onClick={() => toggleActive(sub._id)}
                          className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-colors ${
                            sub.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center hidden md:table-cell">
                        <button
                          onClick={() => toggleNavbar(sub._id)}
                          className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-colors ${
                            (sub.isNavbar ?? sub.showInNavbar ?? false)
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {(sub.isNavbar ?? sub.showInNavbar ?? false) ? "Shown" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-right text-xs sm:text-sm">
                        <button
                          onClick={() => openEdit(sub)}
                          className="text-black hover:text-gray-700 font-semibold transition underline-offset-2 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {(pagination || subcategories.length > 0) && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
            {/* Showing info */}
            <div className="text-sm text-black font-medium">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Showing <span className="font-bold">{filtered.length}</span> of{" "}
                  <span className="font-bold">{pagination?.total || subcategories.length}</span>{" "}
                  subcategories
                </>
              )}
            </div>

            {/* Pagination controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => fetchSubcategories(pagination.page - 1)}
                  className="px-4 py-2 bg-white border-2 border-black rounded-lg shadow-sm disabled:opacity-50 hover:bg-black hover:text-white transition text-sm font-semibold disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                >
                  ← Previous
                </button>

                <span className="px-3 py-2 text-black font-bold text-sm min-w-[100px] text-center bg-gray-100 rounded-lg">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  disabled={pagination.page >= pagination.pages || loading}
                  onClick={() => fetchSubcategories(pagination.page + 1)}
                  className="px-4 py-2 bg-white border-2 border-black rounded-lg shadow-sm disabled:opacity-50 hover:bg-black hover:text-white transition text-sm font-semibold disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}
