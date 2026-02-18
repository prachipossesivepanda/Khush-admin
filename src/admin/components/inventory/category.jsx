import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ZoomIn } from "lucide-react";
import {
  getAllCategories,
  toggleCategoryActiveStatus,
  toggleCategoryNavbarStatus,
} from "../../apis/categoryapi";

export default function Categories() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories(currentPage, limit);
      const data = response?.data?.data || response?.data || {};
      
      const catArray =
        data.categories ||
        response?.data?.categories ||
        data ||
        [];

      const formatted = catArray.map((cat, idx) => ({
        id: cat._id || `temp-${idx}`,
        name: cat.name || "",
        description: cat.description || "",
        sortOrder: cat.sortOrder ?? 0,
        image: cat.imageUrl || "https://via.placeholder.com/150",
        isActive: cat.isActive ?? true,
        isNavbar: cat.isNavbar ?? false,
      }));

      setCategories(formatted);
      setTotalPages(data.totalPages || data.pages || Math.ceil((data.total || catArray.length) / limit) || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // TOGGLE ACTIVE / NAVBAR
  const handleToggleActive = async (category) => {
    const original = { ...category };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === category.id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );

    try {
      await toggleCategoryActiveStatus(category.id);
    } catch (err) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id ? { ...cat, isActive: original.isActive } : cat
        )
      );
      alert(err.response?.data?.message || "Failed to update active status");
    }
  };

  const handleToggleNavbar = async (category) => {
    const original = { ...category };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === category.id ? { ...cat, isNavbar: !cat.isNavbar } : cat
      )
    );

    try {
      await toggleCategoryNavbarStatus(category.id);
    } catch (err) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id ? { ...cat, isNavbar: original.isNavbar } : cat
        )
      );
      alert(err.response?.data?.message || "Failed to update navbar status");
    }
  };

  // EDIT - Navigate to edit page
  const handleEdit = (category) => {
    navigate(`/admin/inventory/categories/edit/${category.id}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/admin/inventory/subcategories/${categoryId}`);
  };
  
  // RENDER
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Categories
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
          <button
            onClick={() => navigate("/admin/inventory/categories/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 w-full sm:w-auto whitespace-nowrap"
          >
            <span>+</span> Add Category
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{error}</div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">#</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Image</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Name</th>
                    <th className="hidden md:table-cell px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Description</th>
                    <th className="hidden sm:table-cell px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Sort Order</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                    <th className="hidden lg:table-cell px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Navbar</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 sm:px-6 py-12 sm:py-16 text-center text-gray-500 text-sm">
                        Loading categories...
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 sm:px-6 py-12 sm:py-16 text-center text-gray-500 text-sm">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat, idx) => (
<tr
  key={cat.id}
  onClick={() => handleCategoryClick(cat.id)}
  className="group hover:bg-gray-50/70 transition-colors cursor-pointer"
>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{(currentPage - 1) * limit + idx + 1}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div 
                            className="relative group cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage({ url: cat.image, name: cat.name });
                            }}
                          >
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl object-cover ring-1 ring-gray-200 shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-200 pointer-events-none"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-lg sm:rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
                              <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                          <div className="max-w-[150px] sm:max-w-none truncate">{cat.name}</div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                          {cat.description || "—"}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">
                          {cat.sortOrder}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleActive(cat);
                            }}
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                              cat.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-3 sm:py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleNavbar(cat);
                            }}
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                              cat.isNavbar
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {cat.isNavbar ? "Shown" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm">
                        <button
  onClick={(e) => {
    e.stopPropagation();
    handleEdit(cat);
  }}
  className="font-medium text-black hover:text-gray-700 transition-colors"
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
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              Previous
            </button>
            <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>

            {/* Zoomed Image */}
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Name */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">{zoomedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
