import React, { useEffect, useState } from "react";
import { getBanners, deleteBanner } from "../../apis/Splashapi";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(res.data?.data || []);
    } catch (err) {
      console.error("Fetch banner error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this banner?")) return;
    try {
      await deleteBanner(id);
      alert("Banner deleted ✅");
      fetchBanners();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed ❌");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Banners</h2>
        <button
          onClick={() => navigate("/admin/splash/create")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="border rounded p-3 shadow">
            <p className="font-semibold">{banner.text}</p>
            <p>Type: {banner.type}</p>
            <p>Discount: {banner.discount}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/admin/splash/edit/${banner._id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
