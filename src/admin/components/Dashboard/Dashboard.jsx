import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItemsCount, getCategoryCount, getSubcategoryCount } from "../../apis/Dashboardapi";
import { getFeaturedImages } from "../../apis/Bannerapi";
import { ZoomIn, X } from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          getItemsCount(),
          getCategoryCount(),
          getSubcategoryCount()
        ]);

        setCounts({
          Items: {
            total: itemsRes.data.items.totalItems,
            active: itemsRes.data.items.activeItems,
            inactive: itemsRes.data.items.inactiveItems,
            path: "/admin/items"
          },
          Categories: {
            total: categoriesRes.data.categories.totalCategories,
            active: categoriesRes.data.categories.activeCategories,
            inactive: categoriesRes.data.categories.inactiveCategories,
            path: "/admin/inventory/categories"
          },
          Subcategories: {
            total: subcategoriesRes.data.subcategories.totalSubCategories,
            active: subcategoriesRes.data.subcategories.activeSubCategories,
            inactive: subcategoriesRes.data.subcategories.inactiveSubCategories,
            path: "/admin/subcategoriess"
          }
        });

      } catch (err) {
        console.error("Dashboard count error:", err);
      }
    };

    fetchCounts();
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const response = await getFeaturedImages("", 1, 10);
      const responseData = response?.data || {};
      const imagesArray = responseData.data || [];
      setBanners(Array.isArray(imagesArray) ? imagesArray : []);
    } catch (err) {
      console.error("Dashboard banners error:", err);
    } finally {
      setLoadingBanners(false);
    }
  };

  const cardClass =
    "bg-white shadow rounded-lg p-6 flex flex-col justify-between w-full sm:w-60 cursor-pointer hover:shadow-lg transition";
  const cardHeaderClass = "text-lg font-semibold mb-2 text-gray-700";
  const cardCountClass = "text-3xl font-bold text-gray-900";
  const statusLabelClass = "text-sm font-medium text-gray-500 mt-1";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6 mb-8">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={key}
            className={cardClass}
            onClick={() => navigate(value.path)}
          >
            <div className={cardHeaderClass}>{key}</div>
            <div className={cardCountClass}>{value.total}</div>
            <div className="mt-3">
              <p className={statusLabelClass}>
                Active: <span className="text-green-600">{value.active}</span>
              </p>
              <p className={statusLabelClass}>
                Inactive: <span className="text-red-600">{value.inactive}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Banners Table */}
      {/* <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Admin Banners</h2>
          <button
            onClick={() => navigate("/admin/banners")}
            className="text-sm text-gray-600 hover:text-black font-medium"
          >
            View All →
          </button>
        </div>
        
        {loadingBanners ? (
          <div className="p-8 text-center text-gray-500">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No banners found. <button onClick={() => navigate("/admin/banners/create")} className="text-black hover:underline font-medium">Create one →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Heading</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subheading</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {banners.slice(0, 5).map((banner) => {
                  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(banner.url) || 
                                 banner.url.includes('video') ||
                                 banner.key?.includes('video');
                  
                  return (
                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div 
                          className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => setZoomedImage(banner)}
                        >
                          {isVideo ? (
                            <video
                              src={banner.url}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={banner.url}
                              alt={banner.heading || "banner"}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {banner.heading || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {banner.subHeading || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {banner.page || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/banners/edit/${banner._id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div> */}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[90vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            {/\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(zoomedImage.url) || 
             zoomedImage.url.includes('video') ||
             zoomedImage.key?.includes('video') ? (
              <video
                src={zoomedImage.url}
                controls
                className="max-w-full max-h-[90vh] w-auto h-auto"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={zoomedImage.url}
                alt={zoomedImage.heading || "zoomed image"}
                className="max-w-full max-h-[90vh] w-auto h-auto"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {(zoomedImage.heading || zoomedImage.subHeading) && (
              <div className="mt-4 text-white text-center">
                {zoomedImage.heading && <p className="font-semibold">{zoomedImage.heading}</p>}
                {zoomedImage.subHeading && <p className="text-sm text-gray-300">{zoomedImage.subHeading}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
