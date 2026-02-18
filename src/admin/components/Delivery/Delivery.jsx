import React, { useEffect, useState } from "react";
import {
  getDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  checkDeliveryByPincode,
} from "../../apis/Deliveryapi";

const Delivery = () => {
  console.log("🚀 Delivery Component Rendered");

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [pinCode, setPinCode] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const [formData, setFormData] = useState({
    deliveryType: "",
    min: "",
    max: "",
    unit: "DAY",
    discountType: "FLAT",
    discountValue: "",
    maxDiscountAmount: "",
    deliveryCharge: "",
    isActive: "true",
  });

  console.log("📦 Deliveries:", deliveries);
  console.log("📝 FormData:", formData);
  console.log("📍 CheckResult:", checkResult);

  // ================= FETCH DELIVERIES =================
  const fetchDeliveries = async () => {
    console.log("🔄 Fetching Deliveries...");
    try {
      setLoading(true);
      const res = await getDeliveries();
      console.log("✅ Get Deliveries Response:", res);

      if (res?.data?.success) {
        setDeliveries(res.data.data);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
      console.log("🛑 Fetch Finished");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    console.log("⌨️ Input Changed:", e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET =================
  const resetForm = () => {
    console.log("🔁 Reset Form");
    setFormData({
      deliveryType: "",
      min: "",
      max: "",
      unit: "DAY",
      discountType: "FLAT",
      discountValue: "",
      maxDiscountAmount: "",
      deliveryCharge: "",
      isActive: "true",
    });
    setEditId(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submit Clicked");

    const payload = {
      deliveryType: formData.deliveryType,
      deliveryDuration: {
        min: Number(formData.min),
        max: Number(formData.max),
        unit: formData.unit,
      },
      discount: {
        type: formData.discountType,
        value: Number(formData.discountValue),
        maxDiscountAmount: Number(formData.maxDiscountAmount),
      },
      deliveryCharge: Number(formData.deliveryCharge),
      isActive: formData.isActive === "true",
    };

    console.log("📤 Payload:", payload);

    try {
      if (editId) {
        console.log("✏️ Updating:", editId);
        await updateDelivery(editId, payload);
      } else {
        console.log("➕ Creating Delivery");
        await createDelivery(payload);
      }

      resetForm();
      fetchDeliveries();
    } catch (error) {
      console.error("❌ Submit error:", error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    console.log("✏️ Editing:", item);
    setEditId(item._id);

    setFormData({
      deliveryType: item.deliveryType,
      min: item.deliveryDuration?.min || "",
      max: item.deliveryDuration?.max || "",
      unit: item.deliveryDuration?.unit || "DAY",
      discountType: item.discount?.type || "FLAT",
      discountValue: item.discount?.value || "",
      maxDiscountAmount: item.discount?.maxDiscountAmount || "",
      deliveryCharge: item.deliveryCharge || "",
      isActive: item.isActive ? "true" : "false",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    console.log("🗑 Deleting:", id);
    try {
      await deleteDelivery(id);
      fetchDeliveries();
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  // ================= CHECK PINCODE =================
  const handleCheckDelivery = async () => {
    console.log("📍 Checking Pincode:", pinCode);

    try {
      const res = await checkDeliveryByPincode(pinCode);
      console.log("✅ Check Response:", res);

      if (res?.success) {
        setCheckResult(res.data);
      } else {
        setCheckResult(null);
      }
    } catch (error) {
      console.error("❌ Check error:", error);
      setCheckResult(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Delivery Management</h2>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 mb-8"
      >
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="deliveryType"
            placeholder="Delivery Type"
            value={formData.deliveryType}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="min"
            placeholder="Min Duration"
            value={formData.min}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="max"
            placeholder="Max Duration"
            value={formData.max}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="deliveryCharge"
            placeholder="Delivery Charge"
            value={formData.deliveryCharge}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Delivery" : "Create Delivery"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow-md rounded p-6 mb-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <tbody>
              {deliveries.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.deliveryType}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= PINCODE CHECK ================= */}
      <div className="bg-white shadow-md rounded p-6">
        <h3 className="text-xl font-semibold mb-4">
          Check Delivery by Pincode
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            className="border p-2 rounded w-60"
          />
          <button
            onClick={handleCheckDelivery}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Check
          </button>
        </div>

        {checkResult && (
          <div className="mt-6">
            <p className="font-semibold">
              Serviceable:{" "}
              {checkResult.isServiceable ? "✅ Yes" : "❌ No"}
            </p>

            {checkResult.deliveryOptions?.map((option) => (
              <div
                key={option._id}
                className="border p-4 mt-4 rounded bg-gray-50"
              >
                <p><strong>Type:</strong> {option.deliveryType}</p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {option.deliveryDuration.min} -{" "}
                  {option.deliveryDuration.max}{" "}
                  {option.deliveryDuration.unit}
                </p>
                <p>
                  <strong>Charge:</strong> ₹ {option.deliveryCharge}
                </p>
                <p>
                  <strong>Discount:</strong>{" "}
                  {option.discount?.type} - {option.discount?.value}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {option.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
