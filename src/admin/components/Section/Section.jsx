// src/admin/pages/Section.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, ZoomIn, X, ArrowLeft, Power } from "lucide-react";
import { getAllSections, toggleSectionActiveStatus } from "../../apis/Sectionapi";

const Section = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sectionType, setSectionType] = useState("ALL"); // ALL, MANUAL, CATEGORY
  const [zoomedImage, setZoomedImage] = useState(null);
  const navigate = useNavigate();

  const fetchSections = async (pageNum = 1, type = null) => {
    setLoading(true);
    try {
      // Fetch all sections or filter by type
      const params = { page: pageNum, limit };
      // Only add type if not "ALL"
      if (type && type !== "ALL") {
        params.type = type;
      }

      const response = await getAllSections(params);

      console.log("Sections fetched:", response);
      console.log("Filter type:", type);
      console.log("Response data:", response?.data);

      // Handle different response structures
      // Structure: { success, message, data: { items, pagination } }
      // Or: { data: { items, pagination } }
      let items = [];
      let pagination = null;

      if (response?.data?.data?.items && Array.isArray(response.data.data.items)) {
        // Nested structure: response.data.data.items
        items = response.data.data.items;
        pagination = response.data.data.pagination || null;
      } else if (response?.data?.items && Array.isArray(response.data.items)) {
        // Direct structure: response.data.items
        items = response.data.items;
        pagination = response.data.pagination || null;
      } else if (response?.data && Array.isArray(response.data)) {
        // Array directly in data
        items = response.data;
      } else if (Array.isArray(response)) {
        // Response is directly an array
        items = response;
      }

      console.log("Parsed items:", items);
      console.log("Items count:", items.length);
      console.log("Pagination:", pagination);

      setSections(Array.isArray(items) ? items : []);

      if (pagination) {
        setTotalPages(
          pagination.totalPages || pagination.pages || Math.ceil((pagination.total || items.length) / limit),
        );
      } else {
        // Fallback pagination calculation
        const total = items.length;
        setTotalPages(Math.ceil(total / limit) || 1);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      console.error("Error response:", error?.response?.data);
      alert(error?.response?.data?.message || error?.message || "Failed to load sections");
      setSections([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filter type changes
  useEffect(() => {
    setPage(1);
  }, [sectionType]);

  // Fetch sections when page or type changes
  useEffect(() => {
    fetchSections(page, sectionType);
  }, [page, sectionType]);

  const handleToggleActive = async (section) => {
    const originalStatus = section.isActive;
    
    // Optimistic update
    setSections(prev => prev.map(s => 
      s._id === section._id ? { ...s, isActive: !s.isActive } : s
    ));

    try {
      await toggleSectionActiveStatus(section._id);
      // Success - state already updated
    } catch (error) {
      console.error("Toggle failed:", error);
      // Revert on error
      setSections(prev => prev.map(s => 
        s._id === section._id ? { ...s, isActive: originalStatus } : s
      ));
      alert(error?.response?.data?.message || error?.message || "Failed to update section status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button
                onClick={() => navigate("/admin/splash")}
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Sections
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage homepage sections
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/sections/create")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={18} />
              <span>Add New Section</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6">
        {/* Filter by Section Type */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSectionType("ALL")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              sectionType === "ALL"
                ? "bg-black text-white"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setSectionType("MANUAL")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              sectionType === "MANUAL"
                ? "bg-black text-white"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setSectionType("CATEGORY")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              sectionType === "CATEGORY"
                ? "bg-black text-white"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Category
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              <span>Loading sections...</span>
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-12 text-center">
            <p className="text-lg font-bold text-gray-900 mb-2">
              {sectionType !== "ALL" 
                ? `No ${sectionType.toLowerCase()} sections found`
                : "No sections found"}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {sectionType !== "ALL"
                ? `Try selecting a different filter or create a new ${sectionType.toLowerCase()} section`
                : "Create your first section to get started"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {sectionType !== "ALL" && (
                <button
                  onClick={() => setSectionType("ALL")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Show All Sections
                </button>
              )}
              <button
                onClick={() => navigate("/admin/sections/create")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <Plus size={18} />
                <span>Create Section</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10">
                        #
                      </th>
                      <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Desktop
                      </th>
                      <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider hidden md:table-cell">
                        Mobile
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider min-w-[150px]">
                        Title
                      </th>
                      <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="hidden xl:table-cell px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider min-w-[120px]">
                        Categories
                      </th>
                      <th className="hidden md:table-cell px-3 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="hidden xl:table-cell px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="hidden 2xl:table-cell px-3 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Navigate
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sections.map((section, idx) => {
                      const desktopUrl =section.desktopBanner?.[0]?.imageUrl || null;
                      const mobileUrl = section.mobileBanner?.[0]?.imageUrl || null;
                      return (
                        <tr
                          key={section._id}
                          className="group hover:bg-gray-50/70 transition-colors duration-150 border-b border-gray-100"
                        >
                          <td className="px-3 sm:px-4 py-3 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 group-hover:bg-gray-50/70">
                            {(page - 1) * limit + idx + 1}
                          </td>
                          <td className="px-2 sm:px-3 py-3">
                            {desktopUrl ? (
                              <div
                                className="relative group cursor-pointer h-10 w-14 sm:h-12 sm:w-16 rounded overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:ring-1 hover:ring-indigo-500 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomedImage({
                                    url: desktopUrl,
                                    name: `${section.title} - Desktop`,
                                  });
                                }}
                              >
                                <img
                                  src={desktopUrl}
                                  alt={`${section.title} - Desktop`}
                                  className="h-full w-full object-cover"
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://via.placeholder.com/64?text=D")
                                  }
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded transition-all duration-200 opacity-0 group-hover:opacity-100">
                                  <ZoomIn className="h-2.5 w-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 w-14 sm:h-12 sm:w-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <span className="text-[7px] sm:text-[8px] text-gray-400">
                                  No
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-2 sm:px-3 py-3 hidden md:table-cell">
                            {mobileUrl ? (
                              <div
                                className="relative group cursor-pointer h-10 w-14 sm:h-12 sm:w-16 rounded overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:ring-1 hover:ring-indigo-500 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomedImage({
                                    url: mobileUrl,
                                    name: `${section.title} - Mobile`,
                                  });
                                }}
                              >
                                <img
                                  src={mobileUrl}
                                  alt={`${section.title} - Mobile`}
                                  className="h-full w-full object-cover"
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://via.placeholder.com/64?text=M")
                                  }
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded transition-all duration-200 opacity-0 group-hover:opacity-100">
                                  <ZoomIn className="h-2.5 w-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 w-14 sm:h-12 sm:w-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <span className="text-[7px] sm:text-[8px] text-gray-400">
                                  No
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-3">
                            <div
                              className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none"
                              title={section.title || ""}
                            >
                              {section.title || "—"}
                            </div>
                            {/* Show mobile image on small screens */}
                            <div className="md:hidden mt-1.5">
                              {mobileUrl ? (
                                <div
                                  className="relative group cursor-pointer h-8 w-12 rounded overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomedImage({
                                      url: mobileUrl,
                                      name: `${section.title} - Mobile`,
                                    });
                                  }}
                                >
                                  <img
                                    src={mobileUrl}
                                    alt={`${section.title} - Mobile`}
                                    className="h-full w-full object-cover"
                                    onError={(e) =>
                                      (e.target.src =
                                        "https://via.placeholder.com/48?text=M")
                                    }
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-200 opacity-0 group-hover:opacity-100">
                                    <ZoomIn className="h-2 w-2 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ) : (
                                <div className="h-8 w-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                  <span className="text-[6px] text-gray-400">
                                    No M
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Show type and other info on mobile */}
                            <div className="xl:hidden mt-1 flex flex-wrap gap-1">
                              {section.type && (
                                <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium bg-blue-100 text-blue-800">
                                  {section.type}
                                </span>
                              )}
                              {section.products?.length > 0 && (
                                <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-700">
                                  {section.products.length} products
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-3 py-3 text-sm text-gray-700">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {section.type || "—"}
                            </span>
                          </td>
                          <td className="hidden xl:table-cell px-3 py-3 text-sm text-gray-600">
                            {section.type === "CATEGORY" &&
                            (section.categories?.length > 0 || section.categoryId?.length > 0) ? (
                              <div
                                className="truncate max-w-[150px]"
                                title={section.categories
                                  ?.map((c) => c.name || c)
                                  .join(", ") || "Category selected"}
                              >
                                {section.categories
                                  ?.map((c) => c.name || c)
                                  .join(", ") || `${section.categoryId?.length || 0} categor${(section.categoryId?.length || 0) !== 1 ? 'ies' : 'y'}`}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                —
                              </span>
                            )}
                          </td>
                          <td className="hidden md:table-cell px-3 py-3 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                              {section.products?.length || 0}
                            </span>
                          </td>
                          <td className="hidden xl:table-cell px-3 py-3 text-sm text-gray-600">
                            {section.discount ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                {section.discount.value}
                                {section.discount.type === "PERCENT"
                                  ? "%"
                                  : "₹"}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                —
                              </span>
                            )}
                          </td>
                          <td className="hidden 2xl:table-cell px-3 py-3 text-sm text-gray-600">
                            <div
                              className="truncate max-w-[120px]"
                              title={section.navigation?.navigate || ""}
                            >
                              {section.navigation?.navigate || "—"}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActive(section);
                              }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all hover:scale-105 ${
                                section.isActive
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                              title={`Click to ${section.isActive ? "deactivate" : "activate"}`}
                            >
                              <Power size={10} className={section.isActive ? "text-green-600" : "text-red-600"} />
                              {section.isActive ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right sticky right-0 bg-white z-10 group-hover:bg-gray-50/70">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/admin/sections/edit/${section._id}`,
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                                title="Edit section"
                              >
                                <Edit size={14} className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Edit
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {sections.map((section, idx) => {
                const desktopUrl = section.desktopBanner?.[0]?.imageUrl || null;
                const mobileUrl = section.mobileBanner?.[0]?.imageUrl || null;
                return (
                  <div
                    key={section._id}
                    className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {section.title || "—"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {section.type || "—"}
                          </span>
                          {section.products?.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                              {section.products.length} products
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(section);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          section.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        <Power size={10} />
                        {section.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Images */}
                    <div className="flex gap-3">
                      {desktopUrl && (
                        <div
                          className="relative cursor-pointer h-20 w-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                          onClick={() => setZoomedImage({
                            url: desktopUrl,
                            name: `${section.title} - Desktop`,
                          })}
                        >
                          <img
                            src={desktopUrl}
                            alt="Desktop"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all">
                            <ZoomIn className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                      {mobileUrl && (
                        <div
                          className="relative cursor-pointer h-20 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                          onClick={() => setZoomedImage({
                            url: mobileUrl,
                            name: `${section.title} - Mobile`,
                          })}
                        >
                          <img
                            src={mobileUrl}
                            alt="Mobile"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all">
                            <ZoomIn className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {section.type === "CATEGORY" && (section.categories?.length > 0 || section.categoryId?.length > 0) && (
                        <div>
                          <span className="text-gray-500">Categories:</span>
                          <p className="font-medium text-gray-700 mt-0.5 truncate">
                            {section.categories?.map(c => c.name || c).join(", ") || `${section.categoryId?.length || 0} selected`}
                          </p>
                        </div>
                      )}
                      {section.discount && (
                        <div>
                          <span className="text-gray-500">Discount:</span>
                          <p className="font-medium text-gray-700 mt-0.5">
                            {section.discount.value}{section.discount.type === "PERCENT" ? "%" : "₹"}
                          </p>
                        </div>
                      )}
                      {section.navigation?.navigate && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Navigate:</span>
                          <p className="font-medium text-gray-700 mt-0.5 truncate">
                            {section.navigation.navigate}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-2 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/sections/edit/${section._id}`);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all border-2 border-gray-300 hover:border-gray-400"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {sections.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
                <div className="text-sm text-gray-700 font-medium">
                  Showing <span className="font-bold">{sections.length}</span>{" "}
                  of <span className="font-bold">{totalPages * limit}</span>{" "}
                  sections
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                  >
                    Previous
                  </button>

                  <span className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700 min-w-[140px] text-center">
                    Page {page} of {totalPages || 1}
                  </span>

                  <button
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage(page + 1)}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
              style={{ maxWidth: "95vw", maxHeight: "90vh" }}
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

export default Section;
