// src/admin/pages/BannerForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createBanner,
  updateBanner,
  getSingleBanner,
} from "../../apis/homebannerapi";

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("PROMO");
  const [discountType, setDiscountType] = useState("PERCENT");
  const [discount, setDiscount] = useState("");
  const [navigation, setNavigation] = useState("");
  const [desktopBanner, setDesktopBanner] = useState(null);
  const [mobileBanner, setMobileBanner] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Load existing banner when editing
  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      setLoading(true);
      try {
        const data = await getSingleBanner(id);
        console.log("[FETCH] Single banner response:", data);

        const banner = data?.data || {};
        setTitle(banner.title || "");
        setText(banner.text || "");
        setType(banner.type || "PROMO");
        setDiscountType(banner.discountType || "PERCENT");
        setDiscount(banner.discount || "");
        setNavigation(banner.navigation?.navigate || banner.navigation || "");
        setDesktopPreview(banner.desktopBanner?.url || null);
        setMobilePreview(banner.mobileBanner?.url || null);
      } catch (err) {
        console.error("[FETCH ERROR]", err);
        setFormError("Failed to load banner data. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  const handleFileChange = (e, setFileState, setPreviewState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("[FILE SELECTED]", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    // Optional: basic client-side validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit example
      setFormError("File is too large (max 10MB)");
      return;
    }

    setFileState(file);
    setPreviewState(URL.createObjectURL(file));
    setFormError(""); // clear error on new selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic client-side validation
    if (!title.trim()) return setFormError("Title is required");
    if (!text.trim()) return setFormError("Text / subtitle is required");
    if (!navigation.trim()) return setFormError("Navigation target is required");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("text", text.trim());
    formData.append("type", type);
    formData.append("discountType", discountType);
    formData.append("discount", discount || 0);
    // Try both common formats — see which one your backend expects
    // formData.append("navigation", navigation.trim());
formData.append("navigation", JSON.stringify({ navigate: navigation.trim() }));
    if (desktopBanner) {
      formData.append("desktopBanner", desktopBanner);
    }
    if (mobileBanner) {
      formData.append("mobileBanner", mobileBanner);
    }

    // ─── Debug: show what we're actually sending ───
    console.log("━━━━━━━━━━━━━━━  SUBMITTING  ━━━━━━━━━━━━━━━");
    console.log("Text fields:", {
      title: title.trim(),
      text: text.trim(),
      type,
      discountType,
      discount: discount || 0,
      navigation: navigation.trim(),
    });
    console.log("Files attached:", {
      desktop: desktopBanner ? desktopBanner.name : "—",
      mobile: mobileBanner ? mobileBanner.name : "—",
    });

    console.log("FormData contents:");
    for (let [key, val] of formData.entries()) {
      if (val instanceof File) {
        console.log(`  → ${key}: [File] ${val.name} (${val.type}, ${(val.size / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`  → ${key}: ${val}`);
      }
    }
    // ────────────────────────────────────────────────

    setLoading(true);

    try {
      let result;
      if (id) {
        console.log(`→ Updating banner #${id}`);
        result = await updateBanner(id, formData);
        console.log("[UPDATE SUCCESS]", result);
        alert("Banner updated successfully!");
      } else {
        console.log("→ Creating new banner");
        result = await createBanner(formData);
        console.log("[CREATE SUCCESS]", result);
        alert("Banner created successfully!");
      }

      navigate("/admin/splash");
    } catch (err) {
      console.group("┃ SAVE FAILED ┃");
      console.error("Error:", err);
      console.error("Response?", err.response);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        console.error("Message:", err.response.data?.message || err.message);
      } else {
        console.error("No response → network / CORS / timeout?");
      }
      console.groupEnd();

      const serverMsg = err.response?.data?.message || err.message || "Unknown error";
      setFormError(`Failed to save banner: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/splash")}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                ← Back to List
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? "Edit Banner" : "Create New Banner"}
              </h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-black"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-7">
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                {formError}
              </div>
            )}

            {/* Title + Text */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4"
                  placeholder="Summer Sale is Live!"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subtitle / Text <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4"
                  placeholder="Up to 70% off on selected items"
                  required
                />
              </div>
            </div>

            {/* Type + Discount */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4 bg-white"
                >
                  <option value="PROMO">FLASH</option>
                  <option value="PERCENT">PERCENT</option>
                  <option value="FLAT">FLAT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4 bg-white"
                >
                  <option value="PERCENT">Percentage</option>
                  <option value="FLAT">Flat Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Value
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Navigation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Navigation Target <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={navigation}
                onChange={(e) => setNavigation(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-4"
                placeholder="e.g. product/65f4a9c... or category/electronics"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Usually a product ID, category slug or full path
              </p>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Desktop */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Desktop Banner (1920×600 recommended)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={(e) => handleFileChange(e, setDesktopBanner, setDesktopPreview)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
            {desktopPreview && (
  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
    {desktopBanner?.type?.startsWith("video") || desktopPreview?.endsWith(".mp4") ? (
      <video src={desktopPreview} controls className="w-full h-56 object-cover" />
    ) : (
      <img src={desktopPreview} alt="Desktop preview" className="w-full h-56 object-cover" />
    )}
  </div>
)}
              </div>

              {/* Mobile */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Banner (800×600 or similar)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={(e) => handleFileChange(e, setMobileBanner, setMobilePreview)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              {mobilePreview && (
  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
    {mobileBanner?.type?.startsWith("video") || mobilePreview?.endsWith(".mp4") ? (
      <video src={mobilePreview} controls className="w-full h-56 object-cover" />
    ) : (
      <img src={mobilePreview} alt="Mobile preview" className="w-full h-56 object-cover" />
    )}
  </div>
)}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : id ? "Update Banner" : "Create Banner"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/splash")}
                className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BannerForm;