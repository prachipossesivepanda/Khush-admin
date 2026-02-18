import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBanner, updateBanner } from "../../apis/Splashapi";

const BannerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if id exists

  const [form, setForm] = useState({
    type: "PERCENT",
    text: "",
    discountType: "PERCENT",
    discount: "",
    navigate: "",
  });

  const [mobileBanner, setMobileBanner] = useState(null);
  const [desktopBanner, setDesktopBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation (because backend requires all fields)
    if (!form.type || !form.text || !form.discountType || !form.discount || !form.navigate) {
      alert("Please fill all required fields");
      return;
    }

    if (!mobileBanner && !id) {
      alert("Mobile banner is required");
      return;
    }

    if (!desktopBanner && !id) {
      alert("Desktop banner is required");
      return;
    }

    const formData = new FormData();

    // ✅ append normal fields
    formData.append("type", form.type);
    formData.append("text", form.text);
    formData.append("discountType", form.discountType);
    formData.append("discount", form.discount);

    // ✅ important: nested field
    formData.append("navigation[navigate]", form.navigate);

    // ✅ append files
    if (mobileBanner) formData.append("mobileBanner", mobileBanner);
    if (desktopBanner) formData.append("desktopBanner", desktopBanner);

    try {
      setLoading(true);

      if (id) {
        await updateBanner(id, formData);
        alert("Banner updated successfully ✅");
      } else {
        await createBanner(formData);
        alert("Banner created successfully ✅");
      }

      navigate("/admin/splash");
    } catch (err) {
      console.error("Banner error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save banner ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Banner" : "Create Banner"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text */}
        <input
          type="text"
          name="text"
          placeholder="Banner Text"
          value={form.text}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Type & Discount Type */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="PERCENT">PERCENT</option>
            <option value="FLAT">FLAT</option>
          </select>

          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="PERCENT">PERCENT</option>
            <option value="FLAT">FLAT</option>
          </select>
        </div>

        {/* Discount */}
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={form.discount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Navigation */}
        <input
          type="text"
          name="navigate"
          placeholder="Navigation Path (e.g. /collection)"
          value={form.navigate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Files */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="file"
            onChange={(e) => setMobileBanner(e.target.files[0])}
            className="border p-2 rounded"
          />
          <input
            type="file"
            onChange={(e) => setDesktopBanner(e.target.files[0])}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </form>
    </div>
  );
};

export default BannerForm;
