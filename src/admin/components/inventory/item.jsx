// Items.jsx
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

  // Fetch items
  const fetchItems = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await getItemsBySubcategory(subcategoryId, page, limit);
      setItems(res.data?.items || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      console.error("Fetch items error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subcategoryId) fetchItems();
  }, [subcategoryId]);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Navigation Handlers ───
  const openCreate = () => {
    navigate(`/admin/inventory/items/${categoryId}/${subcategoryId}/create`);
  };

  // Navigate to edit page
  const openEdit = (item) => {
    navigate(`/admin/inventory/items/${categoryId}/${subcategoryId}/edit/${item._id || item.productId}`);
  };


  // ─── UI ───
  return (
    <div className="min-h-screen bg-gray-50/70">
      <div className="sticky top-0 bg-white border-b">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={openCreate}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition"
          >
            + Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
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
                    onClick={() => navigate(`/admin/inventory/items/${item._id}`)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4 text-gray-600">{index + 1}</td>
                    <td className="p-4">
                      <img
                        src={item?.thumbnail || "https://via.placeholder.com/50"}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover border"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.shortDescription || "—"}
                    </td>
                    <td className="p-4 font-medium">₹{item.price}</td>
                    <td className="p-4">
                      {item.discountedPrice ? (
                        <span className="text-green-600 font-semibold">₹{item.discountedPrice}</span>
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
              onClick={() => fetchItems(pagination.page - 1)}
              className="px-5 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchItems(pagination.page + 1)}
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
