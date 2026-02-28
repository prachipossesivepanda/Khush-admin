// src/pages/Review.jsx
import { useEffect, useState } from "react";
import { getItemsWithSkus } from "../../apis/Reviewapi";
import { getReviews } from "../../apis/Reviewapi";

export default function Review() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // ================================
  // 🔹 FETCH ITEMS
  // ================================
 const fetchItems = async () => {
  try {
    setLoadingItems(true);
    const res = await getItemsWithSkus(1, 20);
    
    // Add this temporary debug line (remove later)
    console.log("API full response:", res);
    console.log("Items array:", res?.data?.items);

    setItems(res?.data?.items ?? []);
  } catch (err) {
    console.error("Error fetching items:", err);
  } finally {
    setLoadingItems(false);
  }
};

  // ================================
  // 🔹 FETCH REVIEWS
  // ================================
  const fetchReviews = async () => {
    if (!selectedItem) return;

    try {
      setLoadingReviews(true);
      const res = await getReviews(selectedItem, page, 4);
      setReviews(res?.data?.data?.reviews || []);
      setPagination(res?.data?.data?.pagination || {});
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [selectedItem, page]);

  // ⭐ Stars
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ★
      </span>
    ));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Item Reviews Dashboard
        </h1>

        {/* ITEM SELECT */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Select Item ID
          </label>

          {loadingItems ? (
            <p>Loading items...</p>
          ) : (
            <select
              value={selectedItem}
              onChange={(e) => {
                setSelectedItem(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select Item --</option>
              {items.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemId} ({item.skuIds.length} SKUs)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* REVIEWS */}
        {selectedItem && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Reviews for Item: {selectedItem}
            </h2>

            {loadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p>No reviews found.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{r.name}</span>
                      <span>{renderStars(r.rating)}</span>
                    </div>
                    <p className="text-gray-600">{r.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Prev
                </button>

                <span>
                  Page {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}