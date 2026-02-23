import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getItemsBySubcategory,
} from "../../apis/itemapi";

export default function Items() {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  console.log("[Items.jsx] Component mounted / re-rendered");
  console.log("[Items.jsx] Params → categoryId:", categoryId, "subcategoryId:", subcategoryId);

  // Fetch items
  const fetchItems = async (page = 1, limit = 10) => {
    console.log(`[Items.jsx] fetchItems called — page: ${page}, limit: ${limit}, subcategoryId: ${subcategoryId}`);

    try {
      setLoading(true);
      console.log("[Items.jsx] → Calling API: getItemsBySubcategory");

      const res = await getItemsBySubcategory(subcategoryId, page, limit);

      console.log("[Items.jsx] ← API response received");
      console.log("[Items.jsx]   Status:", res.status);
      console.log("[Items.jsx]   Data keys:", Object.keys(res.data || {}));
      console.log("[Items.jsx]   Items count:", res.data?.items?.length || 0);
      console.log("[Items.jsx]   Pagination:", res.data?.pagination);

      setItems(res.data?.items || []);
      setPagination(res.data?.pagination || null);

      console.log("[Items.jsx] State updated → items:", res.data?.items?.length || 0);
    } catch (err) {
      console.error("[Items.jsx] Fetch items FAILED");
      console.error("[Items.jsx] Error:", err);
      console.error("[Items.jsx] Error response:", err.response?.data);
      console.error("[Items.jsx] Error status:", err.response?.status);
    } finally {
      setLoading(false);
      console.log("[Items.jsx] Loading finished");
    }
  };

  useEffect(() => {
    console.log("[Items.jsx] useEffect triggered — fetching items");
    if (subcategoryId) {
      fetchItems(1); // always start from page 1 on subcategory change
    } else {
      console.warn("[Items.jsx] No subcategoryId → skipping fetch");
    }
  }, [subcategoryId]);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (searchTerm) {
    console.log(`[Items.jsx] Filtering active — search: "${searchTerm}" → ${filteredItems.length} results`);
  }

  // Navigation
  const openCreate = () => {
    console.log("[Items.jsx] → Navigate to CREATE product");
    navigate(`/admin/inventory/items/${categoryId}/${subcategoryId}/create`);
  };

  const openEdit = (item) => {
    console.log("[Items.jsx] → Navigate to EDIT product:", item._id || item.productId, item.name);
    navigate(
      `/admin/inventory/items/${categoryId}/${subcategoryId}/edit/${
        item._id || item.productId
      }`
    );
  };

  const goBackToSubcategory = () => {
    console.log("[Items.jsx] → Back to subcategories list");
    navigate(`/admin/inventory/subcategories/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/70">

      {/* Top Header */}
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
      </div>

      {/* Sticky Controls Section */}
      <div className="sticky top-[88px] z-40 backdrop-blur">
        <div className="px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">

            {/* Back Button */}
            <button
              onClick={goBackToSubcategory}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              ← Back
            </button>

            {/* Search */}
            <input
              value={searchTerm}
              onChange={(e) => {
                console.log("[Items.jsx] Search term changed:", e.target.value);
                setSearchTerm(e.target.value);
              }}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* Add Product */}
            <button
              onClick={openCreate}
              className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition"
            >
              + Add Product
            </button>

          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-h-[65vh] overflow-y-auto hide-scrollbar">

          <table className="w-full">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 sticky top-0">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discounted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item._id}
                    onClick={() => {
                      console.log("[Items.jsx] Row clicked → view details:", item._id, item.name);
                      navigate(`/admin/inventory/items/${item._id}`);
                    }}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4 text-gray-600">{index + 1}</td>

                    <td className="p-4">
                      <img
                        src={
                          item?.thumbnail ||
                          "https://via.placeholder.com/50"
                        }
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover border"
                      />
                    </td>

                    <td className="p-4 font-medium text-gray-900">
                      {item.name}
                    </td>

                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.shortDescription || "—"}
                    </td>

                    <td className="p-4 font-medium">₹{item.price}</td>

                    <td className="p-4">
                      {item.discountedPrice ? (
                        <span className="text-green-600 font-semibold">
                          ₹{item.discountedPrice}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-4">
                      {item.isActive ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(item);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
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

        {/* Pagination */}
        {pagination && (
          <div className="mt-8 flex justify-center items-center gap-6">
            <button
              disabled={pagination.page <= 1}
              onClick={() => {
                console.log("[Items.jsx] Previous page clicked → page:", pagination.page - 1);
                fetchItems(pagination.page - 1);
              }}
              className="px-5 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                console.log("[Items.jsx] Next page clicked → page:", pagination.page + 1);
                fetchItems(pagination.page + 1);
              }}
              className="px-5 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}