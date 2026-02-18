import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFeaturedImages,
  deleteFeaturedImage,
} from "../../apis/Bannerapi";

export default function Featured() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterPage, setFilterPage] = useState("all");

  const fetchImages = async () => {
    try {
      setLoading(true);
      const queryPage = filterPage === "all" ? "all" : filterPage;
      const response = await getFeaturedImages(queryPage);

      const apiData = response?.data ?? response ?? {};
      const imagesArray = apiData?.data ?? apiData ?? [];

      setImages(imagesArray);
    } catch (err) {
      console.error("[fetchImages] ERROR:", err);
      alert("Failed to load featured images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [filterPage]);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteFeaturedImage(id);
      fetchImages();
    } catch (err) {
      console.error("[handleDelete] ERROR:", err);
      alert("Delete failed");
    }
  };


  return (
    <div 
      className={`
        min-h-screen  text-gray-900 pb-10
        transition-all duration-300
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Images</h1>
          <div className="flex gap-3">
            <select
              value={filterPage}
              onChange={(e) => setFilterPage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/30 shadow-sm min-w-[140px]"
            >
              <option value="all">All Pages</option>
              <option value="home">Home</option>
              <option value="lock">Lock</option>
              <option value="bottom">Bottom</option>
            </select>
            <button
              onClick={() => navigate("/admin/banners/create")}
              className="bg-black text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-800 transition shadow-sm"
            >
              + Add Banner
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Current Featured Images</h2>

          {loading ? (
            <div className="text-gray-600 py-12 text-center text-lg">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-600">
              <p className="text-lg font-medium mb-2">
                {filterPage === "all"
                  ? "No featured images found"
                  : `No images for "${filterPage}" page`}
              </p>
              <button
                onClick={() => navigate("/admin/banners/create")}
                className="text-black hover:underline font-medium mt-2"
              >
                Create your first banner →
              </button>
            </div>
          ) : (
            <div className=" grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4  2xl:grid-cols-5  gap-5 sm:gap-6 lg:gap-7 ">
              {images.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white border border-gray-200  overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.heading || "featured image"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x240?text=Image+Error";
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/banners/edit/${item._id}`)}
                        className="bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 text-xs px-3 py-1 rounded-lg shadow-md opacity-90 hover:opacity-100 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 text-xs px-3 py-1 rounded-lg shadow-md opacity-90 hover:opacity-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-base line-clamp-1 mb-1">
                      {item.heading || "No heading"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.subHeading || "No subheading"}
                    </p>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {item.page}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}