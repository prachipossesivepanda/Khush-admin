// src/admin/pages/SectionForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp, Package, Tag, Image, Link2, Percent, FileText } from "lucide-react";
import { createSection, updateSection, getSingleSection } from "../../apis/Sectionapi";
import { getAllCategories } from "../../apis/categoryapi";
import { searchItems } from "../../apis/itemapi";

const SectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("MANUAL");
  const [text, setText] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [subcategoryIds, setSubcategoryIds] = useState([]); // optional for now
  const [productIds, setProductIds] = useState([]);
  const [discountType, setDiscountType] = useState("PERCENT");
  const [discountValue, setDiscountValue] = useState(0);
  const [externalLink, setExternalLink] = useState("");
  const [navigatePath, setNavigatePath] = useState("");
  const [desktopBanner, setDesktopBanner] = useState(null);
  const [mobileBanner, setMobileBanner] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);

  // Category states with pagination and search
  const [categories, setCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [debouncedCategorySearchTerm, setDebouncedCategorySearchTerm] = useState("");
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [categoryPagination, setCategoryPagination] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryLimit] = useState(10);

  // Product states with pagination and search
  const [products, setProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [debouncedProductSearchTerm, setDebouncedProductSearchTerm] = useState("");
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productPagination, setProductPagination] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  // Accordion states
  const [isCategoryAccordionOpen, setIsCategoryAccordionOpen] = useState(false);
  const [isProductAccordionOpen, setIsProductAccordionOpen] = useState(true);
  const [isDiscountAccordionOpen, setIsDiscountAccordionOpen] = useState(false);
  const [isNavigationAccordionOpen, setIsNavigationAccordionOpen] = useState(false);
  const [isBannerAccordionOpen, setIsBannerAccordionOpen] = useState(false);

  // Debounce category search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategorySearchTerm(categorySearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [categorySearchTerm]);

  // Debounce product search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearchTerm(productSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [productSearchTerm]);

  // Reset category page when search changes
  useEffect(() => {
    if (debouncedCategorySearchTerm !== categorySearchTerm) {
      setCategoryCurrentPage(1);
    }
  }, [debouncedCategorySearchTerm]);

  // Reset product page when search changes
  useEffect(() => {
    if (debouncedProductSearchTerm !== productSearchTerm) {
      setProductCurrentPage(1);
    }
  }, [debouncedProductSearchTerm]);

  // Fetch categories with pagination and search
  const fetchCategories = async (page = 1) => {
    try {
      setLoadingCategories(true);
      const res = await getAllCategories(page, categoryLimit, debouncedCategorySearchTerm);
      const data = res?.data?.data || res?.data || {};
      const catArray = data.categories || data || [];
      const pag = data.pagination || null;

      setCategories(Array.isArray(catArray) ? catArray : []);
      setCategoryPagination(pag);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
      setCategoryPagination(null);
    } finally {
      setLoadingCategories(false);
      setFetchingData(false);
    }
  };

  // Fetch products with pagination and search
  const fetchProducts = async (page = 1) => {
    try {
      setLoadingProducts(true);
      // Use searchItems API which uses /items/search endpoint
      const queryParams = {
        page,
        limit: productLimit,
      };
      if (debouncedProductSearchTerm && debouncedProductSearchTerm.trim()) {
        queryParams.search = debouncedProductSearchTerm.trim();
      }
      
      const res = await searchItems(queryParams);
      
      console.log("API Response:", res);
      
      // Handle different response structures
      // Response structure from API: { success, message, data: { items, pagination } }
      // After axios: res.data = { success, message, data: { items, pagination } }
      let prodArray = [];
      let pag = null;

      // Check for nested data structure: res.data.data.items
      if (res?.data?.data?.items && Array.isArray(res.data.data.items)) {
        prodArray = res.data.data.items;
        pag = res.data.data.pagination || null;
      }
      // Check for direct data structure: res.data.items
      else if (res?.data?.items && Array.isArray(res.data.items)) {
        prodArray = res.data.items;
        pag = res.data.pagination || null;
      }
      // Check if data itself is an array
      else if (res?.data && Array.isArray(res.data)) {
        prodArray = res.data;
      }
      // Check if response is directly an array
      else if (Array.isArray(res)) {
        prodArray = res;
      }
      // Check for items at root level
      else if (res?.items && Array.isArray(res.items)) {
        prodArray = res.items;
        pag = res.pagination || null;
      }
      // Fallback: try to extract from any nested structure
      else if (res?.data?.data) {
        const data = res.data.data;
        if (data.items && Array.isArray(data.items)) {
          prodArray = data.items;
          pag = data.pagination || null;
        } else if (Array.isArray(data)) {
          prodArray = data;
        }
      }

      console.log("Products parsed:", { count: prodArray.length, pagination: pag, page, sample: prodArray[0] });
      setProducts(Array.isArray(prodArray) ? prodArray : []);
      setProductPagination(pag);
    } catch (err) {
      console.error("Failed to load products:", err);
      console.error("Error response:", err?.response?.data);
      setProducts([]);
      setProductPagination(null);
    } finally {
      setLoadingProducts(false);
      setFetchingData(false);
    }
  };

  // Fetch categories when page or search changes
  useEffect(() => {
    fetchCategories(categoryCurrentPage);
  }, [categoryCurrentPage, debouncedCategorySearchTerm]);

  // Fetch products when page or search changes
  useEffect(() => {
    fetchProducts(productCurrentPage);
  }, [productCurrentPage, debouncedProductSearchTerm]);

  // 2. Load existing section data when editing
  useEffect(() => {
    if (!id) return;

    const fetchSection = async () => {
      setLoading(true);
      try {
        const res = await getSingleSection(id);
        console.log("Section data received:", res);
        
        // Handle different response structures
        const sec = res?.data?.data || res?.data || res || {};

        if (!sec || Object.keys(sec).length === 0) {
          throw new Error("Section data is empty");
        }

        setTitle(sec.title || "");
        setType(sec.type || "MANUAL");
        setText(sec.text || "");
        
        // Handle categoryIds - could be array or single value
        const catIds = sec.categoryId || sec.categoryIds || [];
        setCategoryIds(Array.isArray(catIds) ? catIds : (catIds ? [catIds] : []));
        
        // Handle subcategoryIds
        const subCatIds = sec.subcategoryId || sec.subcategoryIds || [];
        setSubcategoryIds(Array.isArray(subCatIds) ? subCatIds : (subCatIds ? [subCatIds] : []));
        
        // Important: map itemId correctly - handle different product structures
        let productIdsArray = [];
        if (sec.products && Array.isArray(sec.products)) {
          productIdsArray = sec.products
            .map(p => p.itemId || p._id || p.id)
            .filter(Boolean);
        } else if (sec.productIds && Array.isArray(sec.productIds)) {
          productIdsArray = sec.productIds;
        }
        setProductIds(productIdsArray);

        setDiscountType(sec.discount?.type || "PERCENT");
        setDiscountValue(sec.discount?.value || 0);
        setExternalLink(sec.navigation?.externalLink || "");
        setNavigatePath(sec.navigation?.navigate || "");

        // Banner previews (assuming array of objects with url)
        setDesktopPreview(sec.desktopBanner?.[0]?.url || sec.desktopBanner || null);
        setMobilePreview(sec.mobileBanner?.[0]?.url || sec.mobileBanner || null);
      } catch (err) {
        console.error("Failed to load section:", err);
        const errorMessage = err?.message || err?.response?.data?.message || "Could not load section data";
        alert(errorMessage);
        // Navigate back on error
        navigate("/admin/sections");
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (productIds.length === 0) {
      alert("At least one product is required");
      return;
    }

    if (type === "CATEGORY" && categoryIds.length === 0) {
      alert("At least one category is required when type is CATEGORY");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("type", type);
    if (text.trim()) {
      formData.append("text", text.trim());
    }

    // Categories & subcategories (only if CATEGORY)
    if (type === "CATEGORY") {
      categoryIds.forEach(cid => {
        if (cid) formData.append("categoryId", cid);
      });
      subcategoryIds.forEach(sid => {
        if (sid) formData.append("subcategoryId", sid);
      });
    }

    // Products – send as JSON string (more reliable)
    if (productIds.length > 0) {
      const productsArray = productIds.map(pid => ({ itemId: pid }));
      formData.append("products", JSON.stringify(productsArray));
      // Also send individual items for compatibility
      productIds.forEach((pid, index) => {
        if (pid) {
          formData.append(`products[${index}][itemId]`, pid);
        }
      });
    }

    // Discount - send as nested object
    if (discountType && discountValue !== undefined) {
      formData.append("discount.type", discountType);
      formData.append("discount.value", discountValue.toString());
    }

    // Navigation - send as nested object
    if (externalLink.trim()) {
      formData.append("navigation.externalLink", externalLink.trim());
    }
    if (navigatePath.trim()) {
      formData.append("navigation.navigate", navigatePath.trim());
    }

    if (desktopBanner) formData.append("desktopBanner", desktopBanner);
    if (mobileBanner) formData.append("mobileBanner", mobileBanner);

    // Log FormData for debugging
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    setLoading(true);
    try {
      if (id) {
        console.log("Updating section with ID:", id);
        const response = await updateSection(id, formData);
        console.log("Update response:", response);
        alert("Section updated successfully!");
      } else {
        console.log("Creating new section");
        const response = await createSection(formData);
        console.log("Create response:", response);
        alert("Section created successfully!");
      }
      navigate("/admin/sections");
    } catch (err) {
      console.error("Save failed:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      const errorMessage = err?.response?.data?.message || err?.message || err?.response?.data?.error || "Failed to save section";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (setter, currentIds) => (itemId) => {
    if (currentIds.includes(itemId)) {
      setter(currentIds.filter(id => id !== itemId));
    } else {
      setter([...currentIds, itemId]);
    }
  };

  // No need for initial loading screen - data loads on demand

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button and Title on Right */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/sections")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {id ? "Edit Section" : "Create Section"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {id ? "Update section information" : "Add a new section"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 sm:p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </h2>
              
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Section Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      // Reset categories when switching away from CATEGORY
                      if (e.target.value !== "CATEGORY") {
                        setCategoryIds([]);
                        setSubcategoryIds([]);
                        setIsCategoryAccordionOpen(false);
                      } else {
                        setIsCategoryAccordionOpen(true);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black bg-white transition-all font-medium"
                    required
                  >
                    <option value="MANUAL">MANUAL (select products manually)</option>
                    <option value="CATEGORY">CATEGORY (select categories)</option>
                  </select>
                </div>

                {/* Text/Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter section description or text..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Categories Accordion – shown only for CATEGORY type */}
            {type === "CATEGORY" && (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsCategoryAccordionOpen(!isCategoryAccordionOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-base font-bold text-gray-900">
                        Categories <span className="text-red-600">*</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {categoryIds.length > 0 
                          ? `${categoryIds.length} categor${categoryIds.length !== 1 ? 'ies' : 'y'} selected`
                          : "Select categories for this section"}
                      </p>
                    </div>
                  </div>
                  {isCategoryAccordionOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {isCategoryAccordionOpen && (
                  <div className="p-6 space-y-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-800">
                        Select Categories
                      </label>
                      {categories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (categoryIds.length === categories.length) {
                              setCategoryIds([]);
                            } else {
                              setCategoryIds(categories.map(cat => cat._id));
                            }
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors px-3 py-1.5 bg-blue-50 rounded-lg"
                        >
                          {categoryIds.length === categories.length ? "Deselect All" : "Select All"}
                        </button>
                      )}
                    </div>

                {/* Category Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  />
                </div>

                {/* Categories List */}
                <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                  <div className="max-h-64 overflow-y-auto overscroll-contain p-3">
                    {loadingCategories ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        <span className="ml-3 text-sm text-gray-500">Loading categories...</span>
                      </div>
                    ) : categories.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">
                        {categorySearchTerm ? "No categories found matching your search" : "No categories available"}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {categories.map((cat) => (
                          <label
                            key={cat._id}
                            className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={categoryIds.includes(cat._id)}
                              onChange={() => handleCheckboxChange(setCategoryIds, categoryIds)(cat._id)}
                              className="w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-2 focus:ring-black/20 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 flex-1">
                              {cat.name || cat.title || cat._id}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Pagination */}
                  {categoryPagination && categoryPagination.totalPages > 1 && (
                    <div className="border-t border-gray-200 bg-gray-50 px-3 py-2.5 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Page {categoryCurrentPage} of {categoryPagination.totalPages || 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCategoryCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={categoryCurrentPage <= 1 || loadingCategories}
                          className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryCurrentPage(prev => prev + 1)}
                          disabled={categoryCurrentPage >= (categoryPagination.totalPages || 1) || loadingCategories}
                          className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                    {categoryIds.length === 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-600 font-medium">
                          ⚠️ Please select at least one category
                        </p>
                      </div>
                    )}
                    {categoryIds.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-green-700 font-medium">
                          ✓ <span className="font-semibold">{categoryIds.length}</span> categor{categoryIds.length !== 1 ? 'ies' : 'y'} selected
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Products Accordion – always required */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setIsProductAccordionOpen(!isProductAccordionOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900">
                      Products <span className="text-red-600">*</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {productIds.length > 0 
                        ? `${productIds.length} product${productIds.length !== 1 ? 's' : ''} selected`
                        : "Select products for this section"}
                    </p>
                  </div>
                </div>
                {isProductAccordionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {isProductAccordionOpen && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-800">
                      Select Products
                    </label>
                    {products.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (productIds.length === products.length) {
                            setProductIds([]);
                          } else {
                            setProductIds(products.map(prod => prod._id));
                          }
                        }}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors px-3 py-1.5 bg-purple-50 rounded-lg"
                      >
                        {productIds.length === products.length ? "Deselect All" : "Select All"}
                      </button>
                    )}
                  </div>

              {/* Product Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                />
              </div>

              {/* Products List */}
              <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                <div className="max-h-96 overflow-y-auto overscroll-contain p-3">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                      <span className="ml-3 text-sm text-gray-500">Loading products...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      {productSearchTerm ? "No products found matching your search" : "No products available"}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {products.map((prod) => (
                        <label
                          key={prod._id}
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={productIds.includes(prod._id)}
                            onChange={() => handleCheckboxChange(setProductIds, productIds)(prod._id)}
                            className="w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-2 focus:ring-black/20 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-gray-900">
                                {prod.name || "Unnamed"}
                              </span>
                              {prod.productId && (
                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                  {prod.productId}
                                </span>
                              )}
                              {prod.discountedPrice && (
                                <span className="text-sm font-semibold text-green-600">
                                  ₹{prod.discountedPrice}
                                </span>
                              )}
                            </div>
                            {prod.shortDescription && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {prod.shortDescription}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Pagination */}
                {productPagination && productPagination.totalPages > 1 && (
                  <div className="border-t border-gray-200 bg-gray-50 px-3 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Page {productCurrentPage} of {productPagination.totalPages || 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setProductCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={productCurrentPage <= 1 || loadingProducts}
                        className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductCurrentPage(prev => prev + 1)}
                        disabled={productCurrentPage >= (productPagination.totalPages || 1) || loadingProducts}
                        className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>

                  {productIds.length === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium">
                        ⚠️ Please select at least one product
                      </p>
                    </div>
                  )}
                  {productIds.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium">
                        ✓ <span className="font-semibold">{productIds.length}</span> product{productIds.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Discount Accordion */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setIsDiscountAccordionOpen(!isDiscountAccordionOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900">Discount Settings</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {discountValue > 0 
                        ? `${discountValue}${discountType === "PERCENT" ? "%" : "₹"} discount`
                        : "Optional discount for this section"}
                    </p>
                  </div>
                </div>
                {isDiscountAccordionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {isDiscountAccordionOpen && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Discount Type
                      </label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black bg-white transition-all font-medium"
                      >
                        <option value="PERCENT">Percentage (%)</option>
                        <option value="FLAT">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        min={0}
                        step={discountType === "PERCENT" ? 1 : 0.01}
                        placeholder={discountType === "PERCENT" ? "e.g., 10" : "e.g., 100"}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Accordion */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setIsNavigationAccordionOpen(!isNavigationAccordionOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-orange-600" />
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900">Navigation Settings</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {externalLink || navigatePath 
                        ? "Navigation configured"
                        : "Optional navigation links"}
                    </p>
                  </div>
                </div>
                {isNavigationAccordionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {isNavigationAccordionOpen && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        External Link (optional)
                      </label>
                      <input
                        type="url"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Internal Navigate Path (optional)
                      </label>
                      <input
                        type="text"
                        value={navigatePath}
                        onChange={(e) => setNavigatePath(e.target.value)}
                        placeholder="/home or /products/abc"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Uploads Accordion */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setIsBannerAccordionOpen(!isBannerAccordionOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Image className="h-5 w-5 text-cyan-600" />
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900">Banner Images</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {desktopPreview || mobilePreview 
                        ? "Banners uploaded"
                        : "Upload desktop and mobile banners"}
                    </p>
                  </div>
                </div>
                {isBannerAccordionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {isBannerAccordionOpen && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Desktop Banner
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDesktopBanner(file);
                            setDesktopPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer transition-all"
                      />
                      {desktopPreview && (
                        <div className="mt-3 relative group">
                          <img
                            src={desktopPreview}
                            alt="Desktop preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setDesktopBanner(null);
                              setDesktopPreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Mobile Banner
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setMobileBanner(file);
                            setMobilePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer transition-all"
                      />
                      {mobilePreview && (
                        <div className="mt-3 relative group">
                          <img
                            src={mobilePreview}
                            alt="Mobile preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMobileBanner(null);
                              setMobilePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? "Saving..." : id ? "Update Section" : "Create Section"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/sections")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionForm;