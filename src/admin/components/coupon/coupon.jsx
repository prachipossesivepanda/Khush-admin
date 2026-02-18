import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoupons, deleteCoupon } from "../../apis/CouponApi";
import { Plus, Trash2, Edit } from "lucide-react";

const CouponPage = () => {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await getCoupons();

    console.log("FULL API RESPONSE 👉", response.data);

    // ✅ correct path
    const couponsList = response?.data?.data;

    console.log("COUPONS ARRAY 👉", couponsList);

    if (Array.isArray(couponsList)) {
      setCoupons(couponsList);
    } else {
      setCoupons([]);
    }
  } catch (err) {
    console.error("Fetch coupons error:", err);
    setError("Failed to load coupons. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      setLoading(true);
      await deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Coupons</h1>
          <button
            onClick={() => navigate("/admin/coupons/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            Add Coupon
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">No coupons found</p>
            <button
              onClick={() => navigate("/admin/coupons/create")}
              className="text-black font-medium hover:underline"
            >
              Create your first coupon →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">Code</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-left">Discount</th>
                    <th className="px-6 py-4 text-left">Min Cart</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{coupon.code}</td>
                      <td className="px-6 py-4">{coupon.description || "-"}</td>
                      <td className="px-6 py-4">
                        {coupon.discountType === "PERCENT"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="px-6 py-4">₹{coupon.minCartValue}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            coupon.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/coupons/edit/${coupon._id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CouponPage;
