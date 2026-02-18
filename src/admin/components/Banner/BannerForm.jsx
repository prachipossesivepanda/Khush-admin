// BannerForm.jsx - Reusable form component for Create/Edit Banner
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Video } from "lucide-react";
import {
  createFeaturedImage,
  updateFeaturedImage,
  getFeaturedImages,
} from "../../apis/Bannerapi";

const BannerForm = () => {
  const { id } = useParams(); // dynamic banner ID
  const navigate = useNavigate();
  const isEdit = !!id;

  console.log("🎬 BannerForm Component Rendered", { id, isEdit });

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    file: null,
    preview: null,
    fileType: null, // 'image' or 'video'
    heading: "",
    subHeading: "",
    page: "home",
  });

  // Load banner data if editing
  useEffect(() => {
    if (isEdit) {
      const loadBanner = async () => {
        try {
          setLoading(true);
          console.log("📥 Loading banner data for edit...");
          const response = await getFeaturedImages("all");

          const imagesArray = response?.data ?? response?.data?.data ?? [];
          const banner = imagesArray.find((img) => img._id === id);

          if (banner) {
            const previewUrl = banner.imageUrl || banner.videoUrl || null;
            const fileType =
              previewUrl?.includes(".mp4") ||
              previewUrl?.includes(".webm") ||
              previewUrl?.includes(".mov")
                ? "video"
                : previewUrl
                ? "image"
                : null;

            setForm({
              file: null,
              preview: previewUrl,
              fileType,
              heading: banner.heading || "",
              subHeading: banner.subHeading || "",
              page: banner.page || "home",
            });

            console.log("🎯 Banner loaded into form:", banner);
          } else {
            console.warn("⚠️ Banner not found with id:", id);
          }
        } catch (err) {
          console.error("❌ Error loading banner:", err);
        } finally {
          setLoading(false);
        }
      };

      loadBanner();
    }
  }, [id, isEdit]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type.startsWith("video/")
      ? "video"
      : selectedFile.type.startsWith("image/")
      ? "image"
      : null;

    if (!fileType) {
      alert("Please select an image or video file");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    setForm({
      ...form,
      file: selectedFile,
      preview: previewUrl,
      fileType,
    });
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit) {
      alert("Create mode: you can only create banners here.");
      return;
    }

    if (!id) {
      console.error("❌ No banner ID provided for update");
      return alert("Banner ID is missing. Cannot update.");
    }

    const formData = new FormData();
    // Don't append imageId to FormData - it will be sent as query parameter
    formData.append("heading", form.heading);
    formData.append("subHeading", form.subHeading);
    formData.append("page", form.page);

    if (form.file) formData.append("file", form.file); // optional file

    // Log FormData contents for debugging
    console.log("📦 FormData Contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, { name: value.name, type: value.type, size: value.size });
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    try {
      setLoading(true);
      console.log("💾 Updating banner with ID:", id);
      const res = await updateFeaturedImage(id, formData);
      console.log("✅ Banner updated:", res);
      alert("Banner updated successfully!");
      navigate("/admin/banners");
    } catch (err) {
      console.error("❌ Error updating banner:", err);
      if (err.response?.status === 404) {
        alert("Update failed: endpoint not found or banner ID invalid.");
      } else {
        alert("Update failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/banners")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Banners</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Banner" : "Create New Banner"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isEdit
              ? "Update banner information"
              : "Add a new banner to your site"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Image / Video {isEdit && <span className="text-gray-400">(optional)</span>}
              </label>

              {form.preview && (
                <div className="mb-4">
                  {form.fileType === "video" ? (
                    <video
                      src={form.preview}
                      controls
                      className="max-h-64 w-full object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-4 shadow-sm"
                    />
                  ) : (
                    <img
                      src={form.preview}
                      alt="Preview"
                      className="max-h-64 w-full object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-4 shadow-sm"
                    />
                  )}
                  {form.fileType && (
                    <p className="mt-2 text-xs text-gray-500">
                      File Type: <span className="font-medium">{form.fileType.toUpperCase()}</span>
                      {form.file && (
                        <> | Size: <span className="font-medium">{(form.file.size / 1024 / 1024).toFixed(2)} MB</span></>
                      )}
                    </p>
                  )}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col items-center justify-center">
                  {form.fileType === "video" ? (
                    <Video size={24} className="text-gray-400 group-hover:text-gray-600 mb-2" />
                  ) : (
                    <ImageIcon size={24} className="text-gray-400 group-hover:text-gray-600 mb-2" />
                  )}
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                    {form.preview ? "Change File" : "Choose Image or Video"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF, WebP, MP4, WebM, MOV up to 50MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Heading */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Main Heading
              </label>
              <input
                type="text"
                name="heading"
                value={form.heading}
                onChange={handleChange}
                placeholder="Enter main heading"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Sub Heading */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sub Heading / Description
              </label>
              <input
                type="text"
                name="subHeading"
                value={form.subHeading}
                onChange={handleChange}
                placeholder="Enter sub heading or description"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Page */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Page Location
              </label>
              <select
                name="page"
                value={form.page}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
              >
                <option value="home">Home Page</option>
                <option value="lock">Lock Screen</option>
                <option value="bottom">Bottom Banner</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/banners")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!isEdit && !form.file)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
