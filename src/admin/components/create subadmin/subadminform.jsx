import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createSubAdmin,
  updateSubAdmin,
  getSubAdminById,
} from "../../apis/subadminapi";

const SubAdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🆔 Edit ID:", id);

  // ✅ Fetch Data When Editing
  useEffect(() => {
    if (isEdit) {
      const fetchSubAdmin = async () => {
        try {
          console.log("🚀 Fetching SubAdmin Data...");
          const res = await getSubAdminById(id);

          if (res?.success) {
            console.log("📥 Prefilling Data:", res.data);

            setFormData({
              name: res.data.name || "",
              countryCode: res.data.countryCode || "+91",
              phoneNumber: res.data.phoneNumber || "",
              email: res.data.email || "",
              address: res.data.address || "",
              city: res.data.city || "",
              pinCode: res.data.pinCode || "",
            });
          }
        } catch (err) {
          console.error("❌ Failed to load subadmin:", err);
          setError("Failed to load sub-admin data");
        }
      };

      fetchSubAdmin();
    }
  }, [id, isEdit]);

  // Handle Change
  const handleChange = (e) => {
    console.log("⌨️ Changed:", e.target.name, e.target.value);

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEdit) {
        console.log("✏️ Updating SubAdmin...");
        await updateSubAdmin(id, formData);
      } else {
        console.log("➕ Creating SubAdmin...");
        await createSubAdmin(formData);
      }

      navigate("/subadmin");
    } catch (err) {
      console.error("❌ Save Error:", err);
      setError("Failed to save sub-admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow border">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/subadmin")}
          className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to SubAdmins
        </button>

        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? "Edit Sub-Admin" : "Create Sub-Admin"}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="countryCode"
            placeholder="Country Code"
            value={formData.countryCode}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            name="pinCode"
            placeholder="Pincode"
            value={formData.pinCode}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubAdminForm;
