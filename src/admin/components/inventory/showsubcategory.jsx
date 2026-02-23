import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCategories,
} from "../../apis/categoryapi";
import {
  getSubcategoriesByCategory,
  getAllSubcategories,          // ← newly integrated
  toggleSubcategoryActiveStatus,
  toggleSubcategoryNavbarStatus,
} from "../../apis/subcategoryapis";
import { ChevronDown, Edit, Plus, Search, ZoomIn, X } from "lucide-react";

const Showsubcategory = () => {
  const navigate = useNavigate();
  const categoryDropdownRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // empty = all
  const [subcategories, setSubcategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Category dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [debouncedCategorySearchTerm, setDebouncedCategorySearchTerm] = useState("");
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [categoryPagination, setCategoryPagination] = useState(null);
  const [allCategories, setAllCategories] = useState([]); // Store all categories for filtering
  const [categoryLimit] = useState(10); // Items per page in dropdown

  // Debounce category search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategorySearchTerm(categorySearchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [categorySearchTerm]);

  // Reset to page 1 when category search changes
  useEffect(() => {
    if (debouncedCategorySearchTerm !== categorySearchTerm) {
      setCategoryCurrentPage(1);
    }
  }, [debouncedCategorySearchTerm]);

  // Fetch categories with pagination and search
  useEffect(() => {
    fetchCategories(categoryCurrentPage);
  }, [categoryCurrentPage, debouncedCategorySearchTerm]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Fetch subcategories (all or by category) when needed
  useEffect(() => {
    setCurrentPage(1);
    fetchSubcategories(1);
  }, [selectedCategoryId]);

  // Re-fetch when page or search term changes
  useEffect(() => {
    if (currentPage > 0) {
      fetchSubcategories(currentPage);
    }
  }, [currentPage, debouncedSearchTerm]);

  // Reset search when category changes
  useEffect(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, [selectedCategoryId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
        setCategorySearchTerm("");
        setDebouncedCategorySearchTerm("");
        setCategoryCurrentPage(1);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const fetchCategories = async (page = 1) => {
    try {
      setLoadingCategories(true);
      // Pass search term to backend API
      const res = await getAllCategories(page, categoryLimit, debouncedCategorySearchTerm);
      const data = res?.data?.data || res?.data || {};
      const categoryList = data.categories || data || [];
      const pag = data.pagination || null;

      if (page === 1 || debouncedCategorySearchTerm) {
        // First page or searching - replace (backend handles search)
        setAllCategories(categoryList);
      } else {
        // Subsequent pages - append (for bulk data handling when not searching)
        setAllCategories((prev) => [...prev, ...categoryList]);
      }

      // Calculate pagination with fallback values
      if (pag) {
        const totalPages = pag.pages || pag.totalPages || (pag.total ? Math.ceil(pag.total / categoryLimit) : 1);
        setCategoryPagination({
          ...pag,
          pages: totalPages,
          total: pag.total || categoryList.length,
        });
      } else {
        // If no pagination from API, calculate from data
        const total = categoryList.length;
        setCategoryPagination({
          pages: Math.ceil(total / categoryLimit) || 1,
          total: total,
          currentPage: page,
        });
      }
    } catch (err) {
      console.error("Failed to load categories", err);
      setError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Update displayed categories - backend handles search, we just show the results
  useEffect(() => {
    if (allCategories.length === 0) {
      setCategories([]);
      return;
    }

    // Backend already filtered the results, so we show them directly
    // If searching, show all results from backend
    // If not searching, show paginated results
    if (!debouncedCategorySearchTerm.trim()) {
      // No search - show paginated results from loaded categories
      const startIndex = (categoryCurrentPage - 1) * categoryLimit;
      const endIndex = startIndex + categoryLimit;
      setCategories(allCategories.slice(startIndex, endIndex));
    } else {
      // Search - backend already filtered, show all results
      setCategories(allCategories);
    }
  }, [debouncedCategorySearchTerm, categoryCurrentPage, allCategories, categoryLimit]);

  // Load more categories if needed (for bulk data)
  const loadMoreCategories = async () => {
    const totalPages = categoryPagination?.pages || 
                      (categoryPagination?.total ? Math.ceil(categoryPagination.total / categoryLimit) : 1) ||
                      1;
    if (categoryPagination && categoryCurrentPage < totalPages) {
      setCategoryCurrentPage((prev) => prev + 1);
    }
  };

  const fetchSubcategories = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      let res;
      if (selectedCategoryId) {
        // By specific category - pass search term to backend
        res = await getSubcategoriesByCategory(selectedCategoryId, page, limit, debouncedSearchTerm);
      } else {
        // All subcategories (default view) - pass search term to backend
        res = await getAllSubcategories(page, limit, debouncedSearchTerm);
      }

      const data = res.data?.data || res.data || {};
      const subs = data.subcategories || data.subCategories || data || [];
      const pag = data.pagination || null;

      // Normalize isNavbar field and preserve categoryId
      const formattedSubs = Array.isArray(subs)
        ? subs.map((sub) => ({
            ...sub,
            isNavbar: sub.isNavbar ?? sub.showInNavbar ?? false,
            // Preserve categoryId in various possible formats
            categoryId: sub.categoryId || sub.parentCategory || sub.category?._id || sub.category?.id || (typeof sub.category === 'string' ? sub.category : null),
          }))
        : [];

      setSubcategories(formattedSubs);

      // Set pagination
      if (pag) {
        setPagination(pag);
      } else {
        const total = data.total || formattedSubs.length;
        setPagination({
          pages: Math.ceil(total / limit) || 1,
          total,
          currentPage: page,
        });
      }
    } catch (err) {
      console.error("Fetch subcategories error:", err);
      setError(err.response?.data?.message || "Failed to load subcategories.");
      setSubcategories([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsCategoryDropdownOpen(false);
    setCategorySearchTerm("");
    setDebouncedCategorySearchTerm("");
    setCategoryCurrentPage(1);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return "All Subcategories";
    const selected = allCategories.find((cat) => cat._id === selectedCategoryId);
    return selected?.name || selected?.title || "Unknown Category";
  };

  // Search is now handled by backend, so we use subcategories directly
  const isSearching = debouncedSearchTerm.trim().length > 0;
  const displayData = subcategories; // Backend already filtered the results

  const openCreate = () => {
    if (!selectedCategoryId) {
      alert("Please select a category first to create a subcategory under it.");
      return;
    }
    navigate(`/admin/inventory/subcategories/${selectedCategoryId}/create`);
  };

  const openEdit = (sub) => {
    // Get categoryId from subcategory object in multiple possible formats
    let categoryId = 
      sub.categoryId || 
      sub.parentCategory || 
      sub.category?._id || 
      sub.category?.id ||
      (typeof sub.category === 'string' ? sub.category : null) ||
      selectedCategoryId;
    
    // If still no categoryId and we have selectedCategoryId, use it
    // Otherwise, show error asking user to select category
    if (!categoryId) {
      alert("Please select a category from the dropdown first to edit this subcategory.");
      return;
    }
    
    navigate(`/admin/inventory/subcategories/${categoryId}/edit/${sub._id}`);
  };

  const toggleActive = async (id) => {
    try {
      await toggleSubcategoryActiveStatus(id);
      setSubcategories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle active status");
      fetchSubcategories(currentPage);
    }
  };

  const toggleNavbar = async (id) => {
    try {
      await toggleSubcategoryNavbarStatus(id);
      setSubcategories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isNavbar: !s.isNavbar } : s))
      );
    } catch (err) {
      console.error("Toggle navbar error:", err);
      setError("Failed to toggle navbar visibility");
      fetchSubcategories(currentPage);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Subcategories
          </h1>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 bg-gray-50/50">
        {/* Category Dropdown + Search + Add Button */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Filter by Category
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                disabled={loadingCategories}
                className="w-full px-4 py-2.5 text-sm bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="truncate">
                  {loadingCategories ? "Loading..." : getSelectedCategoryName()}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 flex flex-col">
                  {/* Search Bar */}
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearchTerm}
                        onChange={(e) => {
                          setCategorySearchTerm(e.target.value);
                          setCategoryCurrentPage(1);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {loadingCategories && categories.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Loading categories...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {categorySearchTerm
                          ? "No categories found matching your search"
                          : "No categories available"}
                      </div>
                    ) : (
                      <>
                        {/* "All Subcategories" Option */}
                        <button
                          type="button"
                          onClick={() => handleCategorySelect("")}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                            selectedCategoryId === ""
                              ? "bg-gray-100 font-semibold text-black"
                              : "text-gray-700"
                          }`}
                        >
                          All Subcategories
                        </button>

                        {/* Category Options */}
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => handleCategorySelect(cat._id)}
                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                              selectedCategoryId === cat._id
                                ? "bg-gray-100 font-semibold text-black"
                                : "text-gray-700"
                            }`}
                          >
                            {cat.name || cat.title || "Unnamed Category"}
                          </button>
                        ))}

                        {/* Load More Button (for pagination when not searching) */}
                        {!debouncedCategorySearchTerm &&
                          categoryPagination && (() => {
                            const totalPages = categoryPagination.pages || 
                                              (categoryPagination.total ? Math.ceil(categoryPagination.total / categoryLimit) : 1) ||
                                              1;
                            return categoryCurrentPage < totalPages;
                          })() && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                loadMoreCategories();
                              }}
                              disabled={loadingCategories}
                              className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-t border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loadingCategories ? "Loading..." : "Load More..."}
                            </button>
                          )}
                      </>
                    )}
                  </div>

                  {/* Pagination Footer (when searching or showing paginated results) */}
                  {categories.length > 0 && (() => {
                    // Calculate total pages safely
                    const totalPages = categoryPagination?.pages || 
                                      (categoryPagination?.total ? Math.ceil(categoryPagination.total / categoryLimit) : 1) ||
                                      1;
                    
                    return (
                      <div className="p-3 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          {debouncedCategorySearchTerm
                            ? `Found ${categories.length} result${categories.length !== 1 ? "s" : ""}`
                            : categoryPagination
                            ? `Page ${categoryCurrentPage} of ${totalPages} (${allCategories.length} total)`
                            : `Showing ${categories.length} categories`}
                        </span>
                        {!debouncedCategorySearchTerm && categoryPagination && totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (categoryCurrentPage > 1) {
                                    setCategoryCurrentPage(categoryCurrentPage - 1);
                                  }
                                }}
                                disabled={categoryCurrentPage === 1 || loadingCategories}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Prev
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (categoryCurrentPage < totalPages) {
                                    setCategoryCurrentPage(categoryCurrentPage + 1);
                                  }
                                }}
                                disabled={
                                  categoryCurrentPage >= totalPages ||
                                  loadingCategories
                                }
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search subcategories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                size={20}
              />
            </div>

            <button
              onClick={openCreate}
              className="px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>New Subcategory</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Table / Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Order</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Navbar</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-gray-500">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        <span>Loading subcategories...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-gray-500 italic">
                      {debouncedSearchTerm
                        ? "No matching subcategories found..."
                        : selectedCategoryId
                        ? "No subcategories found in this category."
                        : "No subcategories exist yet."}
                    </td>
                  </tr>
                ) : (
                  displayData.map((sub, i) => (
                    <tr
                      key={sub._id}
                      className="group hover:bg-gray-50/70 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {(currentPage - 1) * limit + i + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                        {sub.sortOrder || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div 
                          className="relative group cursor-pointer h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (sub.imageUrl) {
                              setZoomedImage({ url: sub.imageUrl, name: sub.name });
                            }
                          }}
                        >
                          {sub.imageUrl ? (
                            <>
                              <img
                                src={sub.imageUrl}
                                alt={sub.name}
                                className="h-full w-full object-cover"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=?")}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                                <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">{sub.name}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell max-w-md">
                        <div className="line-clamp-2">{sub.description || "—"}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(sub._id);
                          }}
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                            sub.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNavbar(sub._id);
                          }}
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                            sub.isNavbar
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {sub.isNavbar ? "Shown" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(sub);
                          }}
                          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-black font-medium transition px-2 py-1.5 rounded-md hover:bg-gray-100"
                          title="Edit subcategory"
                        >
                          <Edit size={18} />
                          <span className="hidden sm:inline text-sm">Edit</span>
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
        {displayData.length > 0 && !loading && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
            <div className="text-sm text-gray-700">
              {isSearching ? (
                <>
                  Showing <strong>{displayData.length}</strong> of{" "}
                  <strong>{pagination?.total || displayData.length}</strong> matching results
                </>
              ) : (
                <>
                  Showing <strong>{displayData.length}</strong> of{" "}
                  <strong>{pagination?.total || subcategories.length}</strong> subcategories
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Previous
              </button>

              <span className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700 min-w-[140px] text-center">
                Page {currentPage} of{" "}
                {pagination?.pages ||
                  Math.ceil((pagination?.total || subcategories.length) / limit) ||
                  1}
              </span>

              <button
                disabled={
                  currentPage >=
                    (pagination?.pages ||
                      Math.ceil((pagination?.total || subcategories.length) / limit) ||
                      1) || loading
                }
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Close zoom"
          >
            <X size={28} />
          </button>

          {/* Zoomed Image Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '95vw', maxHeight: '90vh' }}
            />
          </div>

          {/* Image Name */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
            <p className="text-base font-medium">{zoomedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showsubcategory;